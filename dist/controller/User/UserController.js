'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const ajv_1 = __importDefault(require('ajv'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const validator_1 = __importDefault(require('../../utils/validator'));
class UserController {
  constructor(userDao) {
    this.updatedParameters = ['updatedIsActived'];
    this.salt = 10;
    this.ajv = new ajv_1.default({ allErrors: true });
    this.secretKey = process.env.APP_SECRET;
    this.userDao = userDao;
  }
  showUsers(user, logical = 'AND') {
    return __awaiter(this, void 0, void 0, function*() {
      this.query = 'SELECT * FROM Users u';
      this.parameters = [];
      let index = 0;
      if (user) {
        for (const prop in user) {
          if (
            user.hasOwnProperty(prop) &&
            user[prop] &&
            this.updatedParameters.indexOf(prop) === -1
          ) {
            if (index === 0) {
              this.query += ` WHERE u.${prop}=@${prop}`;
            } else {
              this.query += ` ${logical} u.${prop}=@${prop}`;
            }
            this.parameters.push({
              name: `@${prop}`,
              value: user[prop]
            });
          }
          index = index + 1;
        }
      }
      const querySpec = {
        query: this.query,
        parameters: this.parameters
      };
      return this.userDao
        .find(querySpec)
        .then(user => {
          return user;
        })
        .catch(err => {
          throw new Error(err);
        });
    });
  }
  loginUser(user) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        this.showUsers(user, 'OR')
          .then(result => {
            if (result.length <= 0) {
              return reject(new Error('No user registered'));
            }
            const resultUser = result[0];
            bcryptjs_1.default
              .compare(user.password, resultUser.password)
              .then(valid => {
                if (!valid) {
                  return reject(new Error("The password doesn't match"));
                }
                const newToken = this.generateToken(resultUser.id);
                return resolve(
                  Object.assign({}, resultUser, { token: newToken })
                );
              });
          })
          .catch(err => reject(new Error(err)));
      });
    });
  }
  addUser(user) {
    return __awaiter(this, void 0, void 0, function*() {
      // check if name or username is already exist
      return new Promise((resolve, reject) => {
        this.showUsers(user, 'OR').then(result => {
          if (result.length > 0) {
            return reject(new Error('Username or email is already exist'));
          }
          // validator
          const validateUserSchema = this.ajv.compile(
            validator_1.default.userSchema
          );
          const isUserValid = validateUserSchema(user);
          let errorUserMap;
          if (!isUserValid) {
            errorUserMap = validateUserSchema.errors.map(log => {
              const attr = log.dataPath.replace('.', '').toUpperCase();
              return `${attr} ${
                attr.toLowerCase() === 'password'
                  ? validator_1.default.log.password
                  : log.message
              }`;
            });
            return reject(new Error(errorUserMap.join(' && ')));
          }
          user.isActived = true;
          // if name is null
          // then username = name
          if (!user.name) {
            user.name = user.username;
          }
          bcryptjs_1.default
            .genSalt(this.salt)
            .then(salt => {
              bcryptjs_1.default
                .hash(user.password, salt)
                .then(hash => {
                  // change the naked password
                  // to hash
                  user.password = hash;
                  this.userDao
                    .addItem(user)
                    .then(user => {
                      return resolve(user);
                    })
                    .catch(err => {
                      return reject(new Error(err));
                    });
                })
                .catch(err => reject(new Error(err)));
            })
            .catch(err => reject(new Error(err)));
        });
      });
    });
  }
  updateUser_V1(user, updatedIsActived) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        let userFind = {};
        updatedIsActived == null
          ? (userFind.isActived = true)
          : (userFind = user);
        this.showUsers(userFind)
          .then(users => {
            if (users.length === 0) {
              return reject(new Error('No user registered'));
            }
            if (users.length > 1) {
              return reject(
                new Error(
                  `There are ${users.length} users found who are actived. ` +
                    'Please inactive the others'
                )
              );
            }
            if (updatedIsActived != null) {
              user.isActived = updatedIsActived;
            }
            const userClone = Object.assign({}, users[0]);
            this.userDao
              .updateItem(userClone.id, user)
              .then(replaced => {
                return resolve(replaced);
              })
              .catch(err => {
                return reject(err);
              });
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }
  updateUser(idUser, user) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        const updatedUser = Object.assign({}, user);
        this.userDao
          .updateItem(idUser, updatedUser)
          .then(replaced => resolve(replaced))
          .catch(err => reject(err));
      });
    });
  }
  updateEducation_V1(education) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        this.showUsers({ isActived: true }).then(users => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }
          if (users.length > 1) {
            return reject(
              new Error(
                `There are ${users.length} users found. Please specify more`
              )
            );
          }
          const userClone = Object.assign({}, users[0]);
          const educationClone = Object.assign({}, education);
          if (!userClone.education) {
            userClone.education = [];
          }
          userClone.education.push(education);
          this.userDao
            .updateItem(userClone.id, { education: userClone.education })
            .then(replaced => {
              return resolve(replaced);
            })
            .catch(err => {
              return reject(err);
            });
        });
      });
    });
  }
  updateEducation(user, education) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        const userClone = Object.assign({}, user);
        const educationClone = Object.assign({}, education);
        if (!userClone.education) {
          userClone.education = [];
        }
        userClone.education.push(education);
        this.userDao
          .updateItem(userClone.id, { education: userClone.education })
          .then(replaced => {
            return resolve(replaced);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }
  updateExperience_V1(experience) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        this.showUsers({ isActived: true }).then(users => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }
          if (users.length > 1) {
            return reject(
              new Error(
                `There are ${users.length} users found. Please specify more`
              )
            );
          }
          const userClone = Object.assign({}, users[0]);
          const experienceClone = Object.assign({}, experience);
          if (!userClone.experience) {
            userClone.experience = [];
          }
          userClone.experience.push(experience);
          this.userDao
            .updateItem(userClone.id, { experience: userClone.experience })
            .then(replaced => {
              return resolve(replaced);
            })
            .catch(err => {
              return reject(err);
            });
        });
      });
    });
  }
  updateExperience(user, experience) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        const userClone = Object.assign({}, user);
        const experienceClone = Object.assign({}, experience);
        if (!userClone.experience) {
          userClone.experience = [];
        }
        userClone.experience.push(experience);
        this.userDao
          .updateItem(userClone.id, { experience: userClone.experience })
          .then(replaced => {
            return resolve(replaced);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }
  updateProject_V1(project) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        this.showUsers({ isActived: true }).then(users => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }
          if (users.length > 1) {
            return reject(
              new Error(
                `There are ${users.length} users found. Please specify more`
              )
            );
          }
          const userClone = Object.assign({}, users[0]);
          const projectClone = Object.assign({}, project);
          if (!userClone.project) {
            userClone.project = [];
          }
          userClone.project.push(project);
          this.userDao
            .updateItem(userClone.id, { project: userClone.project })
            .then(replaced => {
              return resolve(replaced);
            })
            .catch(err => {
              return reject(err);
            });
        });
      });
    });
  }
  updateProject(user, project) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        const userClone = Object.assign({}, user);
        const projectClone = Object.assign({}, project);
        if (!userClone.project) {
          userClone.project = [];
        }
        userClone.project.push(project);
        this.userDao
          .updateItem(userClone.id, { project: userClone.project })
          .then(replaced => {
            return resolve(replaced);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }
  deleteUser(user) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        this.showUsers(user, 'OR').then(users => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }
          if (users.length > 1) {
            return reject(
              new Error(
                `There are ${users.length} users found. Please specify more`
              )
            );
          }
          // comparing password
          const resultUser = users[0];
          bcryptjs_1.default
            .compare(user.password, resultUser.password)
            .then(valid => {
              if (!valid) {
                return reject(new Error("The password doesn't match"));
              }
              const userClone = Object.assign({}, users[0]);
              this.userDao
                .deleteItem(userClone.id)
                .then(() => {
                  return resolve(userClone);
                })
                .catch(err => {
                  return reject(err);
                });
            })
            .catch(err => {
              return reject(new Error(err));
            });
        });
      });
    });
  }
  generateToken(id) {
    const payload = { id };
    return jsonwebtoken_1.default.sign(payload, this.secretKey, {
      expiresIn: '1y'
    });
  }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map

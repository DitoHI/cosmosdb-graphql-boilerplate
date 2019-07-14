import { SqlParameter, SqlQuerySpec } from '@azure/cosmos';
import bcryptjs from 'bcryptjs';
import { default as Ajv } from 'ajv';
import { default as jwt } from 'jsonwebtoken';

import Dao from '../../model/Dao';
import validator from '../../utils/validator';
import { IUser } from '../../model/User/UserModel';

class UserController {
  public userDao: Dao;
  public query: string;
  public parameters: SqlParameter[];
  private updatedParameters: string[] = ['updatedIsActived'];
  private salt: number = 10;
  private ajv = new Ajv({ allErrors: true });
  private secretKey = process.env.APP_SECRET;

  constructor(userDao: Dao) {
    this.userDao = userDao;
  }

  async showUsers(user?: any, logical: string = 'AND') {
    this.query = 'SELECT * FROM Users u';
    this.parameters = [];
    let index: number = 0;
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

    const querySpec: SqlQuerySpec = {
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
  }

  async loginUser(user?: any) {
    return new Promise((resolve, reject) => {
      this.showUsers(user, 'OR')
        .then(result => {
          if (result.length <= 0) {
            return reject(new Error('No user registered'));
          }

          const resultUser: IUser = result[0];
          bcryptjs.compare(user.password, resultUser.password).then(valid => {
            if (!valid) {
              return reject(new Error("The password doesn't match"));
            }

            const newToken = this.generateToken(resultUser.id);
            return resolve({
              ...resultUser,
              token: newToken
            });
          });
        })
        .catch(err => reject(new Error(err)));
    });
  }

  async addUser(user?: any) {
    // check if name or username is already exist
    return new Promise((resolve, reject) => {
      this.showUsers(user, 'OR').then(result => {
        if (result.length > 0) {
          return reject(new Error('Username or email is already exist'));
        }

        // validator
        const validateUserSchema = this.ajv.compile(validator.userSchema);
        const isUserValid = validateUserSchema(user);
        let errorUserMap: string[];
        if (!isUserValid) {
          errorUserMap = validateUserSchema.errors.map(log => {
            const attr = log.dataPath.replace('.', '').toUpperCase();
            return `${attr} ${
              attr.toLowerCase() === 'password'
                ? validator.log.password
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
        bcryptjs
          .genSalt(this.salt)
          .then(salt => {
            bcryptjs
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
  }

  async updateUser_V1(user?: any, updatedIsActived?: Boolean) {
    return new Promise((resolve, reject) => {
      let userFind: any = {};
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
  }

  async updateUser(idUser: string, user?: any) {
    return new Promise((resolve, reject) => {
      const updatedUser = Object.assign({}, user);
      console.log(user);

      this.userDao
        .updateItem(idUser, updatedUser)
        .then(replaced => resolve(replaced))
        .catch(err => reject(err));
    });
  }

  async updateEducation_V1(education: any) {
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
  }

  async updateEducation(user: any, education: any) {
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
  }

  async updateExperience_V1(experience: any) {
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
  }

  async updateExperience(user: any, experience: any) {
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
  }

  async updateProject_V1(project: any) {
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
  }

  async updateProject(user: any, project: any) {
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
  }

  async deleteUser(user?: any) {
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
        const resultUser: IUser = users[0];
        bcryptjs
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
  }

  generateToken(id: String) {
    const payload = { id };

    return jwt.sign(payload, this.secretKey, { expiresIn: '1y' });
  }
}

export default UserController;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(userDao) {
        this.updatedParameters = ['updatedIsActived'];
        this.userDao = userDao;
    }
    showUsers(user, logical = 'AND') {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = 'SELECT * FROM Users u';
            this.parameters = [];
            let index = 0;
            if (user) {
                for (const prop in user) {
                    if (user.hasOwnProperty(prop) && user[prop] &&
                        this.updatedParameters.indexOf(prop) === -1) {
                        if (index === 0) {
                            this.query += ` WHERE u.${prop}=@${prop}`;
                        }
                        else {
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
                .then((user) => {
                return user;
            })
                .catch((err) => {
                throw new Error(err);
            });
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if name or username is already exist
            return new Promise((resolve, reject) => {
                this
                    .showUsers(user, 'OR')
                    .then((result) => {
                    if (result.length > 0) {
                        return reject(new Error('Username or email is already exist'));
                    }
                    user.isActived = true;
                    this.userDao
                        .addItem(user)
                        .then((user) => {
                        return resolve(user);
                    })
                        .catch((err) => {
                        return reject(new Error(err));
                    });
                });
            });
        });
    }
    updateUser(user, updatedIsActived) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let userFind = {};
                updatedIsActived == null
                    ? userFind.isActived = true
                    : userFind = user;
                this
                    .showUsers(userFind)
                    .then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found who are actived. ` +
                            'Please inactive the others'));
                    }
                    if (updatedIsActived != null) {
                        user.isActived = updatedIsActived;
                    }
                    const userClone = Object.assign({}, users[0]);
                    this.userDao
                        .updateItem(userClone.id, user)
                        .then((replaced) => {
                        return resolve(replaced);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                })
                    .catch((err) => {
                    return reject(err);
                });
            });
        });
    }
    updateEducation(education) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this
                    .showUsers({ isActived: true })
                    .then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found. Please specify more`));
                    }
                    const userClone = Object.assign({}, users[0]);
                    const educationClone = Object.assign({}, education);
                    if (!userClone.education) {
                        userClone.education = [];
                    }
                    userClone.education.push(education);
                    this.userDao
                        .updateItem(userClone.id, { education: userClone.education })
                        .then((replaced) => {
                        return resolve(replaced);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                });
            });
        });
    }
    updateExperience(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this
                    .showUsers({ isActived: true })
                    .then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found. Please specify more`));
                    }
                    const userClone = Object.assign({}, users[0]);
                    const experienceClone = Object.assign({}, experience);
                    if (!userClone.experience) {
                        userClone.experience = [];
                    }
                    userClone.experience.push(experience);
                    this.userDao
                        .updateItem(userClone.id, { experience: userClone.experience })
                        .then((replaced) => {
                        return resolve(replaced);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                });
            });
        });
    }
    updateProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this
                    .showUsers({ isActived: true })
                    .then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found. Please specify more`));
                    }
                    const userClone = Object.assign({}, users[0]);
                    const projectClone = Object.assign({}, project);
                    if (!userClone.project) {
                        userClone.project = [];
                    }
                    userClone.project.push(project);
                    this.userDao
                        .updateItem(userClone.id, { project: userClone.project })
                        .then((replaced) => {
                        return resolve(replaced);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                });
            });
        });
    }
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.showUsers(user)
                    .then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found. Please specify more`));
                    }
                    const userClone = Object.assign({}, users[0]);
                    this.userDao
                        .deleteItem(userClone.id)
                        .then(() => {
                        return resolve(userClone);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                });
            });
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map
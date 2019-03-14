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
            this.query = 'SELECT * FROM root r';
            this.parameters = [];
            let index = 0;
            if (user) {
                for (const prop in user) {
                    if (user.hasOwnProperty(prop) && user[prop] &&
                        this.updatedParameters.indexOf(prop) === -1) {
                        if (index === 0) {
                            this.query += ` WHERE r.${prop}=@${prop}`;
                        }
                        else {
                            this.query += ` ${logical} r.${prop}=@${prop}`;
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
            return this.userDao.find(querySpec).then((user) => {
                return user;
            }).catch((err) => {
                throw new Error(err);
            });
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if name or username is already exist
            return new Promise((resolve, reject) => {
                this.showUsers(user, 'OR').then((result) => {
                    if (result.length > 0) {
                        return reject(new Error('Username or email is already exist'));
                    }
                    this.userDao.addUser(user).then((user) => {
                        return resolve(user);
                    }).catch((err) => {
                        return reject(new Error(err));
                    });
                });
            });
        });
    }
    updateUser(user, updatedIsActived) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.showUsers(user).then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found who are actived. ` +
                            'Please inactive the others'));
                    }
                    console.log(users);
                    if (updatedIsActived) {
                        user.isActived = updatedIsActived;
                    }
                    const userClone = Object.assign({}, users[0]);
                    this.userDao.updateUser(userClone.id, user).then((replaced) => {
                        return resolve(replaced);
                    }).catch((err) => {
                        return reject(err);
                    });
                }).catch((err) => {
                    return reject(err);
                });
            });
        });
    }
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.showUsers(user).then((users) => {
                    if (users.length === 0) {
                        return reject(new Error('No user registered'));
                    }
                    if (users.length > 1) {
                        return reject(new Error(`There are ${users.length} users found. Please specify more`));
                    }
                    const userClone = Object.assign({}, users[0]);
                    this.userDao.deleteUser(userClone.id).then(() => {
                        return resolve(user);
                    }).catch((err) => {
                        return reject(err);
                    });
                });
            });
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map
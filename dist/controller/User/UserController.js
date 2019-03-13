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
        this.userDao = userDao;
    }
    showUsers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = 'SELECT * FROM root r';
            this.parameters = [];
            let index = 0;
            if (user) {
                for (const prop in user) {
                    if (user.hasOwnProperty(prop) && user[prop]) {
                        if (index === 0) {
                            this.query += ` WHERE r.${prop}=@${prop}`;
                        }
                        else {
                            this.query += ` AND r.${prop}=@${prop}`;
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
                if (user.length === 0) {
                    throw new Error('User not found');
                }
                return user;
            }).catch((err) => {
                throw new Error(err);
            });
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDao.addUser(user).then((user) => {
                return user;
            }).catch((err) => {
                throw new Error(err);
            });
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map
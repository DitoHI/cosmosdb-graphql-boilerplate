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
    showUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const querySpec = {
                query: 'SELECT * FROM root r WHERE r.isActived=@isActived',
                parameters: [
                    {
                        name: '@isActived',
                        value: true,
                    }
                ]
            };
            return this.userDao.find(querySpec).then((user) => {
                return user;
            }).catch((err) => {
                return err;
            });
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDao.addUser(user).then((user) => {
                return user;
            }).catch((err) => {
                return err;
            });
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map
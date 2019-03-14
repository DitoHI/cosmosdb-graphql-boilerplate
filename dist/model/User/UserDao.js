"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dao_1 = __importDefault(require("../Dao"));
class UserDao extends Dao_1.default {
    constructor(cosmosClient, databaseId, containerId) {
        super(cosmosClient, databaseId, containerId);
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.isActived = true;
            return this.container.items.create(user).then((result) => {
                return result.body;
            }).catch((err) => {
                return err;
            });
        });
    }
    updateUser(userId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getItem(userId).then((doc) => {
                if (doc == null) {
                    return new Error('No user found');
                }
                for (const key in user) {
                    if (user.hasOwnProperty(key)) {
                        doc[key] = user[key];
                    }
                }
                return this.container.item(userId).replace(doc).then((result) => {
                    return result.body;
                }).catch((err) => {
                    return err;
                });
            });
        });
    }
    getItem(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.container.item(userId).read().then((result) => {
                return result.body;
            }).catch((err) => {
                return err;
            });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getItem(userId).then((result) => {
                if (result == null) {
                    return new Error('No user found');
                }
                this.container.item(userId).delete().catch((err) => {
                    return new Error(err);
                });
            });
        });
    }
}
exports.default = UserDao;
//# sourceMappingURL=UserDao.js.map
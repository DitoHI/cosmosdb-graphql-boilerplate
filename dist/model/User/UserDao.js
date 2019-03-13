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
            return this.container.items.create(user).then((body) => {
                return body;
            }).catch((err) => {
                return err;
            });
        });
    }
    updateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getItem(userId).then((doc) => {
                this.container.item(userId).replace(doc).then((replaced) => {
                    return replaced;
                }).catch((err) => {
                    return err;
                });
            });
        });
    }
    getItem(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.container.item(userId).read().then((body) => {
                return body;
            }).catch((err) => {
                return err;
            });
        });
    }
}
exports.default = UserDao;
//# sourceMappingURL=UserDao.js.map
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
const cosmos_1 = require("@azure/cosmos");
const Config_1 = require("./Config");
const UserDao_1 = __importDefault(require("../model/User/UserDao"));
const UserController_1 = __importDefault(require("../controller/User/UserController"));
class Client {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const cosmosClient = new cosmos_1.CosmosClient({
                auth: {
                    masterKey: Config_1.config.authKey,
                },
                endpoint: Config_1.config.host,
            });
            const userDao = new UserDao_1.default(cosmosClient, Config_1.config.databaseId, Config_1.config.containerUserId);
            const userController = new UserController_1.default(userDao);
            userDao.init().then(() => {
                this.log = 'Successful configure user';
            }).catch((err) => {
                this.log = err;
                return err;
            });
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map
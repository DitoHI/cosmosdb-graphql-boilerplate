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
const cosmos_1 = require('@azure/cosmos');
const Config_1 = require('./Config');
const Dao_1 = __importDefault(require('../model/Dao'));
const UserController_1 = __importDefault(
  require('../controller/User/UserController')
);
const BlogController_1 = __importDefault(
  require('../controller/Blog/BlogController')
);
class Client {
  constructor() {
    this.log = 'Successfully configure container';
  }
  init() {
    return __awaiter(this, void 0, void 0, function*() {
      const cosmosClient = new cosmos_1.CosmosClient({
        auth: {
          masterKey: Config_1.config.authKey
        },
        endpoint: Config_1.config.host
      });
      this.userDao = new Dao_1.default(
        cosmosClient,
        Config_1.config.databaseId,
        Config_1.config.containerUserId
      );
      this.blogDao = new Dao_1.default(
        cosmosClient,
        Config_1.config.databaseId,
        Config_1.config.containerBlogId
      );
      this.userController = new UserController_1.default(this.userDao);
      this.blogController = new BlogController_1.default(this.blogDao);
      this.userDao
        .init()
        .then(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Database user connected');
          }
        })
        .catch(err => {
          console.log(err.body);
        });
      this.blogDao
        .init()
        .then(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Database blog connected');
          }
        })
        .catch(err => {
          console.log(err.body);
        });
      return this.log;
    });
  }
}
const client = new Client();
exports.default = client;
//# sourceMappingURL=Client.js.map

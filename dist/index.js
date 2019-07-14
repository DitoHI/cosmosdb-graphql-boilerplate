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
const express_1 = __importDefault(require('express'));
const morgan_1 = __importDefault(require('morgan'));
require('dotenv').config();
const apollo_server_express_1 = require('apollo-server-express');
const schema_1 = __importDefault(require('./schema'));
const Client_1 = __importDefault(require('./cosmos/Client'));
const startServer = () =>
  __awaiter(this, void 0, void 0, function*() {
    const app = express_1.default();
    const port = process.env.PORT || 3000; // default port to listen
    // initalize cosmosDB intializer
    Client_1.default.init().catch(err => {
      throw new Error(err);
    });
    // middleware
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan_1.default('combined'));
    }
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    const server = new apollo_server_express_1.ApolloServer({
      schema: schema_1.default,
      context: ({ req }) => ({
        req,
        blogController: Client_1.default.blogController,
        userController: Client_1.default.userController
      })
    });
    const origin =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `${process.env.WEB_URI}`;
    console.log(origin);
    server.applyMiddleware({
      app,
      cors: {
        origin,
        credentials: true
      }
    });
    // start the Express server
    app.listen(port, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Server started at PORT ${port}`);
      }
    });
  });
startServer();
//# sourceMappingURL=index.js.map

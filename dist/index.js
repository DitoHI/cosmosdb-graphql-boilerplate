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
const passport_1 = __importDefault(require('passport'));
const apollo_server_express_1 = require('apollo-server-express');
const apollo_upload_server_1 = require('apollo-upload-server');
require('dotenv').config();
const passportInitializer_1 = __importDefault(
  require('./utils/passportInitializer')
);
const schema_1 = __importDefault(require('./schema'));
const Client_1 = __importDefault(require('./cosmos/Client'));
const startServer = () =>
  __awaiter(this, void 0, void 0, function*() {
    const port = process.env.PORT || 3000; // default port to listen
    const app = express_1.default();
    app.use(apollo_upload_server_1.apolloUploadExpress());
    // initialize cosmosDB initializer
    Client_1.default
      .init()
      .then()
      .catch(err => {
        throw new Error(err);
      });
    passport_1.default.use(
      passportInitializer_1.default(Client_1.default.userController)
    );
    app.use('/graphql', (req, res, next) => {
      passport_1.default.authenticate('jwt', { session: true }, (err, user) => {
        if (user) {
          req.user = user;
        }
        next();
      })(req, res, next);
    });
    const server = new apollo_server_express_1.ApolloServer({
      schema: schema_1.default,
      context: ({ req }) => ({
        userFromJwt: req.user,
        blogController: Client_1.default.blogController,
        userController: Client_1.default.userController
      })
    });
    server.applyMiddleware({ app, path: '/graphql' });
    // start the Express server
    app.listen({ port }, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Server started at PORT ${port}`);
      }
    });
  });
startServer()
  .then()
  .catch();
//# sourceMappingURL=index.js.map

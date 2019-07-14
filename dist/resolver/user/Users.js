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
const graphql_scalars_1 = require('@okgrow/graphql-scalars');
const common_1 = __importDefault(require('../../utils/common'));
exports.typeDef = `
  type Education {
    dateStart: DateTime,
    dateEnd: DateTime,
    location: String,
    name: String,
    degree: String,
    major: String,
    description: String,
  }

  type Experience {
    name: String,
    role: String,
    description: String,
    dateStart: DateTime,
    dateEnd: DateTime,
  }

  type Project {
    name: String,
    role: String,
    techStacks: [String],
    description: String,
    link: URL,
  }

  type User {
    id: ID!,
    username: String!,
    password: String!,
    name: String!,
    email: String!,
    occupation: String,
    phone: String,
    address: String,
    website: URL,
    dateBirth: DateTime,
    skill: [String],
    education: [Education],
    experience: [Experience],
    project: [Project],
    isActived: Boolean,
  }
  
  type PublicUser {
    name: String!,
    username: String!,
    email: String!,
    occupation: String,
    website: String,
    isActived: String,
  }
  
  extend type User {
    token: String
  }
`;
exports.resolvers = {
  DateTime: graphql_scalars_1.DateTime,
  URL: graphql_scalars_1.URL,
  Mutation: {
    addUser: (_, user, { userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return userController
          .addUser(user)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    loginUser: (_, user, { userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return userController
          .loginUser(user)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    deleteUser: (_, user, { userFromJwt, userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        return userController
          .deleteUser(user)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    updateStatus: (_, user, { userFromJwt, userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt, false);
        return userController
          .updateUser(userFromJwt.id, user)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    updateUser: (_, user, { userFromJwt, userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        user.isActived = true;
        return userController
          .updateUser(userFromJwt.id, user)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    updateEducation: (_, education, { userFromJwt, userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        return userController
          .updateEducation(userFromJwt, education)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    updateExperience: (_, experience, { userFromJwt, userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        return userController
          .updateExperience(userFromJwt, experience)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      }),
    updateProject: (_, project, { userFromJwt, userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        return userController
          .updateProject(userFromJwt, project)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          });
      })
  },
  Query: {
    me: (_, {}, { userFromJwt }) =>
      __awaiter(this, void 0, void 0, function*() {
        return userFromJwt;
      }),
    users: (_, user, { userController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return userController.showUsers(user).then(result => {
          if (result.length === 0) {
            throw new Error('user not found');
          }
          return result;
        });
      })
  }
};
//# sourceMappingURL=Users.js.map

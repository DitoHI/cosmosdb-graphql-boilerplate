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
const graphql_scalars_1 = require("@okgrow/graphql-scalars");
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

  type Mutation {
    addUser(name: String!, email: String!): User
    deleteUser(name: String!, email: String!): User
    updateStatus(name: String!, email: String!, updatedIsActived: Boolean!): User
    updateEducation(name: String, degree: String, major: String, dateStart: DateTime,
                    dateEnd: DateTime, location: String, description: String): User
    updateExperience(name: String, role: String, description: String,
                     dateStart: DateTime, dateEnd: DateTime): User
    updateProject(name: String, role: String, techStacks: [String],
                  description: String, link: URL): User
    updateUser(occupation: String, phone: String, address: String,
               website: URL, dateBirth: DateTime, skill: [String]
               ): User
  }

  type Query {
    me: User
    users(name: String, email: String): [User]
  }

  scalar DateTime
  scalar URL
`;
exports.resolvers = {
    DateTime: graphql_scalars_1.DateTime,
    URL: graphql_scalars_1.URL,
    Mutation: {
        addUser: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .addUser(user)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
        deleteUser: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .deleteUser(user)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
        updateStatus: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .updateUser(user, user.updatedIsActived)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
        updateUser: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            user.isActived = true;
            return userController
                .updateUser(user)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
        updateEducation: ((_, education, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .updateEducation(education)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
        updateExperience: ((_, experience, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .updateExperience(experience)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
        updateProject: ((_, project, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .updateProject(project)
                .then((result) => {
                return result;
            })
                .catch((err) => {
                throw err;
            });
        })),
    },
    Query: {
        me: ((_, {}, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .showUsers({ isActived: true })
                .then((result) => {
                if (result.length > 1) {
                    throw new Error(`There are ${result.length} users found who are actived. ` +
                        'Please inactive the others');
                }
                return result[0];
            });
        })),
        users: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController
                .showUsers(user)
                .then((result) => {
                if (result.length === 0) {
                    throw new Error('user not found');
                }
                return result;
            });
        })),
    },
};
//# sourceMappingURL=Users.js.map

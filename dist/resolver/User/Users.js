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
const ISODate_1 = __importDefault(require("../../scalar/ISODate"));
exports.typeDef = `
  type Education {
    dateStart: ISODate,
    dateEnd: ISODate,
    location: String,
    name: String,
    description: String
  }

  type Experience {
    name: String,
    role: String,
    description: String
  }

  type Project {
    techStacks: [String],
    description: String,
    link: String
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    occupation: String,
    phone: String,
    address: String,
    website: String,
    dateBirth: ISODate,
    skill: [String],
    education: Education,
    experience: Experience,
    project: Project,
    isActived: Boolean,
  }

  type Mutation {
    addUser(name: String!, email: String!): User
    deleteUser(name: String!, email: String!): User
    updateStatus(name: String!, email: String!, updatedIsActived: Boolean!): User
    updateEducation(name: String, dateStart: ISODate, dateEnd: ISODate,
                    location: String, description: String): User
    updateExperience(name: String, role: String, description: String): User
    updateProject(techStacks: [String], description: String, link: String): User
    updateUser(occupation: String, phone: String, address: String,
               website: String, dateBirth: ISODate
               ): User
  }

  type Query {
    me: User
    users(name: String, email: String): [User]
  }

  scalar ISODate
`;
exports.resolvers = {
    ISODate: ISODate_1.default,
    Mutation: {
        addUser: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.addUser(user).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
        deleteUser: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.deleteUser(user).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
        updateStatus: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.updateUser(user, user.updatedIsActived).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
        updateUser: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            user.isActived = true;
            return userController.updateUser(user).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
        updateEducation: ((_, education, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.updateEducation(education).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
        updateExperience: ((_, experience, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.updateExperience(experience).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
        updateProject: ((_, project, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.updateProject(project).then((result) => {
                return result;
            }).catch((err) => {
                throw err;
            });
        })),
    },
    Query: {
        me: ((_, {}, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.showUsers({ isActived: true }).then((result) => {
                if (result.length > 1) {
                    throw new Error(`There are ${result.length} users found who are actived. ` +
                        'Please inactive the others');
                }
                return result[0];
            });
        })),
        users: ((_, user, { userController }) => __awaiter(this, void 0, void 0, function* () {
            return userController.showUsers(user).then((result) => {
                if (result.length === 0) {
                    throw new Error('User not found');
                }
                return result;
            });
        })),
    },
};
//# sourceMappingURL=Users.js.map
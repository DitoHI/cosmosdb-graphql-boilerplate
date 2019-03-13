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
exports.typeDef = `
  type Education {
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
    name: String,
    occupation: String,
    email: String,
    phone: String,
    address: String,
    website: String,
    skill: [String],
    education: Education,
    Experience: Experience,
    Project: Project
  }

  type Query {
    me: User
  }
`;
exports.resolvers = {
    Query: {
        me: ((_, {}, { userController }) => __awaiter(this, void 0, void 0, function* () {
            console.log(userController);
        })),
    },
};
//# sourceMappingURL=Users.js.map
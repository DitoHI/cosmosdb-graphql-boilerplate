import { IResolvers } from 'graphql-tools';
import ISODate from '../../scalar/ISODate';

export const typeDef = `
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
    name: String!,
    email: String!,
    occupation: String,
    phone: String,
    address: String,
    website: String,
    dateBirth: ISODate,
    skill: [String],
    education: Education,
    Experience: Experience,
    Project: Project,
    isActived: Boolean,
  }

  type Mutation {
    addUser(name: String!, email: String!): User
  }

  type Query {
    users(name: String, email: String): [User]
  }

  scalar ISODate
`;

export const resolvers: IResolvers = {
  ISODate,
  Mutation: {
    addUser: (async (_, user, { userController }) => {
      return userController.addUser(user).then((result: any) => {
        return result;
      }).catch((err: string) => {
        throw new Error(err);
      });
    }),
  },
  Query: {
    users: (async (_, user, { userController }) => {
      return userController.showUsers(user).then((result: any) => {
        if (result.length === 0) {
          throw new Error('User not found');
        }
        return result;
      });
    }),
  },
};

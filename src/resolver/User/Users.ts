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
    deleteUser(name: String!, email: String!): User
    updateStatus(name: String!, email: String!, updatedIsActived: Boolean!): User
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

export const resolvers: IResolvers = {
  ISODate,
  Mutation: {
    addUser: (async (_, user, { userController }) => {
      return userController.addUser(user).then((result: any) => {
        return result;
      }).catch((err: Error) => {
        throw err;
      });
    }),
    deleteUser: (async (_, user, { userController }) => {
      return userController.deleteUser(user).then((result: any) => {
        return result;
      }).catch((err: any) => {
        throw err;
      });
    }),
    updateStatus: (async (_, user , { userController }) => {
      return userController.updateUser(user, user.updatedIsActived).then((result: any) => {
        return result;
      }).catch((err: Error) => {
        throw err;
      });
    }),
    updateUser: (async (_, user, { userController }) => {
      user.isActived = true;
      return userController.updateUser(user).then((result: any) => {
        return result;
      }).catch((err: Error) => {
        throw err;
      });
    }),
  },
  Query: {
    me: (async (_, {}, { userController }) => {
      return userController.showUsers({ isActived: true }).then((result: any) => {
        if (result.length > 1) {
          throw new Error(`There are ${result.length} users found who are actived. ` +
            'Please inactive the others');
        }
        return result[0];
      });
    }),
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

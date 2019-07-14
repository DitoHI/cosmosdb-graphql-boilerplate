import { IResolvers } from 'graphql-tools';
import { DateTime, URL } from '@okgrow/graphql-scalars';

import common from '../../utils/common';

export const typeDef = `
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

export const resolvers: IResolvers = {
  DateTime,
  URL,
  Mutation: {
    addUser: async (_, user, { userController }) => {
      return userController
        .addUser(user)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    loginUser: async (_, user, { userController }) => {
      return userController
        .loginUser(user)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    deleteUser: async (_, user, { userFromJwt, userController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return userController
        .deleteUser(user)
        .then((result: any) => {
          return result;
        })
        .catch((err: any) => {
          throw err;
        });
    },
    updateStatus: async (_, user, { userFromJwt, userController }) => {
      common.exitAppIfUnauthorized(userFromJwt, false);

      return userController
        .updateUser(userFromJwt.id, user)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    updateUser: async (_, user, { userFromJwt, userController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      user.isActived = true;
      return userController
        .updateUser(userFromJwt.id, user)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    updateEducation: async (_, education, { userFromJwt, userController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return userController
        .updateEducation(userFromJwt, education)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    updateExperience: async (
      _,
      experience,
      { userFromJwt, userController }
    ) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return userController
        .updateExperience(userFromJwt, experience)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    updateProject: async (_, project, { userFromJwt, userController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return userController
        .updateProject(userFromJwt, project)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }
  },
  Query: {
    me: async (_, {}, { userFromJwt }) => {
      return userFromJwt;
    },
    users: async (_, user, { userController }) => {
      return userController.showUsers(user).then((result: any) => {
        if (result.length === 0) {
          throw new Error('user not found');
        }
        return result;
      });
    }
  }
};

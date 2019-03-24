import { IResolvers } from 'graphql-tools';
import { DateTime, URL } from '@okgrow/graphql-scalars';

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
`;

export const resolvers: IResolvers = {
  DateTime,
  URL,
  Mutation: {
    addUser: (async (_, user, { userController }) => {
      return userController
        .addUser(user)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
    deleteUser: (async (_, user, { userController }) => {
      return userController
        .deleteUser(user)
        .then((result: any) => {
          return result;
        })
        .catch((err: any) => {
          throw err;
        });
    }),
    updateStatus: (async (_, user , { userController }) => {
      return userController
        .updateUser(user, user.updatedIsActived)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
    updateUser: (async (_, user, { userController }) => {
      user.isActived = true;
      return userController
        .updateUser(user)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
    updateEducation: (async (_, education, { userController }) => {
      return userController
        .updateEducation(education)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
    updateExperience: (async (_, experience, { userController }) => {
      return userController
        .updateExperience(experience)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
    updateProject: (async (_, project, { userController }) => {
      return userController
        .updateProject(project)
        .then((result: any) => {
          return result;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
  },
  Query: {
    me: (async (_, {}, { userController }) => {
      return userController
        .showUsers({ isActived: true })
        .then((result: any) => {
          if (result.length > 1) {
            throw new Error(`There are ${result.length} users found who are actived. ` +
            'Please inactive the others');
          }
          return result[0];
        });
    }),
    users: (async (_, user, { userController }) => {
      return userController
        .showUsers(user)
        .then((result: any) => {
          if (result.length === 0) {
            throw new Error('user not found');
          }
          return result;
        });
    }),
  },
};

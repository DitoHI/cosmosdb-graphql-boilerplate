import { IResolvers } from 'graphql-tools';

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

export const resolvers: IResolvers = {
  Query: {
    me: (async (_, {}, { userController }) => {
      console.log(userController);
    }),
  },
};

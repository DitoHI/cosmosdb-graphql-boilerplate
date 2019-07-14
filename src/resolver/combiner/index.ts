import {
  mutationDef as UserMutationDef,
  queryDef as UserQueryDef
} from '../user/UserTypeDef';

import {
  mutationDef as BlogMutationDef,
  queryDef as BlogQueryDef
} from '../blog/BlogTypeDef';

export const resolversTypeDef = `
  type Mutation {
    ${UserMutationDef}
    ${BlogMutationDef}
  }

  type Query {
    ${UserQueryDef}
    ${BlogQueryDef}
  }

  scalar DateTime
  scalar URL
`;

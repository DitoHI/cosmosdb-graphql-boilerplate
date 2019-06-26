import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import {
  typeDef as User,
  resolvers as UserResolvers
} from '../resolver/user/Users';

import {
  typeDef as Blog,
  resolvers as BlogResolvers
} from '../resolver/blog/Blog';

import { resolversTypeDef } from '../resolver/combiner';

export default makeExecutableSchema({
  typeDefs: [User, Blog, resolversTypeDef],
  resolvers: merge(UserResolvers, BlogResolvers)
});

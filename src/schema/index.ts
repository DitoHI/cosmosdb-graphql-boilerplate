import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import {
  typeDef as User,
  resolvers as UserResolvers,
} from '../resolver/User/Users';

export default makeExecutableSchema({
  typeDefs: [User],
  resolvers: merge(UserResolvers),
});

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const lodash_1 = require('lodash');
const graphql_tools_1 = require('graphql-tools');
const Users_1 = require('../resolver/user/Users');
const Blog_1 = require('../resolver/blog/Blog');
const combiner_1 = require('../resolver/combiner');
exports.default = graphql_tools_1.makeExecutableSchema({
  typeDefs: [Users_1.typeDef, Blog_1.typeDef, combiner_1.resolversTypeDef],
  resolvers: lodash_1.merge(Users_1.resolvers, Blog_1.resolvers)
});
//# sourceMappingURL=index.js.map

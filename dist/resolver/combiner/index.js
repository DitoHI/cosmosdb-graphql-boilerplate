'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const UserTypeDef_1 = require('../user/UserTypeDef');
const BlogTypeDef_1 = require('../blog/BlogTypeDef');
exports.resolversTypeDef = `
  type Mutation {
    ${UserTypeDef_1.mutationDef}
    ${BlogTypeDef_1.mutationDef}
  }

  type Query {
    ${UserTypeDef_1.queryDef}
    ${BlogTypeDef_1.queryDef}
  }

  scalar DateTime
  scalar URL
`;
//# sourceMappingURL=index.js.map

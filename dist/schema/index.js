"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const graphql_tools_1 = require("graphql-tools");
const Users_1 = require("../resolver/User/Users");
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: [Users_1.typeDef],
    resolvers: lodash_1.merge(Users_1.resolvers),
});
//# sourceMappingURL=index.js.map
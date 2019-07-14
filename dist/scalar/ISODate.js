'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_1 = require('graphql');
const validator_1 = require('validator');
const parseISO8601 = value => {
  if (validator_1.isISO8601(value)) {
    return value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};
const serializeISO8601 = value => {
  if (validator_1.isISO8601(value)) {
    return value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};
const parseLiteralISO8601 = ast => {
  if (validator_1.isISO8601(ast.value)) {
    return ast.value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};
exports.default = new graphql_1.GraphQLScalarType({
  name: 'ISODate',
  description: 'An ISO-8601 encoded UTC date string',
  serialize: serializeISO8601,
  parseValue: parseISO8601,
  parseLiteral: parseLiteralISO8601
});
//# sourceMappingURL=ISODate.js.map

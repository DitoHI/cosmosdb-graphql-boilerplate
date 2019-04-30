"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationDef = `
    addBlog(title: String!, content: String!, imageUri: [String], hastag: String!): Blog
    updateBlog(id: String!, title: String, content: String, lastEdited: DateTime,
          isDeleted: Boolean, imageUri: [String], hastag: String): Blog
    deleteBlog(id: String!): Blog
`;
exports.queryDef = `
    blogs(id: String, title: String, content: String, lastEdited: DateTime, isDeleted: Boolean,
          imageUri: [String], startAt: Int, endAt: Int, hastag: String
    ): [Blog]
`;
//# sourceMappingURL=BlogTypeDef.js.map
export const mutationDef = `
    addBlog(title: String!, content: String!, imageUri: [String], hastag: String!): Blog
    updateBlog(id: String!, title: String, content: String, lastEdited: DateTime,
          isDeleted: Boolean, imageUri: [String], hastag: String): Blog
    deleteBlog(id: String!): Blog
`;

export const queryDef = `
    blogs(id: String, title: String, content: String, lastEdited: DateTime, isDeleted: Boolean,
          imageUri: [String], startAt: Int, endAt: Int, hastag: String
    ): [Blog]
`;

export const mutationDef = `
    addBlog(user: String!, title: String!, content: String!, imageUri: [String] ): Blog
`;

export const queryDef = `
    blogs(user: String, title: String, content: String, lastEdited: DateTime,
          isDeleted: Boolean, imageUri: String
    ): [Blog]
`;

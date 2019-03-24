export const mutationDef = `
    addBlog(title: String!, content: String!, imageUri: [String] ): Blog
    updateBlog(id: String!, title: String, content: String, lastEdited: DateTime,
          isDeleted: Boolean, imageUri: [String]): Blog
`;

export const queryDef = `
    blogs(title: String, content: String, lastEdited: DateTime, isDeleted: Boolean,
          imageUri: [String]
    ): [Blog]
`;

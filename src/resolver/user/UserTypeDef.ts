export const mutationDef = `
    addUser(username: String!, email: String!, password: String!, name: String): User
    deleteUser(email: String!, password: String!): User
    updateStatus(isActived: Boolean!): User
    updateEducation(name: String, degree: String, major: String, dateStart: DateTime,
                    dateEnd: DateTime, location: String, description: String, cover: Upload): User
    updateExperience(name: String, role: String, description: String,
                     dateStart: DateTime, dateEnd: DateTime, cover: Upload): User
    updateProject(name: String, role: String, techStacks: [String],
                  description: String, link: URL, cover: Upload): User
    updateUser(occupation: String, phone: String, address: String,
               website: URL, dateBirth: DateTime, skill: [String], cover: Upload
               ): User
    loginUser(username: String, email: String, password: String!): User
`;

export const queryDef = `
    me(sort: Sort): User
    users(name: String, email: String): [PublicUser]
`;

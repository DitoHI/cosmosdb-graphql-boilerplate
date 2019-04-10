"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationDef = `
    addUser(name: String!, email: String!): User
    deleteUser(name: String!, email: String!): User
    updateStatus(name: String!, email: String!, updatedIsActived: Boolean!): User
    updateEducation(name: String, degree: String, major: String, dateStart: DateTime,
                    dateEnd: DateTime, location: String, description: String): User
    updateExperience(name: String, role: String, description: String,
                     dateStart: DateTime, dateEnd: DateTime): User
    updateProject(name: String, role: String, techStacks: [String],
                  description: String, link: URL): User
    updateUser(occupation: String, phone: String, address: String,
               website: URL, dateBirth: DateTime, skill: [String]
               ): User
`;
exports.queryDef = `
    me: User
    users(name: String, email: String): [User]
`;
//# sourceMappingURL=UserTypeDef.js.map
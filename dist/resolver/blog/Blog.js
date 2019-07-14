'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_scalars_1 = require('@okgrow/graphql-scalars');
exports.typeDef = `
  type Blog {
    id: ID!,
    user: String!,
    title: String,
    content: String,
    lastEdited: DateTime,
    isDeleted: Boolean,
    imageUri: [String],
    hastag: String,
    positionIndex: Int,
  }
`;
exports.resolvers = {
  DateTime: graphql_scalars_1.DateTime,
  Mutation: {
    addBlog: (_, blog, { userController, blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return userController.showUsers({ isActived: true }).then(result => {
          if (result.length === 0) {
            throw new Error('user not found');
          }
          if (result.length > 1) {
            throw new Error(
              `There are ${result.length} users found who are actived. ` +
                'Please inactive the others'
            );
          }
          const user = result[0];
          blog.user = user.id;
          return blogController
            .addBlog(blog)
            .then(blog => {
              return blog;
            })
            .catch(err => {
              throw err;
            });
        });
      }),
    deleteBlog: (_, { id }, { blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return blogController
          .deleteBlog(id)
          .then(blogDeleted => {
            return blogDeleted;
          })
          .catch(err => {
            throw err;
          });
      }),
    updateBlog: (_, blog, { blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return blogController
          .updateBlog(blog.id, blog)
          .then(blogUpdated => {
            return blogUpdated;
          })
          .catch(err => {
            throw err;
          });
      })
  },
  Query: {
    blogs: (_, blog, { userController, blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        return userController.showUsers({ isActived: true }).then(result => {
          if (result.length === 0) {
            throw new Error('user not found');
          }
          if (result.length > 1) {
            throw new Error(
              `There are ${result.length} users found who are actived. ` +
                'Please inactive the others'
            );
          }
          const user = result[0];
          blog.user = user.id;
          return blogController
            .showBlogs(blog)
            .then(blogsResult => {
              if (blogsResult.length === 0) {
                throw new Error('Blog is empty');
              }
              return blogsResult;
            })
            .catch(err => {
              throw err;
            });
        });
      })
  }
};
//# sourceMappingURL=Blog.js.map

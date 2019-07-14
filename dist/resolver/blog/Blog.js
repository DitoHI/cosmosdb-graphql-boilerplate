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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const apollo_upload_server_1 = require('apollo-upload-server');
const common_1 = __importDefault(require('../../utils/common'));
exports.typeDef = `
  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Blog {
    id: ID!,
    user: String!,
    title: String,
    content: String,
    lastEdited: DateTime,
    isDeleted: Boolean,
    imageUri: String,
    hastag: String,
    positionIndex: Int,
  }
`;
exports.resolvers = {
  Upload: apollo_upload_server_1.GraphQLUpload,
  Mutation: {
    addBlog: (_, blog, { userFromJwt, blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        const newBlog = Object.assign({}, blog);
        newBlog.user = userFromJwt.id;
        return blogController
          .addBlog(newBlog)
          .then(blog => {
            return blog;
          })
          .catch(err => {
            throw err;
          });
      }),
    deleteBlog: (_, { id }, { userFromJwt, blogController }) =>
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
    updateBlog: (_, blog, { userFromJwt, blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        return blogController
          .updateBlog(blog.id, blog, userFromJwt.id)
          .then(blogUpdated => {
            return blogUpdated;
          })
          .catch(err => {
            throw err;
          });
      })
  },
  Query: {
    blogs: (_, blog, { userFromJwt, userController, blogController }) =>
      __awaiter(this, void 0, void 0, function*() {
        common_1.default.exitAppIfUnauthorized(userFromJwt);
        blog.user = userFromJwt.id;
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
      })
  }
};
//# sourceMappingURL=Blog.js.map

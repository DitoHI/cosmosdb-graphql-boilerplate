import { IResolvers } from 'graphql-tools';
import { DateTime } from '@okgrow/graphql-scalars';

import { IUser } from '../../model/User/UserModel';
import common from '../../utils/common';

export const typeDef = `
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

export const resolvers: IResolvers = {
  DateTime,
  Mutation: {
    addBlog: async (
      _,
      blog,
      { userFromJwt, userController, blogController }
    ) => {
      common.exitAppIfUnauthorized(userFromJwt);

      const newBlog = Object.assign({}, blog);
      newBlog.user = userFromJwt.id;

      return blogController
        .addBlog(newBlog)
        .then((blog: any) => {
          return blog;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    deleteBlog: async (_, { id }, { userFromJwt, blogController }) => {
      return blogController
        .deleteBlog(id)
        .then((blogDeleted: any) => {
          return blogDeleted;
        })
        .catch((err: Error) => {
          throw err;
        });
    },
    updateBlog: async (_, blog, { userFromJwt, blogController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return blogController
        .updateBlog(blog.id, blog)
        .then((blogUpdated: any) => {
          return blogUpdated;
        })
        .catch((err: Error) => {
          throw err;
        });
    }
  },
  Query: {
    blogs: async (_, blog, { userFromJwt, userController, blogController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      blog.user = userFromJwt.id;
      return blogController
        .showBlogs(blog)
        .then((blogsResult: any) => {
          if (blogsResult.length === 0) {
            throw new Error('Blog is empty');
          }

          return blogsResult;
        })
        .catch((err: any) => {
          throw err;
        });
    }
  }
};

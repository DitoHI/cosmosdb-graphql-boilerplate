import { IResolvers } from 'graphql-tools';
import { GraphQLUpload } from 'graphql-upload';

import common from '../../utils/common';
import { IBlog } from '../../model/Blog/BlogModel';
import BlogController from '../../controller/Blog/BlogController';

export const typeDef = `
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
    titlePreview: String,
    content: String,
    contentPreview: String,
    lastEdited: DateTime,
    isDeleted: Boolean,
    blobUri: String,
    blobName: String,
    tags: [String],
    quote: String,
    positionIndex: Int,
  }
`;

export const resolvers: IResolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    addBlog: async (_, blog, { userFromJwt, blogController }) => {
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
        .updateBlog(blog.id, blog, userFromJwt.id)
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

          return blogsResult.map((blog: IBlog) => {
            const blogPreview = BlogController.getPreviewOfContent(
              blog.title,
              blog.content
            );
            blog.contentPreview = blogPreview.content;
            blog.titlePreview = blogPreview.title;

            return blog;
          });
        })
        .catch((err: any) => {
          throw err;
        });
    },
    getBlogById: async (_, { id }, { userFromJwt, blogController }) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return blogController
        .getBlogById(id, userFromJwt.id)
        .then((blogFound: any) => blogFound)
        .catch((err: Error) => {
          throw err;
        });
    },
    getBlogByPositionIndex: async (
      _,
      { index, operator },
      { userFromJwt, blogController }
    ) => {
      common.exitAppIfUnauthorized(userFromJwt);

      return blogController
        .getBlogByIndex(index, operator)
        .then((blog: any) => blog)
        .catch((err: Error) => {
          throw err;
        });
    }
  }
};

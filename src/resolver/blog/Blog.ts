import { IResolvers } from 'graphql-tools';
import { IUser } from '../../model/User/UserModel';
import { IBlog } from '../../model/Blog/BlogModel';
import { DateTime } from '@okgrow/graphql-scalars';

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
    addBlog: (async (_, blog, { userController, blogController }) => {
      return userController
        .showUsers({ isActived: true })
        .then((result: any) => {
          if (result.length === 0) {
            throw new Error('user not found');
          }

          if (result.length > 1) {
            throw new Error(`There are ${result.length} users found who are actived. ` +
              'Please inactive the others');
          }

          const user = result[0] as IUser;
          blog.user = user.id;
          return blogController
            .addBlog(blog)
            .then((blog: any) => {
              return blog;
            })
            .catch((err: Error) => {
              throw err;
            });
        });
    }),
    deleteBlog: (async (_, { id }, { blogController }) => {
      return blogController
        .deleteBlog(id)
        .then((blogDeleted: any) => {
          return blogDeleted;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
    updateBlog: (async (_, blog, { blogController }) => {
      return blogController
        .updateBlog(blog.id, blog)
        .then((blogUpdated: any) => {
          return blogUpdated;
        })
        .catch((err: Error) => {
          throw err;
        });
    }),
  },
  Query: {
    blogs: (async (_, blog, { userController, blogController }) => {
      return userController
        .showUsers({ isActived: true })
        .then((result: any) => {
          if (result.length === 0) {
            throw new Error('user not found');
          }

          if (result.length > 1) {
            throw new Error(`There are ${result.length} users found who are actived. ` +
              'Please inactive the others');
          }

          const user = result[0] as IUser;
          blog.user = user.id;
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
        });
    })
  },
};

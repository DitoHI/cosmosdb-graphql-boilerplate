import Dao from '../../model/Dao';
import { SqlParameter, SqlQuerySpec } from '@azure/cosmos';

class BlogController {
  public blogDao: Dao;
  public query: string;
  public parameters: SqlParameter[];
  private updatedParameters: string[] = ['updatedIsDeleted'];

  constructor(blogDao: Dao) {
    this.blogDao = blogDao;
  }

  async showBlogs(blog?: any, logical: string = 'AND') {
    this.query = 'SELECT * FROM root r';
    this.parameters = [];
    let index: number = 0;
    if (blog) {
      for (const prop in blog) {
        if (blog.hasOwnProperty(prop) && blog[prop] &&
          this.updatedParameters.indexOf(prop) === -1) {
          if (index === 0) {
            this.query += ` WHERE r.${prop}=@${prop}`;
          } else {
            this.query += ` ${logical} r.${prop}=@${prop}`;
          }
          this.parameters.push({
            name: `@${prop}`,
            value: blog[prop]
          });
        }
        index = index + 1;
      }
    }

    const querySpec: SqlQuerySpec = {
      query: this.query,
      parameters: this.parameters
    };

    return this.blogDao
      .find(querySpec)
      .then((blog) => {
        return blog;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async addBlog(blog?: any) {
    return new Promise((resolve, reject) => {
      blog.lastEdited = Date.now();
      blog.isDeleted = false;
      this.blogDao
        .addItem(blog)
        .then((blog) => {
          return resolve(blog);
        })
        .catch((err) => {
          return reject(new Error(err));
        });
    });
  }

  async updateBlog(idBlog: any, blog: any) {
    return new Promise((resolve, reject) => {
      this.blogDao
        .updateItem(idBlog, blog)
        .then((blogUpdated) => {
          if (blogUpdated.code === 404) {
            return reject(blogUpdated.body);
          }
          return resolve(blogUpdated);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async deleteBlog(id: string) {
    return new Promise((resolve, reject) => {
      const blog = {} as any;
      blog.id = id;
      this
        .showBlogs(blog)
        .then((blogsResult) => {
          if (blogsResult.length === 0) {
            return reject(new Error('No blog found'));
          }

          const blogClone = Object.assign({}, blogsResult[0]);
          this.blogDao
            .deleteItem(id)
            .then(() => {
              return resolve(blogClone);
            })
            .catch((err) => {
              return reject(err);
            });
        });
    });
  }
}

export default BlogController;

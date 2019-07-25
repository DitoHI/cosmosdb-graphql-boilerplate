import { SqlParameter, SqlQuerySpec } from '@azure/cosmos';

import Dao from '../../model/Dao';
import { IBlog } from '../../model/Blog/BlogModel';
import filesystem from '../../utils/filesystem';
import common from '../../utils/common';
import { default as azureCustomStorage } from '../../utils/azure_storage';

class BlogController {
  public blogDao: Dao;
  public query: string;
  public parameters: SqlParameter[];
  private updatedParameters: string[] = ['updatedIsDeleted'];

  constructor(blogDao: Dao) {
    this.blogDao = blogDao;
  }

  async showBlogs(blog?: any, logical: string = 'AND') {
    this.query = 'SELECT DISTINCT VALUE b FROM Blogs b JOIN tags IN b.tags';
    this.parameters = [];
    let index: number = 0;
    if (blog) {
      for (const prop in blog) {
        if (
          blog.hasOwnProperty(prop) &&
          blog[prop] &&
          this.updatedParameters.indexOf(prop) === -1
        ) {
          let propActive;
          let operator;
          if (prop === 'startAt') {
            propActive = 'positionIndex';
            operator = '>=';
          } else if (prop === 'endAt') {
            propActive = 'positionIndex';
            operator = '<=';
          } else if (prop === 'tags') {
            propActive = prop;
            let tags: string[] = Object.values(blog[prop]);
            tags = tags.map(tag => tag.toUpperCase());
            blog[prop] = tags;
          } else {
            propActive = prop;
            operator = '=';
          }

          if (index === 0) {
            this.query += ` WHERE `;
          }

          const showLogical = index === 0 ? '' : ` ${logical} `;
          if (prop === 'tags') {
            this.query += `${showLogical}ARRAY_CONTAINS(@${prop}, UPPER(${propActive}), ${true})`;
          } else {
            this.query += `${showLogical}b.${propActive} ${operator} @${prop}`;
          }
          this.parameters.push({
            name: `@${prop}`,
            value: blog[prop]
          });
          index = index + 1;
        }
      }
    }

    this.query += ' ORDER BY b.lastEdited DESC';

    const querySpec: SqlQuerySpec = {
      query: this.query,
      parameters: this.parameters
    };

    return this.blogDao
      .find(querySpec)
      .then(blog => {
        return blog;
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  async addBlog(blog?: any) {
    return new Promise(async (resolve, reject) => {
      blog.lastEdited = Date.now();
      blog.isDeleted = false;

      // get total of document
      // to assign manual indexing
      const blogs = await this.showBlogs();
      blog.positionIndex = blogs.length;

      // upload cover to azure storage
      const fullPathCover = await this.createFileFromStream(blog.cover);
      await azureCustomStorage.createContainer(common.blogBlobContainerName);
      const blobInfo: any = await azureCustomStorage.uploadLocalFile(
        common.blogBlobContainerName,
        fullPathCover
      );
      await filesystem.deleteFile(fullPathCover);
      blog.blobUri = blobInfo.url;
      blog.blobName = blobInfo.name;

      this.blogDao
        .addItem(blog)
        .then(blog => {
          return resolve(blog);
        })
        .catch(err => {
          return reject(new Error(err));
        });
    });
  }

  async updateBlog(blogId: string, blog: any, userId: string) {
    return new Promise((resolve, reject) => {
      this.blogDao
        .getItem(blogId)
        .then(async result => {
          if (result.code === 404) {
            return reject(new Error('Blog not found'));
          }

          const blogFound = result as IBlog;
          if (blogFound.user !== userId) {
            return reject(
              new Error("You dont't have the authorization to update the blog")
            );
          }

          // delete existing cover if exist
          // and upload new cover
          if (blog.cover) {
            const fullPathCover = await this.createFileFromStream(blog.cover);
            await azureCustomStorage.createContainer(
              common.blogBlobContainerName
            );
            await azureCustomStorage.deleteBlob(
              common.blogBlobContainerName,
              blogFound.blobName
            );
            const blobInfo: any = await azureCustomStorage.uploadLocalFile(
              common.blogBlobContainerName,
              fullPathCover
            );
            await filesystem.deleteFile(fullPathCover);
            blog.blobUri = blobInfo.url;
            blog.blobName = blobInfo.name;
          }

          this.blogDao
            .updateItem(blogId, blog)
            .then(blogUpdated => {
              if (blogUpdated.code === 404) {
                return reject(blogUpdated.body);
              }
              return resolve(blogUpdated);
            })
            .catch(err => {
              return reject(err);
            });
        })
        .catch(err => reject(err));
    });
  }

  async deleteBlog(id: string) {
    return new Promise((resolve, reject) => {
      const blog = {} as any;
      blog.id = id;
      return this.showBlogs(blog).then(async (blogsResult: any) => {
        if (blogsResult.length === 0) {
          return reject(new Error('No blog found'));
        }

        const blogClone: IBlog = Object.assign({}, blogsResult[0]);
        // delete the blob in azure cloud
        if (blogClone.blobName) {
          await azureCustomStorage.deleteBlob(
            common.blogBlobContainerName,
            blogClone.blobName
          );
        }

        return this.blogDao
          .deleteItem(id)
          .then(() => {
            return resolve(blogClone);
          })
          .catch(err => {
            return reject(err);
          });
      });
    });
  }

  async createFileFromStream(upload: any) {
    const { createReadStream, filename, mimetype } = await upload;
    const steam = createReadStream();
    const result: any = await filesystem.storeFs(steam, filename);
    return result.path;
  }
}

export default BlogController;

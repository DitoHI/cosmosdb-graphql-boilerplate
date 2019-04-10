"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BlogController {
    constructor(blogDao) {
        this.updatedParameters = ['updatedIsDeleted'];
        this.blogDao = blogDao;
    }
    showBlogs(blog, logical = 'AND') {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = 'SELECT * FROM Blogs b';
            this.parameters = [];
            let index = 0;
            if (blog) {
                for (const prop in blog) {
                    if (blog.hasOwnProperty(prop) && blog[prop] &&
                        this.updatedParameters.indexOf(prop) === -1) {
                        let propActive = prop;
                        let operator = '=';
                        if (prop === 'startAt') {
                            propActive = 'positionIndex';
                            operator = '>=';
                        }
                        if (prop === 'endAt') {
                            propActive = 'positionIndex';
                            operator = '<=';
                        }
                        if (index === 0) {
                            this.query += ` WHERE b.${propActive}${operator}@${prop}`;
                        }
                        else {
                            this.query += ` ${logical} b.${propActive}${operator}@${prop}`;
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
            const querySpec = {
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
        });
    }
    addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                blog.lastEdited = Date.now();
                blog.isDeleted = false;
                // get total of document
                // to assign manual indexing
                const blogs = yield this.showBlogs();
                blog.positionIndex = blogs.length;
                this.blogDao
                    .addItem(blog)
                    .then((blog) => {
                    return resolve(blog);
                })
                    .catch((err) => {
                    return reject(new Error(err));
                });
            }));
        });
    }
    updateBlog(idBlog, blog) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const blog = {};
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
        });
    }
}
exports.default = BlogController;
//# sourceMappingURL=BlogController.js.map
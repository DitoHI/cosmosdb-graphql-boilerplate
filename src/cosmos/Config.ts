const config: any = {};

config.host = process.env.HOST_DB;
config.authKey = process.env.KEY_DB;
config.databaseId = 'Blog';
config.containerUserId = 'Users';
config.containerBlogId = 'Blogs';

export { config };

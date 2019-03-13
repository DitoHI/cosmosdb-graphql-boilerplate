const config: any = {};

config.host = process.env.HOST_DB;
config.authKey = process.env.AUTH_KEY;
config.databaseId = 'Blog';
config.containerUserId = 'Users';

export { config };

import { CosmosClient } from '@azure/cosmos';
import { config } from './Config';
import Dao from '../model/Dao';
import UserController from '../controller/User/UserController';
import BlogController from '../controller/Blog/BlogController';

class Client {
  public log: string;
  public userDao: Dao;
  public blogDao: Dao;
  public userController: UserController;
  public blogController: BlogController;

  async init() {
    const cosmosClient = new CosmosClient({
      auth: {
        masterKey: config.authKey,
      },
      endpoint: config.host,
    });

    this.userDao = new Dao(cosmosClient, config.databaseId, config.containerUserId);
    this.blogDao = new Dao(cosmosClient, config.databaseId, config.containerBlogId);
    this.userController = new UserController(this.userDao);
    this.blogController = new BlogController(this.userDao);
    this.userDao
      .init()
      .then(() => {
        this.log = 'Successful configure user & blog';
      })
      .catch((err) => {
        this.log = err;
        return err;
      });
  }
}

const client = new Client();

export default client;

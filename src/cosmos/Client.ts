import { CosmosClient } from '@azure/cosmos';
import { config } from './Config';
import Dao from '../model/Dao';
import UserController from '../controller/User/UserController';
import BlogController from '../controller/Blog/BlogController';

class Client {
  public log: string = 'Successfully configure container';
  public userDao: Dao;
  public blogDao: Dao;
  public userController: UserController;
  public blogController: BlogController;

  async init() {
    const cosmosClient = new CosmosClient({
      auth: {
        masterKey: config.authKey
      },
      endpoint: config.host
    });

    this.userDao = new Dao(
      cosmosClient,
      config.databaseId,
      config.containerUserId
    );
    this.blogDao = new Dao(
      cosmosClient,
      config.databaseId,
      config.containerBlogId
    );
    this.userController = new UserController(this.userDao);
    this.blogController = new BlogController(this.blogDao);
    this.userDao
      .init()
      .then(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Database user connected');
        }
      })
      .catch(err => {
        console.log(err.body);
      });
    this.blogDao
      .init()
      .then(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Database blog connected');
        }
      })
      .catch(err => {
        console.log(err.body);
      });

    return this.log;
  }
}

const client = new Client();

export default client;

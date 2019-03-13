import { CosmosClient } from '@azure/cosmos';
import { config } from './Config';
import UserDao from '../model/User/UserDao';
import UserController from '../controller/User/UserController';

class Client {
  public log: string;
  public userDao: UserDao;
  public userController: UserController;

  async init() {
    const cosmosClient = new CosmosClient({
      auth: {
        masterKey: config.authKey,
      },
      endpoint: config.host,
    });

    this.userDao = new UserDao(cosmosClient, config.databaseId, config.containerUserId);
    this.userController = new UserController(this.userDao);
    this.userDao.init().then(() => {
      this.log = 'Successful configure user';
    }).catch((err) => {
      this.log = err;
      return err;
    });
  }
}

const client = new Client();

export default client;

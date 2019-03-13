import { CosmosClient } from '@azure/cosmos';
import { config } from './Config';
import UserDao from '../model/User/UserDao';
import UserController from '../controller/User/UserController';

class Client {
  public log: string;

  async init() {
    const cosmosClient = new CosmosClient({
      auth: {
        masterKey: config.authKey,
      },
      endpoint: config.host,
    });

    const userDao = new UserDao(cosmosClient, config.databaseId, config.containerUserId);
    const userController = new UserController(userDao);
    userDao.init().then(() => {
      this.log = 'Successful configure user';
    }).catch((err) => {
      this.log = err;
      return err;
    });
  }
}

export { Client };

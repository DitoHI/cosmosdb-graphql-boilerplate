import { CosmosClient } from '@azure/cosmos';
import Dao from '../Dao';

class UserDao extends Dao {
  constructor(cosmosClient: CosmosClient, databaseId: string, containerId: string) {
    super(cosmosClient, databaseId, containerId);
  }

  async addUser(user: any) {
    user.isActived = true;
    return this.container.items.create(user).then((result) => {
      return result.body;
    }).catch((err) => {
      return err;
    });
  }

  async updateUser(userId: string) {
    return this.getItem(userId).then((doc) => {
      this.container.item(userId).replace(doc).then((replaced) => {
        return replaced;
      }).catch((err) => {
        return err;
      });
    });
  }

  async getItem(userId: string) {
    return this.container.item(userId).read().then((body) => {
      return body;
    }).catch((err) => {
      return err;
    });
  }
}

export default UserDao;

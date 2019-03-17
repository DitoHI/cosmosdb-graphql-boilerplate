import { CosmosClient } from '@azure/cosmos';
import Dao from '../Dao';

class UserDao extends Dao {
  constructor(cosmosClient: CosmosClient, databaseId: string, containerId: string) {
    super(cosmosClient, databaseId, containerId);
  }

  async addUser(user: any) {
    user.isActived = true;
    return this.container.items
      .create(user)
      .then((result) => {
        return result.body;
      })
      .catch((err) => {
        return err;
      });
  }

  async updateUser(userId: string, user: any) {
    return this
      .getItem(userId)
      .then((doc) => {
        if (doc == null) {
          return new Error('No user found');
        }

        for (const key in user) {
          if (user.hasOwnProperty(key)) {
            doc[key] = user[key];
          }
        }

        return this.container
          .item(userId)
          .replace(doc)
          .then((result) => {
            return result.body;
          })
          .catch((err) => {
            return err;
          });
      });
  }

  async getItem(userId: string) {
    return this.container
      .item(userId)
      .read()
      .then((result) => {
        return result.body;
      })
      .catch((err) => {
        return err;
      });
  }

  async deleteUser(userId: string) {
    return this
      .getItem(userId)
      .then((result) => {
        if (result == null) {
          return new Error('No user found');
        }

        this.container
          .item(userId)
          .delete()
          .catch((err) => {
            return new Error(err);
          });
      });
  }
}

export default UserDao;

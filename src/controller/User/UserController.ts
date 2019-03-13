import UserDao from '../../model/User/UserDao';
import { SqlQuerySpec } from '@azure/cosmos';
import { IUser } from '../../model/User/UserModel';

class UserController {
  public userDao: UserDao;

  constructor(userDao: UserDao) {
    this.userDao = userDao;
  }

  async showUsers() {
    const querySpec: SqlQuerySpec = {
      query: 'SELECT * FROM root r WHERE r.isActived=@isActived',
      parameters: [
        {
          name: '@isActived',
          value: true,
        }
      ]
    };

    return this.userDao.find(querySpec).then((user) => {
      return user;
    }).catch((err) => {
      return err;
    });
  }

  async addUser(user: IUser) {
    return this.userDao.addUser(user).then((user) => {
      return user;
    }).catch((err) => {
      return err;
    });
  }
}

export default UserController;

import UserDao from '../../model/User/UserDao';
import { SqlParameter, SqlQuerySpec } from '@azure/cosmos';
import { IUser } from '../../model/User/UserModel';

class UserController {
  public userDao: UserDao;
  public query: string;
  public parameters: SqlParameter[];

  constructor(userDao: UserDao) {
    this.userDao = userDao;
  }

  async showUsers(user?: any) {
    this.query = 'SELECT * FROM root r WHERE';
    let index: number = 0;
    for (const prop of user) {
      if (user.hasOwnProperty(prop)) {
        if (index === 0) {
          this.query += ` r.${prop}=@${prop}`;
        }
        this.query += ` AND r.${prop}=@${prop}`;
        this.parameters.push({
          name: prop,
          value: user.prop
        });
      }
      index = index + 1;
    }

    const querySpec: SqlQuerySpec = {
      query: this.query,
      parameters: this.parameters
    };

    return this.userDao.find(querySpec).then((user) => {
      return user;
    }).catch((err) => {
      return err;
    });
  }

  async addUser(user?: any) {
    return this.userDao.addUser(user).then((user) => {
      return user;
    }).catch((err) => {
      return err;
    });
  }
}

export default UserController;

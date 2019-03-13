import UserDao from '../../model/User/UserDao';
import { SqlParameter, SqlQuerySpec } from '@azure/cosmos';

class UserController {
  public userDao: UserDao;
  public query: string;
  public parameters: SqlParameter[];

  constructor(userDao: UserDao) {
    this.userDao = userDao;
  }

  async showUsers(user?: any, logical: string = 'AND') {
    this.query = 'SELECT * FROM root r';
    this.parameters = [];
    let index: number = 0;
    if (user) {
      for (const prop in user) {
        if (user.hasOwnProperty(prop) && user[prop]) {
          if (index === 0) {
            this.query += ` WHERE r.${prop}=@${prop}`;
          } else {
            this.query += ` ${logical} r.${prop}=@${prop}`;
          }
          this.parameters.push({
            name: `@${prop}`,
            value: user[prop]
          });
        }
        index = index + 1;
      }
    }

    const querySpec: SqlQuerySpec = {
      query: this.query,
      parameters: this.parameters
    };

    return this.userDao.find(querySpec).then((user) => {
      return user;
    }).catch((err) => {
      throw new Error(err);
    });
  }

  async addUser(user?: any) {
    // check if name or username is already exist
    return new Promise((resolve, reject) => {
      this.showUsers(user, 'OR').then((result) => {
        if (result.length > 0) {
          return reject('Username or email is already exist');
        }

        this.userDao.addUser(user).then((user) => {
          return resolve(user);
        }).catch((err) => {
          return reject(err);
        });
      });
    });
  }
}

export default UserController;

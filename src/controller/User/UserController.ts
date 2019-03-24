import Dao from '../../model/Dao';
import { SqlParameter, SqlQuerySpec } from '@azure/cosmos';

class UserController {
  public userDao: Dao;
  public query: string;
  public parameters: SqlParameter[];
  private updatedParameters: string[] = ['updatedIsActived'];

  constructor(userDao: Dao) {
    this.userDao = userDao;
  }

  async showUsers(user?: any, logical: string = 'AND') {
    this.query = 'SELECT * FROM root r';
    this.parameters = [];
    let index: number = 0;
    if (user) {
      for (const prop in user) {
        if (user.hasOwnProperty(prop) && user[prop] &&
          this.updatedParameters.indexOf(prop) === -1) {
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

    return this.userDao
      .find(querySpec)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async addUser(user?: any) {
    // check if name or username is already exist
    return new Promise((resolve, reject) => {
      this
        .showUsers(user, 'OR')
        .then((result) => {
          if (result.length > 0) {
            return reject(new Error('Username or email is already exist'));
          }

          this.userDao
            .addItem(user)
            .then((user) => {
              return resolve(user);
            })
            .catch((err) => {
              return reject(new Error(err));
            });
        });
    });
  }

  async updateUser(user?: any, updatedIsActived?: Boolean) {
    return new Promise((resolve, reject) => {
      let userFind: any = {};
      updatedIsActived == null
        ? userFind.isActived = true
        : userFind = user;
      this
        .showUsers(userFind)
        .then((users) => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }

          if (users.length > 1) {
            return reject(new Error(`There are ${users.length} users found who are actived. ` +
            'Please inactive the others'));
          }

          if (updatedIsActived != null) {
            user.isActived = updatedIsActived;
          }

          const userClone = Object.assign({}, users[0]);
          this.userDao
            .updateItem(userClone.id, user)
            .then((replaced) => {
              return resolve(replaced);
            })
            .catch((err) => {
              return reject(err);
            });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async updateEducation(education: any) {
    return new Promise((resolve, reject) => {
      this
        .showUsers({ isActived: true })
        .then((users) => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }

          if (users.length > 1) {
            return reject(new Error(`There are ${users.length} users found. Please specify more`));
          }

          const userClone = Object.assign({}, users[0]);
          const educationClone = Object.assign({}, education);
          if (!userClone.education) {
            userClone.education = [];
          }
          userClone.education.push(education);
          this.userDao
            .updateItem(userClone.id, { education: userClone.education })
            .then((replaced) => {
              return resolve(replaced);
            })
            .catch((err) => {
              return reject(err);
            });
        });
    });
  }

  async updateExperience(experience: any) {
    return new Promise((resolve, reject) => {
      this
        .showUsers({ isActived: true })
        .then((users) => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }

          if (users.length > 1) {
            return reject(new Error(`There are ${users.length} users found. Please specify more`));
          }

          const userClone = Object.assign({}, users[0]);
          const experienceClone = Object.assign({}, experience);
          if (!userClone.experience) {
            userClone.experience = [];
          }
          userClone.experience.push(experience);

          this.userDao
            .updateItem(userClone.id, { experience: userClone.experience })
            .then((replaced) => {
              return resolve(replaced);
            })
            .catch((err) => {
              return reject(err);
            });
        });
    });
  }

  async updateProject(project: any) {
    return new Promise((resolve, reject) => {
      this
        .showUsers({ isActived: true })
        .then((users) => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }

          if (users.length > 1) {
            return reject(new Error(`There are ${users.length} users found. Please specify more`));
          }

          const userClone = Object.assign({}, users[0]);
          const projectClone = Object.assign({}, project);
          if (!userClone.project) {
            userClone.project = [];
          }
          userClone.project.push(project);

          this.userDao
            .updateItem(userClone.id, { project: userClone.project })
            .then((replaced) => {
              return resolve(replaced);
            })
            .catch((err) => {
              return reject(err);
            });
        });
    });
  }

  async deleteUser(user?: any) {
    return new Promise((resolve, reject) => {
      this.showUsers(user)
        .then((users) => {
          if (users.length === 0) {
            return reject(new Error('No user registered'));
          }

          if (users.length > 1) {
            return reject(new Error(`There are ${users.length} users found. Please specify more`));
          }

          const userClone = Object.assign({}, users[0]);
          this.userDao
            .deleteItem(userClone.id)
            .then(() => {
              return resolve(userClone);
            })
            .catch((err) => {
              return reject(err);
            });
        });
    });
  }
}

export default UserController;

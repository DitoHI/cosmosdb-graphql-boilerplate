import { IUser } from '../model/User/UserModel';

export default {
  exitAppIfUnauthorized: (user: IUser) => {
    if (!user) {
      throw Error('You are not authenticated');
    }
    return;
  }
};

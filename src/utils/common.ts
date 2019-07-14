import { IUser } from '../model/User/UserModel';

export default {
  exitAppIfUnauthorized: (user: IUser, checkIsActive = true) => {
    if (!user) {
      throw Error('You are not authenticated');
    }
    if (checkIsActive && !user.isActived) {
      throw Error('You are currently not active');
    }
    return;
  }
};

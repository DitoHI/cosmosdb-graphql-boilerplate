import * as admin from 'firebase-admin';

export default {
  init: () => {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://hafizhnotes.firebaseio.com'
    });
  },
  db: () => {
    return admin.database();
  }
};

import express from 'express';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload';
import cors from 'cors';

require('dotenv').config();

import passportInitializer from './utils/passportInitializer';
import schema from './schema';
import Client from './cosmos/Client';

const startServer = async () => {
  const port = process.env.PORT || 3000; // default port to listen

  const app = express();

  // initialize cosmosDB initializer
  Client.init()
    .then()
    .catch(err => {
      throw new Error(err);
    });

  passport.use(passportInitializer(Client.userController));

  app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: true }, (err, user) => {
      if (user) {
        req.user = user;
      }

      next();
    })(req, res, next);
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      userFromJwt: req.user,
      blogController: Client.blogController,
      userController: Client.userController
    })
  });

  server.applyMiddleware({ app, path: '/graphql' });

  app
    .use(cors())
    .use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // start the Express server
  app.listen({ port }, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Server started at PORT ${port}`);
    }
  });
};

startServer()
  .then()
  .catch();

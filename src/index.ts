import express from 'express';

require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import Client from './cosmos/Client';

const startServer = async () => {
  const port = process.env.PORT || 3000; // default port to listen

  const app = express();

  // initialize cosmosDB initializer
  Client
    .init()
    .catch((err) => {
      throw new Error(err);
    });

  const server = new ApolloServer({
    schema,
    context: () => ({
      blogController: Client.blogController,
      userController: Client.userController,
    })
  });

  server.applyMiddleware({ app, path: '/graphql' });

  // start the Express server
  app.listen({ port }, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Server started at PORT ${port}`);
    }
  });
};

startServer();

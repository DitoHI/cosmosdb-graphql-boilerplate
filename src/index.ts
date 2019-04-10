import express from 'express';
import morgan from 'morgan';

require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import Client from './cosmos/Client';

const startServer = async () => {
  const app = express();
  const port = process.env.PORT || 3000; // default port to listen

  // initalize cosmosDB intializer
  Client
    .init()
    .catch((err) => {
      throw new Error(err);
    });

  // middleware
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      req,
      blogController: Client.blogController,
      userController: Client.userController,
    })
  });

  const origin = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://hafizhnotes.azurewebsites.net';

  server.applyMiddleware({
    app, cors: {
      origin,
      credentials: true,
    }
  });

  // start the Express server
  app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Server started at PORT ${port}`);
    }
  });
};

startServer();

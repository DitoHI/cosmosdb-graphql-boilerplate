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
  Client.init();

  // middleware
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      req,
      userController: Client.userController
    }),
  });

  server.applyMiddleware({
    app
  });

  // start the Express server
  app.listen(port, () => {
    console.log(`Server started @PORT ${port}`);
  });
};

startServer();

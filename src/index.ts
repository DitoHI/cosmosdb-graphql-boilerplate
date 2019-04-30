import express from 'express';
import morgan from 'morgan';

require('dotenv').config();

import { ApolloServer } from 'apollo-server';
import schema from './schema';
import Client from './cosmos/Client';

const startServer = async () => {
  const port = process.env.PORT || 3000; // default port to listen

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

  // start the Express server
  server.listen({ port }).then(({ url }) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Server started at PORT ${port}`);
    }
  });
};

startServer();

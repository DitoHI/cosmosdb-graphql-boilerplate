import express from 'express';
import morgan from 'morgan';

require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

const startServer = async () => {
  const app = express();
  const port = process.env.PORT || 8080; // default port to listen

  // middleware
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      req,
    }),
  });

  server.applyMiddleware({
    app
  });

  // start the Express server
  app.listen(port, () => {
    console.log(`Server started at PORT ${port}`);
  });
};

startServer();

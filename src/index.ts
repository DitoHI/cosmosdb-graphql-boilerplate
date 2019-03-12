import express from 'express';
import morgan from 'morgan';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080; // default port to listen

// middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// start the Express server
app.listen(port, () => {
  console.log(`Server started at PORT ${port}`);
});

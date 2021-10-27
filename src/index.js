const express = require('express');
//When the app runs, we automatically connect to the mongoose file where it then connects to our mongodb server
require('./db/mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//All our http handlers imported
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const router = require('./routers/user');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

//Imports all our User and Task routes from router field
//This is done to avoid jamming all our code into just one file
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log('Port started on 3000');
});

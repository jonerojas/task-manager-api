//All this file needs to do is load the mongodb connection when run. Inside the index.js file, the require method does this by loading the page which in turn activates the connection to mongodb

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

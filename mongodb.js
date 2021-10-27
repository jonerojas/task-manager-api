//CRUD Operations

const { ObjectId, MongoClient } = require('mongodb');

const connectionURL = process.env.MONGODB_CONNECTION_URL;
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  }
  console.log('Connection to database is a success!');
  const db = client.db(databaseName);
});

//Using the delete and deleteMany methods alongs with the greater than $gte operator
// db.collection('tasks')
//   .deleteMany({ completed: true })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// db.collection('users')
//   .deleteMany({ age: { $gte: 49 } })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// db.collection('tasks')
//   .deleteOne({ name: 3 })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// //Inserting multiple documents with promises
// db.collection('tasks')
//   .insertMany([
//     {
//       name: 1,
//       completed: true
//     },
//     {
//       name: 2,
//       completed: true
//     },
//     {
//       name: 3,
//       completed: true
//     }
//   ])
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// db.collection('users')
//   .updateOne(
//     { _id: new ObjectId('61416548aadac12b68005717') },
//     { $set: { name: 'Rojas' } }
//   )
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//Deleting a document with the remove method
// db.collection('tasks')
//   .deleteOne({ description: 'groceries' })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//Using updateMany to query the database and change all task to true
// db.collection('tasks')
//   .updateMany({ completed: false }, { $set: { completed: true } })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// //Increment operator increasing age by 1
// db.collection('users')
//   .updateOne(
//     { _id: new ObjectId('61416548aadac12b68005717') },
//     { $inc: { age: 1 } }
//   )
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// db.collection('users').findOne(
//   { _id: new ObjectId('61417b2ff7fbdf7aec743e2f') },
//   (error, user) => {
//     if (error) {
//       return console.log('Unable to fetch query');
//     }
//     console.log(user);
//   }
// );

//The find method doesnt use a callback but a cursor to reference the data found. We use toArray to console the found data
// db.collection('users')
//   .find({ age: 33 })
//   .toArray((error, users) => {
//     console.log(users);
//   });

// db.collection('tasks').findOne(
//   { _id: new ObjectId('61418140311b2b9aca3710e9') },
//   (error, task) => {
//     if (error) {
//       return console.log('Unable to fetch your query');
//     }
//     console.log(task);
//   }
// );

// db.collection('tasks')
//   .find({ completed: false })
//   .toArray((error, tasks) => {
//     if (error) {
//       return console.log('Unable to fetch task query');
//     }
//     console.log(tasks);
//   });

// db.collection('users').insertMany(
//   [
//     {
//       name: 'Mario',
//       age: 50
//     },
//     {
//       name: 'Luigi',
//       age: 50
//     }
//   ],
//   (error, result) => {
//     if (error) {
//       return console.log('Bulk insert has encountered an error.');
//     }
//     console.log(result.insertedIds);
//   }
// );

// db.collection('tasks').insertMany(
//   [
//     {
//       description: '2 hours of coding',
//       completed: true
//     },
//     {
//       description: 'gym',
//       completed: true
//     },
//     {
//       description: 'groceries',
//       completed: false
//     }
//   ],
//   (error, result) => {
//     if (error) {
//       return console.log('Encountered an error with saving document');
//     }
//     console.log(result.insertedIds);
//   }
// );

// db.collection('users').insertOne(
//   {
//     name: 'Loida',
//     age: 67
//   },
//   (error, result) => {
//     if (error) {
//       return console.log('Unable to insert document');
//     }
//     // - console.log(results.insertedId) for insertOne

//     // -  console.log(results.insertedIds) for insertMany
//     console.log(result.insertedId);
//   }
// );

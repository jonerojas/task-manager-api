const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { welcomeEmail, userDeletedAccountEmail } = require('../emails/account');

//Home Landing Page
router.get('/', (req, res) => {
  res.send('<h1>And we are live!</h1>');
});

//Creating and saving a new user to the database
router.post('/users', async (req, res) => {
  const { name, email, age, password } = req.body;
  const user = new User({
    name,
    email,
    age,
    password
  });

  try {
    await user.save();
    welcomeEmail(name, email);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }

  // user
  //   .save()
  //   .then((result) => {
  //     console.log(result);
  //     res.status(201).send(user);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(400).send(error);
  //   });
});

//Logging into account

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send('Cant find the user brody');
  }
});

//Logging out users
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      //Its token.token bc the item were iterating is an array of objects with a property of token
      return token.token !== req.token;
    });
    await req.user.save();
    console.log('User has been logged out');

    res.send('User has been logged out.');
  } catch (error) {
    res.status(500).send('Unable to logout user');
  }
});

//Logout of all concurrent sessions aka delete all tokens
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    // req.user.tokens.splice(0, req.user.tokens.length);
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send(req.user.name + ' has been logged out of all devices');
  } catch (error) {
    res.status(500).send('Unable to logout sessions');
  }
});

//Get all users
router.get('/users', async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    res.status(500).send(error);
  }
  // User.find({})
  //   .then((result) => {
  //     console.log(result);
  //     res.send(result);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

//Get logged in user's profile
router.get('/users/me', auth, async (req, res) => {
  //If an account with the same ID is found, we attach that users info onto the request object.
  //From there we can send back the logged in users profile using req.user
  res.send(req.user);
});

//Update a users profile
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdateFields = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdateFields.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update fields.' });
  }
  try {
    //For the update field, we input req body to insert whatever key=value pair is given by the client ie name and just email

    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    //With the findById method above, it bypasses mongoose bc it workd directly with the database

    //The code below insures the validation middleware runs when updating a user/doc

    //Were basically getting an instance of the document object via findById and using JS method to input the new data
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Deleting a user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    userDeletedAccountEmail(req.user.name, req.user.email);
    console.log(req.user.name + ' has been deleted');
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//------------------------Avatar things---------------------

//The middleware that is run when a file is uploaded
//<img src='data:image/jpg;base64,'
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Wrong file type. Only jpg, jpeg, and png'));
    }
    callback(undefined, true);
  }
});

//Uploading a users profile photo
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    //in thethe single() method, the parameter has to match with the form data inside postman
    //Example: key: avatar value: the upload itself

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

    req.user.avatar = buffer;

    await req.user.save();

    res.send('Photo has been uploaded!');
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Fetching an avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error('User was not found');
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send();
  }
});

//Deleting a user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//---------------------------------------------------------

module.exports = router;

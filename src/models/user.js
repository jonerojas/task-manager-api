const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      default: 0,
      validate(num) {
        if (num < 0) {
          throw new Error('Age must be greater than 0');
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(password) {
        if (validator.contains(password.toLowerCase(), 'password')) {
          throw new Error('The password cannot contain the word "password". Please try another password.');
        }
      }
    },
    //Using the validator library to parse the string to confirm whether the input is an email
    email: {
      type: String,
      //unique makes sure that there is no copy of this field in the db
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error('Must be a valid email. Please try again.');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function () {
  //generateAuthToken is a function that exist within instances of the User model as seen within out user login route

  //this represents the object the function was called for
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  //Saving the token to tokens array inside the db
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login. No such user found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login. Sent from model route');
  }

  return user;
};

//This function will hash the password before saving the document onto the db
//pre lets us run some code before the save method is completed
userSchema.pre('save', async function (next) {
  //the keyword this refers to the document when the save method is called
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  //We call next when were done like a return statement. Without it the function will hang
  next();
});

//Delete user tasks when user is deleted
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const jwt = require('jsonwebtoken');
const User = require('../models/user');

//The token is your _id but hashed
//The auth is verifying your id when you try to access protected routes

const auth = async (req, res, next) => {
  try {
    //We use the header method on request to access the clients header
    const token = req.header('Authorization').split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Decoded returns an object which we use in the findOne method -->
    //{ _id: '615691416ff32b475aee640f', iat: 1633070274 }

    //This will query for a user with the same id within our decoded object with the authorization token still stored within the array
    const user = await User.findOne({
      //{ _id: '615691416ff32b475aee640f', iat: 1633070274 } the object being used for the query
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    //For the logout route handler
    //When the user is auth'd, we can attach the token to the request object to later delete
    //and so that the user doensnt have to re-log.
    req.token = token;

    //If an account with the same ID is found, we attach that users info onto the request object.
    //From there we can send back the logged in users profile using req.user
    //SInce the user is logged, we keep the instance of the user saved onto the header
    //Think of it as an instance of a users profile available at all times in the header when accessing other routes
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;

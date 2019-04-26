const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user){
    const timesatamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat:timesatamp}, config.secret);
}

exports.signin = function(req, res, next){
    //Check user object
    //Give them a token
    res.send({token:tokenForUser(req.user)})
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  // Check User Exist

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if(!name || !password || !name){
        return res.status(422).send({error: 'Require email, password and name'})
    }
    // If Exist Return Error

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // User NOT Exist, create and save user record

    const user = new User({
      email: email,
      password: password,
      name:name
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }

      // Respond request
      res.json({token: tokenForUser(user)});
    });
  });
};

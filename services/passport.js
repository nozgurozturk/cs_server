const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//Create Local Strategy
const localOptions = { usernameField: "email" };
const locallogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  //Verify email and password

  //If it is correct email and password

  //Not call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    // check passwords  'password === user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// Setup options

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

//JWT Strategy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // Check user ID in database
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      // If exist, call 'done'
      done(null, user);
    } else {
      //If doesn't exist, call done without user object
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(locallogin);

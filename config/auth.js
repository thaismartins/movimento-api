'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./settings');
const passport = require('passport');

const options = {
  "jwtFromRequest": ExtractJwt.fromAuthHeaderAsBearerToken(),
  "secretOrKey": config.jwt.secret
};

passport.use(new JwtStrategy(options, (payload, done) => {
  
    console.log(payload);
    
    // TODO: validation user
    if (payload.user.id == 1234) {
        return done(null, true)
    }

    return done(null, false)
}));

//Create a passport middleware to handle User login
passport.use('login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
  }, (email, password, done) => {

    console.log('email', email);
    console.log('password', password);
    
    return done(false, { id : 1234 });

    // try {
    //   //Find the user associated with the email provided by the user
    //   const user = await UserModel.findOne({ email });
    //   if( !user ){
    //     //If the user isn't found in the database, return a message
    //     return done(null, false, { message : 'User not found'});
    //   }
    //   //Validate password and make sure it matches with the corresponding hash stored in the database
    //   //If the passwords match, it returns a value of true.
    //   const validate = await user.isValidPassword(password);
    //   if( !validate ){
    //     return done(null, false, { message : 'Wrong Password'});
    //   }
    //   //Send the user information to the next middleware
    //   return done(null, user, { message : 'Logged in Successfully'});
    // } catch (error) {
    //   return done(error);
    // }
  }));
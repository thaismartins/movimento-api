'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const passport = require('passport');
const UserModel = require('../src/users/model');

passport.use(new JwtStrategy({
  "jwtFromRequest": ExtractJwt.fromAuthHeaderAsBearerToken(),
  "secretOrKey": config.jwt.secret
}, async (payload, done) => {
  try {
    const user = await UserModel.findOne({ _id: payload.user.id });
    if(!user) {
      const error = new Error('Credentials not found');
      return done(error, false);
    }

    return done(null, true);
  } catch(error) {
    return done(error, false);
  }
}));

passport.use('login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if(!user) {
      const error = new Error('User not found');
      return done(error, false);
    }

    const validate = await user.isCorrectPassword(password);
    if(!validate) {
      const error = new Error('Wrong Password');
      return done(error, false);
    }

    return done(false, user);
  } catch (error) {
    return done(error, false);
  }
}));
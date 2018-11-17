'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/settings');
const User = require('./model');

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user) => {

    console.log('err', err);
    console.log('user', user);
    
    try {
      if(err || !user){
        const error = new Error('An Error occured')
        return next(error);
      }

      req.login(user, { session : false }, async (error) => {

        if( error ) return next(error);
      
        const body = { id : user.id };
        const token = jwt.sign({ user : body }, config.jwt.secret);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/', (req, res, next) => {

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    
    if(!user.isValidPassword()) {
      return next('The password have to be at least 6 characteres');
    }

    user.save(function (err) {
      if (err) return next(err);
      return res.json({ user });
    });
});

router.get('/', passport.authenticate('jwt', { session : false }), (req, res, next) => {
  res.json({
    text: 'Ok. Deu certo 3!'
  });
});

router.get('/profile', passport.authenticate('jwt', { session : false }), (req, res, next) => {
  res.json({
    message : 'You made it to the secure route',
    user : req.user
  })
});

module.exports = router;
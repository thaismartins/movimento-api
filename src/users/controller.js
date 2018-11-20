'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserModel = require('./model');

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user) => {
    try {
      if(err || !user){
        const error = err || new Error('An Error occured');
        return next(error);
      }

      req.login(user, { session : false }, async (error) => {

        if( error ) return next(error);
      
        const body = { id: user.id, email: user.email };
        const token = jwt.sign({ user : body }, config.jwt.secret);

        return res.json({ token, id: user.id });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get('/', passport.authenticate('jwt', { session : false }), async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', passport.authenticate('jwt', { session : false }), async (req, res, next) => {
  try {
    const users = await UserModel.findOne({ _id: req.params.id });
    res.json(users);
  } catch (error) {
    return next(error);
  }
});

router.post('/', passport.authenticate('jwt', { session : false }), async (req, res, next) => {

    let user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    
    try {
      const newUser = await user.save();
      res.json(newUser);
    } catch (error) {
      return next(error);
    }
});

router.put('/:id', passport.authenticate('jwt', { session : false }), async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });

    if(!user) {
      const error = new Error('User not found');
      return next(error);
    }

    if(req.body.name) user.set('name', req.body.name);
    if(req.body.email) user.set('email', req.body.email);
    if(req.body.password) user.set('password', req.body.password);

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', passport.authenticate('jwt', { session : false }), async (req, res, next) => {
  try {
    const users = await UserModel.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
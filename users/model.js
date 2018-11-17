'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isCorrectPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}

UserSchema.methods.isValidPassword = function() {
  return (this.password.length >= 6);
}

UserSchema.methods.isValid = function() {
  const user = this;
  return (user.name != '' && user.email != '' && user.password != '');
}

module.exports = mongoose.model('User', UserSchema);
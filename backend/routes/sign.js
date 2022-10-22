const express = require('express');

const SignRoutes = express.Router();

const {
  createUser, login,
} = require('../controllers/users');

const {
  authValidation, registerValidation,
} = require('../middlewares/validation');

SignRoutes.post('/signin', authValidation, login);
SignRoutes.post('/signup', registerValidation, createUser);

module.exports = SignRoutes;

const express = require('express');

const UserRoutes = express.Router();

const {
  userValidation, userIdValidation, avatarValidation,
} = require('../middlewares/validation');

const {
  getUserInfo, getUsers, getUserId, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

UserRoutes.get('/users', express.json(), getUsers);
UserRoutes.get('/users/me', express.json(), getUserInfo);
UserRoutes.get('/users/:userId', express.json(), userIdValidation, getUserId);
UserRoutes.patch('/users/me', express.json(), userValidation, updateUserInfo);
UserRoutes.patch('/users/me/avatar', express.json(), avatarValidation, updateUserAvatar);

module.exports = UserRoutes;

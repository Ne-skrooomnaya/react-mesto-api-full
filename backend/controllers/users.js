/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorConflict } = require('../utils/ErrorConflict');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');
const { ErrorUnauthorized } = require('../utils/ErrorUnauthorized');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Переданы невалидные данные'));
    }
    if (err.code === 11000) {
      return next(new ErrorConflict('Пользователь с таким email уже зарегистрирован 5'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res.send(user);
    }
    return next(new ErrorNot('Указанный пользователь не найден'));
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ErrorBad('Переданы невалидные данные'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const updateUserInfo = async (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const user = await User.findById(owner);
    if (!user) {
      return next(new ErrorNot('Такого пользователя не существует 1'));
    }
    return res.send(user);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorUnauthorized('Неверно ведена почта или пароль'));
    }
    const userValid = await bcrypt.compare(password, user.password);
    if (!userValid) {
      return next(new ErrorUnauthorized('Неверно ведена почта или пароль'));
    }

    const token = jwt.sign(
      { _id: user._id },
      'secret-key',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send({ token });
  } catch (error) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
};

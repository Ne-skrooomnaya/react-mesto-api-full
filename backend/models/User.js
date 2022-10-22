/* eslint-disable func-names */
const mongoose = require('mongoose');
// const isUrl = require('validator/lib/isURL');
// const isEmail = require('validator/lib/isEmail');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/.test(v);
      },
      message: 'Невалидная ссылка',
    },
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: validator.isEmail,
      message: 'Неверно заполнен email',
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле "password" должно быть заполнено'],
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);

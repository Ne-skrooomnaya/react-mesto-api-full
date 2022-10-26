const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { ErrorUnauthorized } = require('../utils/ErrorUnauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');

    // payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new ErrorUnauthorized('Ошибка при авторизации'));
  }

  req.user = payload;
  next();
};

module.exports = auth;

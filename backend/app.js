require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const SignRoutes = require('./routes/sign');
const auth = require('./middlewares/auth');
const UserRoutes = require('./routes/users');
const CardRoutes = require('./routes/cards');
const { ErrorNot } = require('./utils/ErrorNot');

const { PORT = 3000 } = process.env;
const app = express();
app.use(
  cors({
    origin: ['https://angel.nomoredomains.icu', 'https://api.angel.nomoredomains.icu'], // было 3000
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.use(cookieParser());

app.use('/', SignRoutes);
app.use('/', auth, UserRoutes);
app.use('/', auth, CardRoutes);
app.use('*', auth, (req, res, next) => {
  next(new ErrorNot('Страница не найдена 5'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка на сервере 3' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});

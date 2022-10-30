const Card = require('../models/Card');

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorForbidden } = require('../utils/ErrorForbidden');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBad('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const deleteCardId = async (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new ErrorNot('Карточка с указанным _id не найдена.'));
    }
    if (owner !== card.owner.toString()) {
      return next(new ErrorForbidden('Вы не можете удалить чужую карточку'));
    }
    await Card.findByIdAndRemove(cardId);
    return res.send({ message: 'карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ErrorNot('Карточка с указанным _id не найдена.'));
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new ErrorNot('Карточка с указанным _id не найдена.'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBad('Ошибка валидации'));
    }
    return next(new ErrorServer('Ошибка на сервере'));
  }
};

module.exports = {
  getCards,
  deleteCardId,
  createCard,
  likeCard,
  dislikeCard,
};

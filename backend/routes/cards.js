const express = require('express');

const CardRoutes = express.Router();

const {
  createCard, getCards, deleteCardId, dislikeCard, likeCard,
} = require('../controllers/cards');

const {
  cardValidation, cardIdValidation,
} = require('../middlewares/validation');

CardRoutes.post('/cards', cardValidation, createCard);
CardRoutes.get('/cards', getCards);
CardRoutes.delete('/cards/:cardId', cardIdValidation, deleteCardId);
CardRoutes.put('/cards/:cardId/likes', cardIdValidation, likeCard);
CardRoutes.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = CardRoutes;

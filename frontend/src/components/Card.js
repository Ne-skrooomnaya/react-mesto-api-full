import React from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Card = ({ card, onCardClick, onCardLike, onCardDelete }) => {
  const currentUser = React.useContext(CurrentUserContext);
  const { name, link, likes, owner } = card;
  const isOwn = owner === currentUser._id;
  const cardDeleteButtonClassName = `element__delete ${isOwn ? '' : 'element__delete_hidden'}`;


  const isLiked = likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = `element__like ${isLiked ? 'element__like_active' : ''}`;

  const handleClick = () => {
    onCardClick(card);
  }

  const handleLikeClick = () => {
    onCardLike(card);
  }

  const handleDeleteClick = () => {
    onCardDelete(card);
  }

  return (
    <div className="element__container">
      <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
      <img className="element__image" src={link} alt={name} onClick={handleClick} />
      <div className="element__bottom">
        <h2 className="element__title">{name}</h2>
        <div className="element__group-like">
          <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
          <p className="element__like-count">{likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
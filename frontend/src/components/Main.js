import React from 'react';
import Card from './Card';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Main = ({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete, cards}) => {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="avatar">
          <button className="profile__avatar-button" onClick={onEditAvatar}>
            {currentUser.avatar && (<img className="avatar__image" src={currentUser.avatar} alt="аватар" />)}
          </button>
        </div>
        <div className="profile__info">
          <div className="profile__top">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" aria-label="edit profile" className="profile__edit-button" onClick={onEditProfile}></button>
          </div>
          <p className="profile__hobby">{currentUser.about}</p>
        </div>
        <button type="button" className="profile__add-button" onClick={onAddPlace}></button>
      </section>
      <section className="elements">
        <ul className="elements__gridul">
          <li className="elements__grid">
          {cards.map((card) => (
              <Card
                card={card}
                key={card._id}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete} 
              />
            ))
          }
          </li>
        </ul>
      </section>
    </main>
  );
}

export default Main;
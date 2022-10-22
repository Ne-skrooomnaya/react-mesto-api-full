import { useContext } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {

  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="avatar">
          <button className="profile__avatar-button" onClick={props.onEditAvatar}>
            {currentUser.avatar && (<img className="avatar__image" src={currentUser.avatar} alt="аватар" />)}
          </button>
        </div>
        <div className="profile__info">
          <div className="profile__top">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" aria-label="edit profile" className="profile__edit-button" onClick={props.onEditProfile}></button>
          </div>
          <p className="profile__hobby">{currentUser.about}</p>
        </div>
        <button type="button" className="profile__add-button" onClick={props.onAddPlace}></button>
      </section>
      <section className="elements">
        <ul className="elements__grid">
          {
            props.cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete} />
            ))
          }
        </ul>
      </section>
    </main>
  );
}

export default Main;
import React from 'react';

function ImagePopup(props) {
  return (
    <section className={`popup popup-photo ${props.isOpen && 'popup_opened'}`}>
      <div className="popup__container popup__container_type_photo">
        <button id="popup-close" onClick={props.onClose} type="button" className="popup__close popup__close-photo" />
        <img src={props.card.link} alt={props.card.name} className="popup__image" />
        <h2 className="popup__photo-text" >{props.card.name}</h2>
      </div>
    </section>
  );
}



export default ImagePopup; 
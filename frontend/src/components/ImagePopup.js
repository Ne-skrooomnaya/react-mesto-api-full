import React from 'react';

const ImagePopup = ({ card, onClose }) => {
    return (
      <section className={`popup popup-photo ${card && ' popup_opened'}`}>
      <div className="popup__container popup__container_type_photo">
        <button id="popup-close" onClick={onClose} type="button" className="popup__close popup__close-photo" />
        <img className="popup__image" src={card ? card.link : ''} alt={card ? card.name : ''} />
        <p className="popup__photo-text">{card ? card.name : ''}</p>
      </div>
    </section>
  );
}



export default ImagePopup; 
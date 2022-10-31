import React  from 'react';
import PopupWithForm from './PopupWithForm';

const ConfirmDeletePopup = ({ isOpen, onClose, card, onConfirm }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(card);
  };

  return <PopupWithForm
  onClose={onClose}
  isOpen={isOpen}
  onSubmit={handleSubmit}
  isValid={true}
  name="delete"
  title="Вы уверены?"
  titleButton="Да"
  />;
};

export default ConfirmDeletePopup;
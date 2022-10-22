import React from 'react';

function PopupWithForm(props) {
  return (
    <section className={`popup popup_type_${props.name} ${props.isOpen && 'popup_opened'}`}>
      <div className="popup__container">
        <button
          onClick={props.onClose}
          type="button"
          className="popup__close"
          id={`${props.name}-close`}
        />
        <form
          className="popup__form"
          name={`${props.name}`}
          id={`${props.name}`}
          onSubmit={props.onSubmit}
        >
          <h2 className="popup__title">{`${props.title}`}</h2>
          {props.children}
          <button
            type="submit"
            className="popup__save">
            {`${props.titleBtn}`}
          </button>
        </form>
      </div>
    </section>
  );
}


export default PopupWithForm; 
import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeLink(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onAddPlace({
            name: name,
            link: link,
        });
    }

    useEffect(() => {
        setName('');
        setLink('');
    }, [props.isOpen]);

    return (
        <PopupWithForm
            isOpen={props.isOpen}
            onClose={props.onClose}
            name="card"
            title="Новое место"
            titleBtn="Создать"
            onSubmit={handleSubmit} >
            <fieldset className="popup__fieldset">
                <input
                    type="text"
                    className="popup__input"
                    name="text"
                    id="popup__text"
                    placeholder="Название"
                    autoComplete="off"
                    minLength={2}
                    maxLength={30}
                    required
                    value={name || ''}
                    onChange={handleChangeName} />
                <span className="popup__error popup__text-error" />
                <input
                    type="url"
                    className="popup__input popup__input-add popup__input_photo"
                    name="photo"
                    id="popup__photo"
                    placeholder="Ссылка на картинку"
                    autoComplete="off"
                    required
                    value={link || ''}
                    onChange={handleChangeLink} />
                <span className="popup__error  popup__photo-error" />
            </fieldset>
        </PopupWithForm>
    )
}

export default AddPlacePopup;
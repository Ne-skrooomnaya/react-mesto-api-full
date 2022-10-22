import { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, props.isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateUser({
            name: name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            onClose={props.onClose}
            isOpen={props.isOpen}
            name="profile"
            title="Редактировать профиль"
            titleBtn='Сохранить'
            onSubmit={handleSubmit}>
            <fieldset className="popup__fieldset">
                <label className="popup__label">
                    <input
                        type="text"
                        className="popup__input"
                        name="name"
                        placeholder="Имя"
                        autoComplete="off"
                        value={name || ''}
                        id="name"
                        onChange={handleChangeName}
                        minLength={2}
                        maxLength={40}
                        required />
                    <span id="name-error" className="popup__error" />
                </label>
                <label className="popup__label">
                    <input
                        type="text"
                        className="popup__input popup__input-edit popup__input_hobby"
                        name="about"
                        id="about"
                        placeholder="О себе"
                        autoComplete="off"
                        value={description || ''}
                        onChange={handleChangeDescription}
                        minLength={2}
                        maxLength={200}
                        required />
                    <span className="popup__error" id="about-error" />
                </label>
            </fieldset>
        </PopupWithForm>
    )
}

export default EditProfilePopup;
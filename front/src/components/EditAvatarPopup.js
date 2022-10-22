import { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {

    const userAvatarRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({
            avatar: userAvatarRef.current.value
        });
    }

    useEffect(() => {
        userAvatarRef.current.value = '';
    }, [props.isOpen]);

    return (
        <PopupWithForm
            title='Обновить аватар'
            name="avatar"
            isOpen={props.isOpen}
            onClose={props.onClose}
            titleBtn='Сохранить'
            onSubmit={handleSubmit}
            >
            <fieldset className="popup__fieldset">
                <label className="popup__label">
                    <input
                        type="url"
                        className="popup__input popup__input-avatar"
                        name="avatar"
                        id="avatar-link"
                        placeholder="Ссылка на картинку"
                        ref={userAvatarRef}
                        required 
                        />
                    <span className="popup__error" id="avatar-link-error" />
                </label>
            </fieldset>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;

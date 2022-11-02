import React, {useState, useEffect}   from 'react';
import { Route, useNavigate, Routes, Navigate } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import ImagePopup from "./ImagePopup";

import logo from "../images/logo.svg";
import okImage from "../images/Union1.svg";
import failImage from "../images/Union2.svg"

import api from "../utils/api";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import * as auth from "../utils/auth.js";
import InfoTooltip from "./InfoTooltip";

import { CurrentUserContext } from "../contexts/CurrentUserContext";


import "../index.js";

const App = () => {
  const navigate = useNavigate();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState({ opened: false, success: false })
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState([]);
  const [cards, setCards] = useState([]);

  const [currentUser, setCurrentUser] = useState({
    name: "Загрузка",
    about: "...",
    // avatar: avatarPreloader,
  });

  // nn
  useEffect(() => {
    checkToken();
  }, [])

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
      .then(([userData, userCard]) => {
        setCurrentUser(userData);
        setUserEmail(userData.email);
        setCards(userCard);
      }).catch((err) => console.log(`Ошибка: ${err}`));
    }
  }, [loggedIn]);

  const checkToken = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth.checkToken(token).then((res) => {
        if (res.email) {
          setUserEmail(res.email);
          setLoggedIn(true);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  const handleRegister = ({ password, email }) => {
    return auth.register({ password, email })
      .then((data) => {
        if (data.email) {
          localStorage.setItem("jwt", data.token);
          setUserEmail(email);
        }
        setInfoTooltipOpen({ opened: true, success: true });
        navigate("/signin");
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipOpen({ opened: true, success: false });
      });
  }

  const handleLogin = ({ password, email }) => {
    return auth.login({ password, email })
      .then((res) => {
        if (res.token) {
          api.setToken(res.token);
          localStorage.setItem("jwt", res.token);
          // tokenCheck();
          // navigate("/");
        }
        setLoggedIn(true);
        setUserEmail(email);
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipOpen({ opened: true, success: false });
      });
  }

  const handleLogOut = () => {
    localStorage.removeItem("jwt");
    navigate("/signin");
    // setCurrentUser({});
    setUserEmail(null);
    setLoggedIn(false);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleClick = (card) => {
    setSelectedCard(card);
  }

  const confirmCardDelete = (card) => {
    setCardToDelete(card);
    setIsConfirmPopupOpen(true);
  };

  const handleLikeClick = (card) => {
    const isLiked = card.likes.some(i => i === currentUser._id);
      api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      }).catch((err) => console.log(err));
    } 

  const handleDeleteClick = (card) => {
    api.deleteCard(card._id).then(() => {
        setCards((state) => state.filter((c) => (c._id !== card._id)));
        closeAllPopups();
      }).catch((err) => console.log(err));
  }

  const handleUpdateUser = (data) => {
    api.editUserInfo(data).then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      }).catch((err) => console.log(err));
  }

  const handleUpdateAvatar = (data) => {
    api.editUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      }).catch((err) => console.log(err));
  }

  const handleAddPlaceSubmit = (data) => {
    api.postCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
      }).catch((err) => console.log(err));
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setIsImagePopupOpen(false);
    setInfoTooltipOpen({ opened: false, success: isInfoTooltipOpen.success })
    setSelectedCard(null);
    setCardToDelete(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header 
          email={userEmail} 
          logo={logo} 
          loggedIn={loggedIn} 
          onClick={handleClick}
          handleLogOut={handleLogOut} 
          />
          <Routes>
            <Route path="/signup" element={<Register handleRegister={handleRegister} />} />
            <Route path="/signin" element={<Login handleLogin={handleLogin} />} />
            <Route path="/" element={<ProtectedRoute
              component={Main}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleClick}
              onCardLike={handleLikeClick}
              onCardDelete={confirmCardDelete}
              cards={cards}
            />
            } />
            <Route
              path="*"
              element={
                loggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />
              }
            />
          </Routes>
          {loggedIn ? <Footer /> : null}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          {/* <PopupWithForm
            title="Вы уверены?"
            name="confirm"
            buttonText="Сохранить"
          /> */}
          <ConfirmDeletePopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateAvatar}
          onConfirm={handleDeleteClick}
          card={cardToDelete}
         />
          <InfoTooltip
            isOpen={isInfoTooltipOpen.opened}
            onClose={closeAllPopups}
            statusImage={isInfoTooltipOpen.success ? okImage : failImage}
            title={isInfoTooltipOpen.success ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз"} 
          />
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

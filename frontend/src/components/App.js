import { useState, useEffect } from 'react';

import logo from '../images/logo.svg';
import okImage from '../images/Union1.svg';
import failImage from '../images/Union2.svg'

import '../index.js';

import Register from './Register';
import Login from './Login';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';

import InfoTooltip from './InfoTooltip';

import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import { Route, useNavigate, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth.js';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState({ opened: false, success: false })

  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  const [currentUser, setCurrentUser] = useState({ name: '', about: '' });

  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

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
        setCards(userCard);
      }).catch((err) => console.log(`Ошибка: ${err}`));
    }
  }, [loggedIn]);

  const checkToken = () => {
    const token = localStorage.getItem('jwt');
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
          localStorage.setItem('jwt', data.token);
          setUserEmail(email);
        }
        setInfoTooltipOpen({ opened: true, success: true });
        navigate('/signin');
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
          localStorage.setItem('jwt', res.token);
          tokenCheck();
          navigate('/');
        }
        setLoggedIn(true);
        setUserEmail(email);
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipOpen({ opened: true, success: false });
      });
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate("/signin");
    setCurrentUser({});
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

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(props.card._id, !isLiked)
    .then((newCard) => {
      setCards((state) =>
        state.map((c) => (c._id === props.card._id ? newCard.data : c))
      );
    }).catch((err) => console.log(err));
  }

  const handleCardDelete = (card) => {
    api.deleteCard(props.card._id).then(() => {
        setCards((state) => state.filter((c) => (c._id !== props.card._id)));
      }).catch((err) => console.log(err));
  }

  const handleUpdateUser = (data) => {
    api.editUserInfo(data).then((res) => {
        setCurrentUser(res)
        closeAllPopups();
      }).catch((err) => console.log(err));
  }

  const handleUpdateAvatar = (data) => {
    api.editUserAvatar(data)
      .then((res) => {
        setCurrentUser(res)
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
    setIsImagePopupOpen(false);
    setInfoTooltipOpen({ opened: false, success: isInfoTooltipOpen.success })
    setSelectedCard(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header 
          logo={logo} 
          email={userEmail} 
          loggedIn={loggedIn} 
          handleLogout={handleLogout} 
          />
          <Routes>
            <Route path="/signup" element={<Register handleRegister={handleRegister} />} />
            <Route path="/signin" element={<Login handleLogin={handleLogin} />} />
            <Route path="/" element={<ProtectedRoute
              component={Main}
              cards={cards}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
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
          <PopupWithForm
            title='Вы уверены?'
            name='confirm'
            buttonText='Сохранить'
          />
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
          />
          <InfoTooltip
            isOpen={isInfoTooltipOpen.opened}
            onClose={closeAllPopups}
            statusImage={isInfoTooltipOpen.success ? okImage : failImage}
            title={isInfoTooltipOpen.success ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз'} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
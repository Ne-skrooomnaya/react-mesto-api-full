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

  useEffect(() => {
    api.getUserInfo()
      .then((response) => {
        setCurrentUser(response);
      })
      .catch((err) => {
        alert(err);
      });

    api.getCards()
      .then((response) => {
        setCards(response.reverse());
      })
      .catch((err) => {
        alert(err);
      });
  }, []);


  // nn
  useEffect(() => {
    tokenCheck();
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
      return;
    }
  }, [loggedIn, navigate]);





  // nnm

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
    setSelectedCard({ name: '', link: '' });
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setInfoTooltipOpen({ opened: false, success: isInfoTooltipOpen.success })
  }


  const handleUpdateUser = ({ name, about }) => {
    api.editUserInfo({ name, about })
      .then(({ name, about }) => {
        setCurrentUser({ ...currentUser, name, about })
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleUpdateAvatar = ({ avatar }) => {
    api.editUserAvatar({ avatar })
      .then(({ avatar }) => {
        setCurrentUser({ ...currentUser, avatar })
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => {
        alert(err);
      });

  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleAddPlaceSubmit = (newCard,) => {
    api.postCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      });
  }

  // nn
  const handleRegister = ({ password, email }) => {
    auth.register({ password, email })
      .then((res) => {
        console.log(res);
        console.log(res.data.email);
        setInfoTooltipOpen({ opened: true, success: true });
        navigate.push('/signin');
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipOpen({ opened: true, success: false });
      })
        // .finally(()=> setInfoTooltipOpen.open());
  }

  const handleLogin = ({ password, email }) => {
    auth.login({ password, email })
      .then((res) => {
        if (res.token) {
          console.log(res);
          console.log(userEmail.email);
          api.setToken(res.token);
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
        }
      }).catch((err) => {
        console.log(err);
        setLoggedIn(false);
        setInfoTooltipOpen(failImage);
        setInfoTooltipOpen({ opened: true, success: false });
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate.push('/signin');
    setCurrentUser({});
    setLoggedIn(false);
  }

  // function handleSignOut() {
  //   localStorage.removeItem('jwt');
  //   navigate.push('/signin');
  //   setCurrentUser({});
  //   setLoggedIn(false);
  // }

  const tokenCheck = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token)
      .then((res) => {
        console.log(res);
        if (res) {
          setLoggedIn(true);
        }
      })
      .catch((err) => {console.log(`Ошибка: ${err}`)});
    }
  }
  // nnm


  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(()=>{
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
      .then(([userInfo, cards]) => {
        setCurrentUser(userInfo.user);
        setCards(cards.data);
        setUserEmail(userInfo.user.email)
        navigate.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [loggedIn, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header logo={logo} email={userEmail} loggedIn={loggedIn} handleLogout={handleLogout} />
          <Routes>
            <Route exact path="/signup" element={<Register handleRegister={handleRegister} />} />
            <Route exact path="/signin" element={<Login handleLogin={handleLogin} />} />
            <Route exact path="/" element={<ProtectedRoute
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            } />
            <Route
              exact path="*"
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
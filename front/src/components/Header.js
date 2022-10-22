import headerLogo from '../images/mesto.svg';
import React from 'react';
import { useLocation, Link } from "react-router-dom";

function Header({email, loggedIn, handleLogout}) {
// nn
  const location = useLocation();

  function getButtonValue() {
    switch (location.pathname) {
      case '/signin':
        return 'Регистрация';
      case '/signup':
        return 'Войти';
      default:
        return 'Выйти';
    }
  }

  function getButtonRoute() {
    switch (location.pathname) {
      case '/signin':
        return '/signup';
      case '/signup':
        return '/signin';
      default:
        return '/signin';
    }
  }

  function handleClick() {
    if (getButtonValue() === 'Выйти') {
      handleLogout();
    }
  }
// nnm
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="лого" />
      {/* nn */}
      <div className="header__container">
        {loggedIn && <p className="header__email">{email}</p>}
        <Link className="header__link" to={getButtonRoute()}>
          <button className="header__button" onClick={handleClick}>{getButtonValue()}</button>
        </Link>
      </div>
      {/* nnm */}
    </header>
  );
}

export default Header;


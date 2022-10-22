class Api {
  constructor(config) {
    this._baseUrl = config.baseUrl;
    this._headers = config.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}users/me/`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._checkResponse)
  }

  editUserInfo(data) {
    return fetch(`${this._baseUrl}users/me/`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._checkResponse)
  }

  editUserAvatar(newAvatarUrl) {
    return fetch(`${this._baseUrl}users/me/avatar/`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(newAvatarUrl)
    })
      .then(this._checkResponse)
  }

  getCards() {
    return fetch(`${this._baseUrl}cards/`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._checkResponse)
  }

  postCard(data) {
    return fetch(`${this._baseUrl}cards/`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then(this._checkResponse)
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(this._checkResponse)
  }

  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._baseUrl}cards/${id}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._headers
    })
      .then(this._checkResponse)
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-43/',
  headers: {
    authorization: '0e5254a8-ef3a-48e3-8585-0243a3225307',
    'Content-Type': 'application/json',
  },
});


export default api;
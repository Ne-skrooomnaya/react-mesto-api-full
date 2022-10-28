class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    // this._token = null;

  }

  //Установка токена
  setToken(token) {
    this._token = token;
    this._headers = {
      ...this._headers,
      'authorization': `Bearer ${token}`
    }
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._checkResponse)
  }

  editUserInfo(data) {
    return fetch(`${this._baseUrl}users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
    }),
    })
      .then(this._checkResponse)
  }

  editUserAvatar(data) {
    return fetch(`${this._baseUrl}users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar})
})
      .then(this._checkResponse)
  }

  getCards() {
    return fetch(`${this._baseUrl}cards`, {
      method: 'GET',
      headers: this._headers,
    })
      .then(this._checkResponse)
  }

  postCard(data) {
    return fetch(`${this._baseUrl}cards`, {
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

// // Общий промис для отрисовки страницы
//   getPromiseAll() {
//     return Promise.all([
//       this.getCards(),
//       this.getUserInfo()
//     ])
//   }
}

let token = localStorage.getItem("jwt");

const api = new Api({
  // url: 'https://api.angel.nomorepartiesxyz.ru',!!!!!
  baseUrl: 'http://localhost:3000/',
  headers: {
    authorization:  `Bearer ${token}`,
    'content-type': 'application/json'
  }
});

export default api;
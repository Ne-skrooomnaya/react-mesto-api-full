class Auth {
    constructor(config) {
        this._baseUrl = config.baseUrl;
    }

    _checkResponse = (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }

    register = ({ password, email }) => {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then(this._checkResponse)
    }

    login = ({ password, email }) => {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then(this._checkResponse)
    }

    checkToken = (token) => {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(this._checkResponse)
    };
}

const auth = new Auth({
    baseUrl: 'https://auth.nomoreparties.co',
    headers: {
        authorization: '0e5254a8-ef3a-48e3-8585-0243a3225307',
        'Content-Type': 'application/json',
      },
});

export default auth
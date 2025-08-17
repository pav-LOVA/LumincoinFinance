const AuthUtils = require('./../../utils/auth-utils');
const HttpUtils = require('./../../utils/http-utils');

class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }
        this.emailElement = document.getElementById('email');
        this.emailErrorElement = document.getElementById('email-error');
        this.passwordElement = document.getElementById('password');
        this.passwordErrorElement = document.getElementById('password-error');
        this.rememberMeElement = document.getElementById('rememberMe');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('login').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;
        if (this.emailElement.value && this.emailElement.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailErrorElement.classList.remove('error');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.classList.remove('error');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.classList.add('error');
            isValid = false;
        }
        return isValid;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const result = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });

            if (result.error || !result.response || (result.response && (!result.response.tokens.refreshToken || !result.response.tokens.accessToken || !result.response.user))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            });
            this.openNewRoute('/');
        }
    }
}

module.exports = Login;
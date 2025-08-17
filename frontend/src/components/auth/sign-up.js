const AuthUtils = require("../../utils/auth-utils");
const HttpUtils = require("../../utils/http-utils");

class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)){
            return this.openNewRoute('/');
        }

        this.nameElement = document.getElementById('name');
        this.nameErrorElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('lastName');
        this.lastNameErrorElement = document.getElementById('lastName');
        this.emailElement = document.getElementById('email');
        this.emailErrorElement = document.getElementById('email-error');
        this.passwordElement = document.getElementById('password');
        this.passwordErrorElement = document.getElementById('password-error');
        this.passwordRepeatElement = document.getElementById('passwordRepeat');
        this.passwordRepeatErrorElement = document.getElementById('passwordRepeat-error');
        document.getElementById('signUp').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;
        if (this.nameElement.value && this.nameElement.value.match(/^([А-Я\s][а-яё]{1,50})$/)) {
            this.nameElement.classList.remove('is-invalid');
            this.nameErrorElement.classList.remove('error');
        } else {
            this.nameElement.classList.add('is-invalid');
            this.nameErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.lastNameElement.value && this.lastNameElement.value.match(/^([А-ЯЁ\s][а-яё]{1,50})$/)) {
            this.lastNameElement.classList.remove('is-invalid');
            this.lastNameErrorElement.classList.remove('error');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            this.lastNameErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.emailElement.value && this.emailElement.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailErrorElement.classList.remove('error');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.classList.remove('error');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatErrorElement.classList.remove('error');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatErrorElement.classList.add('error');
            isValid = false;
        }
        return isValid;
    }

    async signUp() {
        if(this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });

            if (result.error || !result.response || (result.response && !result.response.user)) {
                return;
            }

            AuthUtils.setAuthInfo('', '', {id: result.response.user.id, name: result.response.user.name, lastName: result.response.user.lastName});
            this.openNewRoute('/login');
        }
    }
}

module.exports = SignUp;
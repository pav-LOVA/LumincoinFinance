import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from"../../utils/http-utils";
import {SignupResponse} from "../../interfaces/signup-response.interface";

export class SignUp {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly nameElement: HTMLInputElement | undefined;
    readonly nameErrorElement: HTMLElement | undefined;
    readonly lastNameElement: HTMLInputElement | undefined;
    readonly lastNameErrorElement: HTMLElement | undefined;
    readonly emailElement: HTMLInputElement | undefined;
    readonly emailErrorElement: HTMLElement | undefined;
    readonly passwordElement: HTMLInputElement | undefined;
    readonly passwordErrorElement: HTMLElement | undefined;
    readonly passwordRepeatElement: HTMLInputElement | undefined;
    readonly passwordRepeatErrorElement: HTMLElement | undefined;

    constructor(openNewRoute:(url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)){
            this.openNewRoute('/');
            return;
        }

        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.nameErrorElement = document.getElementById('name') as HTMLElement;
        this.lastNameElement = document.getElementById('lastName') as HTMLInputElement;
        this.lastNameErrorElement = document.getElementById('lastName') as HTMLElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.emailErrorElement = document.getElementById('email-error') as HTMLElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordErrorElement = document.getElementById('password-error') as HTMLElement;
        this.passwordRepeatElement = document.getElementById('passwordRepeat') as HTMLInputElement;
        this.passwordRepeatErrorElement = document.getElementById('passwordRepeat-error') as HTMLElement;

        const signupButton = document.getElementById('signUp') as HTMLButtonElement;
        signupButton.addEventListener('click', this.signUp.bind(this));
    }

    validateForm(): boolean {
        let isValid: boolean = true;
        if (this.nameElement && this.nameErrorElement && this.nameElement.value && this.nameElement.value.match(/^([А-Я\s][а-яё]{1,50})$/)) {
            this.nameElement.classList.remove('is-invalid');
            this.nameErrorElement.classList.remove('error');
        } else if (this.nameElement && this.nameErrorElement) {
            this.nameElement.classList.add('is-invalid');
            this.nameErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.lastNameElement && this.lastNameErrorElement && this.lastNameElement.value && this.lastNameElement.value.match(/^([А-ЯЁ\s][а-яё]{1,50})$/)) {
            this.lastNameElement.classList.remove('is-invalid');
            this.lastNameErrorElement.classList.remove('error');
        } else if (this.lastNameElement && this.lastNameErrorElement) {
            this.lastNameElement.classList.add('is-invalid');
            this.lastNameErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.emailElement && this.emailErrorElement && this.emailElement.value && this.emailElement.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailErrorElement.classList.remove('error');
        } else if (this.emailElement && this.emailErrorElement) {
            this.emailElement.classList.add('is-invalid');
            this.emailErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.passwordElement && this.passwordErrorElement && this.passwordElement.value && this.passwordElement.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.classList.remove('error');
        } else if (this.passwordElement && this.passwordErrorElement) {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.passwordRepeatElement && this.passwordRepeatErrorElement && this.passwordRepeatElement.value && this.passwordElement && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatErrorElement.classList.remove('error');
        } else if (this.passwordRepeatElement && this.passwordRepeatErrorElement) {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatErrorElement.classList.add('error');
            isValid = false;
        }
        return isValid;
    }

    async signUp(): Promise<void> {
        if(this.validateForm() && this.nameElement && this.lastNameElement && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
            const result: SignupResponse = await HttpUtils.request('/signup', 'POST', false, {
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
import {AuthUtils} from '../../utils/auth-utils';
import {HttpUtils} from '../../utils/http-utils';
import {LoginResponseType} from "../../types/login-response.type";


export class Login {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly emailElement: HTMLInputElement | undefined;
    readonly emailErrorElement: HTMLElement | undefined;
    readonly passwordElement: HTMLInputElement | undefined;
    readonly passwordErrorElement: HTMLElement | undefined;
    readonly rememberMeElement: HTMLInputElement | undefined;
    readonly commonErrorElement: HTMLElement | undefined;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/')
            return;
        }
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.emailErrorElement = document.getElementById('email-error') as HTMLElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordErrorElement = document.getElementById('password-error') as HTMLElement;
        this.rememberMeElement = document.getElementById('rememberMe') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLElement;

        const loginButton = document.getElementById("login") as HTMLButtonElement;
        loginButton.addEventListener("click", this.login.bind(this));
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.emailElement && this.emailErrorElement && this.emailElement.value && this.emailElement.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailErrorElement.classList.remove('error');
        } else if (this.emailElement && this.emailErrorElement) {
            this.emailElement.classList.add('is-invalid');
            this.emailErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.passwordElement && this.passwordErrorElement && this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.classList.remove('error');
        } else if (this.passwordElement && this.passwordErrorElement) {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.classList.add('error');
            isValid = false;
        }
        return isValid;
    }

    private async login(): Promise<void> {
        if(this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm() && this.emailElement && this.passwordElement && this.rememberMeElement) {
            const result: LoginResponseType = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });

            if (this.commonErrorElement && (result.error || !result.response || (result.response && (!result.response.tokens.refreshToken || !result.response.tokens.accessToken || !result.response.user)))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            if (result.response) {
                AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                    id: result.response.user.id,
                    name: result.response.user.name,
                    lastName: result.response.user.lastName
                });
                this.openNewRoute('/');
            }
        }
    }
}
import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";


export class IncomeCreate {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly incomeCategoryElement: HTMLInputElement | undefined;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const saveButton: HTMLElement | null = document.getElementById('saveButton');
        if(saveButton) {
            saveButton.addEventListener('click', this.saveCategory.bind(this));
        }

        this.incomeCategoryElement = document.getElementById('incomeCategory') as HTMLInputElement;
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
            if ( this.incomeCategoryElement && this.incomeCategoryElement.value) {
                this.incomeCategoryElement.classList.remove('is-invalid');
            } else if (this.incomeCategoryElement) {
                this.incomeCategoryElement.classList.add('is-invalid');
                isValid = false;
            }
        return isValid;
    }

    private async saveCategory(e: any): Promise<any> {
        e.preventDefault();

        if (this.incomeCategoryElement && this.validateForm()) {
            const createData= {
                title: this.incomeCategoryElement.value,
            }

            const result = await HttpUtils.request('/categories/income/', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && (result.response.error))) {
                return alert('Возникла ошибка, обратитесь в поддержку');
            }
            return this.openNewRoute('/income');
        }
    }
}
import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";


export class ExpensesCreate {
    readonly openNewRoute: any;
    readonly expenseCategoryElement: HTMLInputElement | undefined;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const saveButton: HTMLElement | null = document.getElementById('saveButton');
        if(saveButton) {
            saveButton.addEventListener('click', this.saveCategory.bind(this));
        }

        this.expenseCategoryElement = document.getElementById('expenseCategory') as HTMLInputElement;
    }

    private validateForm(): boolean {
        let isValid: boolean  = true;
        if (this.expenseCategoryElement && this.expenseCategoryElement.value) {
            this.expenseCategoryElement.classList.remove('is-invalid');
        } else if (this.expenseCategoryElement) {
            this.expenseCategoryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    private async saveCategory(e:any): Promise<any> {
        e.preventDefault();

        if (this.expenseCategoryElement && this.validateForm()) {
            const createData= {
                title: this.expenseCategoryElement.value,
            }

            const result = await HttpUtils.request('/categories/expense/', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && (result.response.error))) {
                return alert('Возникла ошибка, обратитесь в поддержку');
            }
            return this.openNewRoute('/expenses');
        }
    }
}
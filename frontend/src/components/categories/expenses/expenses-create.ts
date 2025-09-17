import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";
import {CategoryResponse} from "../../../interfaces/category-response.interface";

export class ExpensesCreate {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly expenseCategoryElement: HTMLInputElement | undefined;

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

    private async saveCategory(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.expenseCategoryElement && this.validateForm()) {
            const createData= {
                title: this.expenseCategoryElement.value,
            }
            const result: CategoryResponse = await HttpUtils.request('/categories/expense/', 'POST', true, createData);

            if (result.error || !result.response) {
                return alert('Возникла ошибка, обратитесь в поддержку');
            }
            return this.openNewRoute('/expenses');
        }
    }
}
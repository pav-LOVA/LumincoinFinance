import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";
import type {CategoryType} from "../../../types/category.type";


export class ExpensesEdit {
    readonly openNewRoute: any;
    readonly expenseCategoryElement: HTMLInputElement | undefined;
    private categoryOriginalData: CategoryType | undefined;

    constructor(openNewRoute:any) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id: unknown | null = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/expenses');
        }

        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        if(updateButton) {
            updateButton.addEventListener('click', this.updateCategory.bind(this));
        }
        this.expenseCategoryElement = document.getElementById('expenseCategory') as HTMLInputElement;

        this.getCategory(id).then();
    }

    private async getCategory(id: unknown): Promise<any> {
        const result = await HttpUtils.request('/categories/expense/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        this.categoryOriginalData = result.response as CategoryType;
        this.showCategory(result.response);
    }

    private showCategory(category:CategoryType): void {
        if (this.expenseCategoryElement) {
            this.expenseCategoryElement.value = category.title;
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.expenseCategoryElement && this.expenseCategoryElement.value && this.expenseCategoryElement.value) {
            this.expenseCategoryElement.classList.remove('is-invalid');
        } else if (this.expenseCategoryElement) {
            this.expenseCategoryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    private async updateCategory(e:any): Promise<any> {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {} as CategoryType;
            if(this.expenseCategoryElement && this.categoryOriginalData && this.expenseCategoryElement.value !== this.categoryOriginalData.title) {
                changedData.title = this.expenseCategoryElement.value;
            }

            if(this.categoryOriginalData && Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/categories/expense/' + this.categoryOriginalData.id, 'PUT', true, changedData);
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
}
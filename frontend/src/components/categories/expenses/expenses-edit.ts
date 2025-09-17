import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";
import {CategoryResponse} from "../../../interfaces/category-response.interface";
import {CategoriesType} from "../../../types/categories.type";


export class ExpensesEdit {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly expenseCategoryElement: HTMLInputElement | undefined;
    private categoryOriginalData: CategoriesType | undefined;

    constructor(openNewRoute:(url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const idParam: string | null = urlParams.get('id');
        if (!idParam) {
            this.openNewRoute('/expenses');
            return;
        }
        const id: number = Number(idParam);
        if (isNaN(id)) {
            this.openNewRoute('/expenses');
            return;
        }

        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        if(updateButton) {
            updateButton.addEventListener('click', this.updateCategory.bind(this));
        }
        this.expenseCategoryElement = document.getElementById('expenseCategory') as HTMLInputElement;

        this.getCategory(id).then();
    }

    private async getCategory(id: number): Promise<void> {
        const result = await HttpUtils.request('/categories/expense/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        this.categoryOriginalData = result.response as CategoriesType;
        this.showCategory(result.response);
    }

    private showCategory(category: CategoriesType): void {
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

    private async updateCategory(e:MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {} as CategoriesType;
            if(this.expenseCategoryElement && this.categoryOriginalData && this.expenseCategoryElement.value !== this.categoryOriginalData.title) {
                changedData.title = this.expenseCategoryElement.value;
            }

            if(this.categoryOriginalData && Object.keys(changedData).length > 0) {
                const result: CategoryResponse = await HttpUtils.request('/categories/expense/' + this.categoryOriginalData.id, 'PUT', true, changedData);
                if (result.error || !result.response) {
                    return alert('Возникла ошибка, обратитесь в поддержку');
                }
                return this.openNewRoute('/expenses');
            }
        }
    }
}
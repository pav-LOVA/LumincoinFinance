import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";
import {CategoriesResponseType, CategoryType} from "../../../types/categories.type";


export class IncomeEdit {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly incomeCategoryElement: HTMLInputElement | undefined;
    private categoryOriginalData: CategoryType | undefined;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const idParam: string | null = urlParams.get('id');
        if (!idParam) {
            this.openNewRoute('/income');
            return;
        }
        const id: number = Number(idParam);
        if (isNaN(id)) {
            this.openNewRoute('/income');
            return;
        }

        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        if(updateButton) {
            updateButton.addEventListener('click', this.updateCategory.bind(this));
        }
        this.incomeCategoryElement = document.getElementById('incomeCategory') as HTMLInputElement;

        this.getCategory(id).then();
    }

    private async getCategory(id: number): Promise<any> {
        const result = await HttpUtils.request('/categories/income/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        this.categoryOriginalData = result.response;
        this.showCategory(result.response);
    }

    private showCategory(category:CategoryType): void  {
        if (this.incomeCategoryElement) {
            this.incomeCategoryElement.value = category.title;
        }
    }

    private validateForm():boolean {
        let isValid: boolean = true;
        if (this.incomeCategoryElement && this.incomeCategoryElement.value && this.incomeCategoryElement.value) {
            this.incomeCategoryElement.classList.remove('is-invalid');
        } else if (this.incomeCategoryElement) {
            this.incomeCategoryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    private async updateCategory(e: MouseEvent) :Promise<any> {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {} as CategoryType;
            if(this.incomeCategoryElement && this.categoryOriginalData && this.incomeCategoryElement.value !== this.categoryOriginalData.title) {
                changedData.title = this.incomeCategoryElement.value;
            }

            if(this.categoryOriginalData && Object.keys(changedData).length > 0) {
                const result: CategoriesResponseType = await HttpUtils.request('/categories/income/' + this.categoryOriginalData.id, 'PUT', true, changedData);
                if (result.error || !result.response) {
                    return alert('Возникла ошибка, обратитесь в поддержку');
                }
                return this.openNewRoute('/income');
            }
        }
    }
}
import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";
import {Category} from "../../../types/category-type.type";
import {CategoriesResponseType} from "../../../types/categories.type";
import {OperationResponseType} from "../../../types/operation-response.type";


export class CommonCreate {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    private incomeElement: HTMLSelectElement | undefined;
    private expenseElement: HTMLSelectElement | undefined;
    readonly operationElement: HTMLSelectElement | undefined;
    readonly categoryElement: HTMLInputElement | undefined;
    readonly categoryErrorElement: HTMLElement | undefined;
    readonly amountElement: HTMLInputElement | undefined;
    readonly amountErrorElement: HTMLElement | undefined;
    readonly dateElement: HTMLInputElement | undefined;
    readonly dateErrorElement: HTMLElement | undefined;
    readonly commentElement: HTMLInputElement | undefined;
    readonly commentErrorElement: HTMLElement | undefined;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const type: Category | null = urlParams.get('type') as Category;
        if (!type) {
            this.openNewRoute('/income&expenses');
            return;
        }

        this.incomeElement = document.getElementById('income-element') as HTMLSelectElement;
        this.expenseElement = document.getElementById('expense-element') as HTMLSelectElement;
        this.operationElement = document.getElementById('operation-element') as HTMLSelectElement;

        this.categoryElement = document.getElementById('category-element') as HTMLInputElement;
        this.categoryErrorElement = document.getElementById('category-element-error') as HTMLElement;
        this.amountElement = document.getElementById('amount-element') as HTMLInputElement;
        this.amountErrorElement = document.getElementById('amount-element-error') as HTMLElement;
        this.dateElement = document.getElementById('date-element') as HTMLInputElement;
        this.dateErrorElement = document.getElementById('date-element-error') as HTMLElement;
        this.commentElement = document.getElementById('comment-element') as HTMLInputElement;
        this.commentErrorElement = document.getElementById('comment-element-error') as HTMLElement;

        if (type === Category.expense) {
            this.expenseElement.setAttribute("selected", "selected");
        } else if (type === Category.income) {
            this.incomeElement.setAttribute("selected", "selected");
        }

        const saveButton: HTMLElement | null = document.getElementById('saveButton');
        if(saveButton) {
            saveButton.addEventListener('click', this.saveOperation.bind(this));
        }

        this.getCategories(type);
    }

    private async getCategories(type: Category): Promise<any> {
        const result: CategoriesResponseType = await HttpUtils.request('/categories/' + type);

        if (result.error || !result.response || result.response) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        const categories: any = result.response;
        for (let i: number = 0; i < categories.length; i++) {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = categories[i].id
            option.innerText = categories[i].title;
            if (this.categoryElement) {
                this.categoryElement.appendChild(option);
            }
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.amountElement && this.amountErrorElement && this.amountElement.value) {
            this.amountElement.classList.remove('is-invalid');
            this.amountErrorElement.classList.remove('error');
        } else if (this.amountElement && this.amountErrorElement) {
            this.amountElement.classList.add('is-invalid');
            this.amountErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.dateElement && this.dateErrorElement && this.dateElement.value) {
            this.dateElement.classList.remove('is-invalid');
            this.dateErrorElement.classList.remove('error');
        } else if (this.dateElement && this.dateErrorElement) {
            this.dateElement.classList.add('is-invalid');
            this.dateErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.commentElement && this.commentErrorElement && this.commentElement.value) {
            this.commentElement.classList.remove('is-invalid');
            this.commentErrorElement.classList.remove('error');
        } else if (this.commentElement && this.commentErrorElement) {
            this.commentElement.classList.add('is-invalid');
            this.commentErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.categoryElement && this.categoryErrorElement && this.categoryElement.value !== 'null') {
            this.categoryElement.classList.remove('is-invalid');
            this.categoryErrorElement.classList.remove('error');
        } else if (this.categoryElement && this.categoryErrorElement) {
            this.categoryElement.classList.add('is-invalid');
            this.categoryErrorElement.classList.add('error');
            isValid = false;
        }
        return isValid;
    }

    private async saveOperation(e: MouseEvent): Promise<any> {
        e.preventDefault();

        if (this.operationElement && this.amountElement && this.dateElement && this.commentElement && this.categoryElement && this.validateForm()) {
            const createData = {
                type: this.operationElement.value,
                amount: this.amountElement.value,
                date: this.dateElement.value,
                comment: this.commentElement.value,
                category_id: parseInt(this.categoryElement.value),
            };
            const result :OperationResponseType = await HttpUtils.request('/operations', 'POST', true, createData);

            if (result.error || !result.response || result.response) {
                return alert('Возникла ошибка, обратитесь в поддержку');
            }
            return this.openNewRoute('/income&expenses');
        }
    }
}
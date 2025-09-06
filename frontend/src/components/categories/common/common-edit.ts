import {HttpUtils} from "../../../utils/http-utils";
import {AuthUtils} from "../../../utils/auth-utils";
import type {OperationType} from "../../../types/operation-type.type";
import {CategoryType} from "../../../types/category-type.type";


export class CommonEdit {
    readonly openNewRoute: any;
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
    private operationOriginalData: OperationType | undefined;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id: unknown | null = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/income&expenses/');
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

        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        if(updateButton) {
            updateButton.addEventListener('click', this.updateOperation.bind(this));
        }

        this.getOperation(id).then();
    }

    private async getOperation(id:unknown):Promise<any> {
        const result = await HttpUtils.request('/operations/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        this.operationOriginalData = result.response;
        this.showOperation(result.response);
        this.getCategories(result.response);
    }

    private async getCategories(operation: OperationType): Promise<any> {
        const result = await HttpUtils.request('/categories/' + operation.type);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        const categories = result.response;
        for (let i = 0; i < categories.length; i++) {
            const option = document.createElement("option");
            option.value = categories[i].id
            option.innerText = categories[i].title;
            if(this.categoryElement) {
                this.categoryElement.appendChild(option);
            }
        }

        const found: any = categories.find((cat: any) => cat.title === operation.category);
        if (found && this.categoryElement) {
            this.categoryElement.value = found.id;
        }

        this.showOperation(operation);
    }

    private showOperation(operation: any): void {
        if (this.expenseElement && operation.type === CategoryType.expense) {
            this.expenseElement.setAttribute("selected", "selected");
        } else if (this.incomeElement && operation.type === CategoryType.income) {
            this.incomeElement.setAttribute("selected", "selected");
        }
        if(this.amountElement) {
            this.amountElement.value = operation.amount;
        }
        if( this.dateElement) {
            this.dateElement.value = operation.date;
        }
        if(this.commentElement) {
            this.commentElement.value = operation.comment;
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

    private async updateOperation(e: any): Promise<any> {
        e.preventDefault();

        if (this.operationElement && this.amountElement && this.dateElement && this.commentElement && this.categoryElement && this.validateForm() && this.operationOriginalData) {
            const createData = {
                type: this.operationElement.value,
                amount: this.amountElement.value,
                date: this.dateElement.value,
                comment: this.commentElement.value,
                category_id: parseInt(this.categoryElement.value),
            };
            const result = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && (result.response.error))) {
                return alert('Возникла ошибка, обратитесь в поддержку');
            }
            return this.openNewRoute('/income&expenses');
        }
    }
}
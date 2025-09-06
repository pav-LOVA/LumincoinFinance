import {HttpUtils} from "../../../utils/http-utils";

export class ExpensesList {
    readonly openNewRoute: any;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        const nonDelete: HTMLElement | null = document.getElementById('nonDelete');
        if(nonDelete) {
            nonDelete.addEventListener('click', this.hidePopup.bind(this));
        }

        this.getCategoriesExpenses().then();
    }

    private async getCategoriesExpenses(): Promise<void> {
        const result = await HttpUtils.request('/categories/expense');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        this.showRecords(result.response);
    }

    private showRecords(categories:any):void {
        const recordsElement: HTMLElement | null = document.querySelector('.card-items');
        for (let i: number = 0; i < categories.length; i++) {
            const cardItemElement: HTMLDivElement = document.createElement('div');
            cardItemElement.className = 'card-item border border-secondary-subtle rounded-2';

            const cardTitle: HTMLDivElement = document.createElement('div');
            cardTitle.className = 'card-title';
            cardTitle.innerText = categories[i].title;

            const buttonContainerElement: HTMLDivElement = document.createElement('div');
            buttonContainerElement.className = 'mt-2';

            const editButtonElement: HTMLAnchorElement = document.createElement('a');
            editButtonElement.className = 'btn btn-primary btn-sm btn-edit me-1';
            editButtonElement.innerText = 'Редактировать';
            editButtonElement.href = '/expenses/edit?id=' + categories[i].id;

            const deleteButtonElement: HTMLAnchorElement = document.createElement('a');
            deleteButtonElement.className = 'btn btn-danger btn-sm';
            deleteButtonElement.innerText = 'Удалить';

            deleteButtonElement.addEventListener('click', () => this.showPopup(categories[i].id));

            buttonContainerElement.appendChild(editButtonElement);
            buttonContainerElement.appendChild(deleteButtonElement);
            cardItemElement.appendChild(cardTitle);
            cardItemElement.appendChild(buttonContainerElement);
            if (recordsElement) {
               recordsElement.appendChild(cardItemElement);
            }
        }
        const addCardElement:HTMLAnchorElement = document.createElement('a');
        addCardElement.href = '/expenses/create';
        addCardElement.className = 'card-item card-add border border-secondary-subtle rounded-2';

        const plus:HTMLSpanElement = document.createElement('span');
        plus.textContent = '+';
        addCardElement.appendChild(plus);
        if (recordsElement) {
            recordsElement.appendChild(addCardElement);
        }
    }

    private showPopup(id:number):void {
        const popUp: HTMLElement | null = document.getElementById('popUp');
        if(popUp) {
            popUp.style.display = 'flex';
        }
        const deleteButton: HTMLElement | null = document.getElementById('delete');
        if(deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.deleteCategory(id);
            });
        }
    }

    private hidePopup():void {
        const popUp: HTMLElement | null = document.getElementById('popUp');
        if(popUp) {
            popUp.style.display = 'none';
        }
    }

    private async deleteCategory(id: number): Promise<void> {
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        return this.openNewRoute('/expenses');
    }
}
import {HttpUtils} from "../../../utils/http-utils";

export class IncomeList {
    readonly openNewRoute: (url: string | URL) => Promise<void>;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        const nonDelete: HTMLElement | null = document.getElementById('nonDelete');
        if(nonDelete) {
            nonDelete.addEventListener('click', this.hidePopup.bind(this));
        }

        this.getCategoriesIncome().then();
    }

    private async getCategoriesIncome():Promise<void> {
        const result = await HttpUtils.request('/categories/income');
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        this.showRecords(result.response);
    }

    private showRecords(categories:any):void {
        const recordsElement: Element | null = document.querySelector('.card-items');
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
            editButtonElement.href = '/income/edit?id=' + categories[i].id;

            const DeleteButtonElement: HTMLAnchorElement = document.createElement('a');
            DeleteButtonElement.className = 'btn btn-danger btn-sm';
            DeleteButtonElement.innerText = 'Удалить';

            DeleteButtonElement.addEventListener('click', () => this.showPopup(categories[i].id));

            buttonContainerElement.appendChild(editButtonElement);
            buttonContainerElement.appendChild(DeleteButtonElement);
            cardItemElement.appendChild(cardTitle);
            cardItemElement.appendChild(buttonContainerElement);
            if (recordsElement) {
                recordsElement.appendChild(cardItemElement);
            }
        }
        const addCardElement:HTMLAnchorElement = document.createElement('a');
        addCardElement.href = '/income/create';
        addCardElement.className = 'card-item card-add border border-secondary-subtle rounded-2';

        const plus = document.createElement('span');
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
        const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        return this.openNewRoute('/income');
    }
}
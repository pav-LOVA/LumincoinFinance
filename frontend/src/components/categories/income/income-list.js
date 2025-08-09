const HttpUtils = require('./../../../utils/http-utils');

class IncomeList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('nonDelete').addEventListener('click', this.hidePopup.bind(this));

        this.getCategoriesIncome().then();
    }

    async getCategoriesIncome() {
        const result = await HttpUtils.request('/categories/income');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        this.showRecords(result.response);
    }

    showRecords(categories) {
        const recordsElement = document.querySelector('.card-items');
        for (let i = 0; i < categories.length; i++) {
            const cardItemElement = document.createElement('div');
            cardItemElement.className = 'card-item border border-secondary-subtle rounded-2';

            const cardTitle = document.createElement('div');
            cardTitle.className = 'card-title';
            cardTitle.innerText = categories[i].title;

            const buttonContainerElement = document.createElement('div');
            buttonContainerElement.className = 'mt-2';

            const editButtonElement = document.createElement('a');
            editButtonElement.className = 'btn btn-primary btn-sm btn-edit me-1';
            editButtonElement.innerText = 'Редактировать';
            editButtonElement.href = '/income/edit?id=' + categories[i].id;

            const DeleteButtonElement = document.createElement('a');
            DeleteButtonElement.className = 'btn btn-danger btn-sm';
            DeleteButtonElement.innerText = 'Удалить';

            DeleteButtonElement.addEventListener('click', () => this.showPopup(categories[i].id));

            buttonContainerElement.appendChild(editButtonElement);
            buttonContainerElement.appendChild(DeleteButtonElement);
            cardItemElement.appendChild(cardTitle);
            cardItemElement.appendChild(buttonContainerElement);
            recordsElement.appendChild(cardItemElement);
        }
        const addCardElement = document.createElement('a');
        addCardElement.href = '/income/create';
        addCardElement.className = 'card-item card-add border border-secondary-subtle rounded-2';

        const plus = document.createElement('span');
        plus.textContent = '+';
        addCardElement.appendChild(plus);
        recordsElement.appendChild(addCardElement);
    }

    showPopup(id) {
        document.getElementById('popUp').style.display = 'flex';
        document.getElementById('delete').href = '/income/delete?id=' + id;
    }

    hidePopup() {
        document.getElementById('popUp').style.display = 'none';
    }
}

module.exports = IncomeList;
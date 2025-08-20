const HttpUtils = require("../../../utils/http-utils");

class CommonEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute = '/income&expenses/';
        }

        this.incomeElement = document.getElementById('income-element');
        this.expenseElement = document.getElementById('expense-element');
        this.operationElement = document.getElementById('operation-element');

        this.categoryElement = document.getElementById('category-element');
        this.categoryErrorElement = document.getElementById('category-element-error');
        this.amountElement = document.getElementById('amount-element');
        this.amountErrorElement = document.getElementById('amount-element-error');
        this.dateElement = document.getElementById('date-element');
        this.dateErrorElement = document.getElementById('date-element-error');
        this.commentElement = document.getElementById('comment-element');
        this.commentErrorElement = document.getElementById('comment-element-error');

        document.getElementById('updateButton').addEventListener('click', this.updateOperation.bind(this));
        this.getOperation(id).then();
    }

    async getOperation(id) {
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

    async getCategories(operation) {
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
            this.categoryElement.appendChild(option);
        }

        const found = categories.find(cat => cat.title === operation.category);
        if (found) {
            this.categoryElement.value = found.id;
        }

        this.showOperation(operation);
    }

    showOperation(operation) {
        if (operation.type === 'expense') {
            this.expenseElement.setAttribute("selected", "selected");
        } else if (operation.type === 'income') {
            this.incomeElement.setAttribute("selected", "selected");
        }
        this.amountElement.value = operation.amount;
        this.dateElement.value = operation.date;
        this.commentElement.value = operation.comment;
    }

    validateForm() {
        let isValid = true;
        if (this.amountElement.value) {
            this.amountElement.classList.remove('is-invalid');
            this.amountErrorElement.classList.remove('error');
        } else {
            this.amountElement.classList.add('is-invalid');
            this.amountErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.dateElement.value) {
            this.dateElement.classList.remove('is-invalid');
            this.dateErrorElement.classList.remove('error');
        } else {
            this.dateElement.classList.add('is-invalid');
            this.dateErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.commentElement.value) {
            this.commentElement.classList.remove('is-invalid');
            this.commentErrorElement.classList.remove('error');
        } else {
            this.commentElement.classList.add('is-invalid');
            this.commentErrorElement.classList.add('error');
            isValid = false;
        }
        if (this.categoryElement.value !== 'null') {
            this.categoryElement.classList.remove('is-invalid');
            this.categoryErrorElement.classList.remove('error');
        } else {
            this.categoryElement.classList.add('is-invalid');
            this.categoryErrorElement.classList.add('error');
            isValid = false;
        }
        return isValid;
    }

    async updateOperation(e) {
        e.preventDefault();

        if (this.validateForm()) {
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

module.exports = CommonEdit;
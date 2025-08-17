const HttpUtils = require("../../../utils/http-utils");
const AuthUtils = require("../../../utils/auth-utils");

class CommonEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute = '/income&expenses/';
        }

        this.getOperation(id).then();

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

        if (result.response.type === 'expense') {
            this.expenseElement.setAttribute("selected", "selected");
        } else if (result.response.type === 'income') {
            this.incomeElement.setAttribute("selected", "selected");
        }
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
            if (operation.category === categories[i].id) {
                option.selected = true;
            }
            this.categoryElement.appendChild(option);
        }
    }

    showOperation(operation) {
        this.amountElement.value = operation.amount;
        this.dateElement.value = operation.date;
        this.commentElement.value = operation.comment;

        // this.categoryElement.value = operation.category_id;
        for (let i = 0; i < this.categoryElement.options.length; i++) {
            if (this.categoryElement.options[i].value === operation.category_id) {
                this.categoryElement.selectedIndex = i;
            }
        }
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
                category_id: this.categoryElement.value,
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
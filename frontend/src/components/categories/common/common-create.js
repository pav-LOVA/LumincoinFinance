const HttpUtils = require("../../../utils/http-utils");
const AuthUtils = require("../../../utils/auth-utils");

class CommonCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        if (!type) {
            return this.openNewRoute = '/income&expenses';
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

        if (type === 'expense') {
            this.expenseElement.setAttribute("selected", "selected");
        } else if (type === 'income') {
            this.incomeElement.setAttribute("selected", "selected");
        }
        this.getCategories(type);

        document.getElementById('saveButton').addEventListener('click', this.saveOperation.bind(this));
    }

    async getCategories(type) {
        const result = await HttpUtils.request('/categories/' + type);
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

    async saveOperation(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData = {
                type: this.operationElement.value,
                amount: this.amountElement.value,
                date: this.dateElement.value,
                comment: this.commentElement.value,
                category_id: parseInt(this.categoryElement.value),
            };
            const result = await HttpUtils.request('/operations', 'POST', true, createData);
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

module.exports = CommonCreate;
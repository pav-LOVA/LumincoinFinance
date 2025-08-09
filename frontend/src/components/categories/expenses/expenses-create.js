const HttpUtils = require('./../../../utils/http-utils');

class ExpensesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));

        this.expenseCategoryElement = document.getElementById('expenseCategory');
    }

    validateForm() {
        let isValid = true;
        if (this.expenseCategoryElement.value) {
            this.expenseCategoryElement.classList.remove('is-invalid');
        } else {
            this.expenseCategoryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async saveCategory(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData= {
                title: this.expenseCategoryElement.value,
            }

            const result = await HttpUtils.request('/categories/expense/', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && (result.response.error))) {
                return alert('Возникла ошибка, обратитесь в поддержку');
            }
            return this.openNewRoute('/expenses');
        }
    }
}

module.exports = ExpensesCreate;
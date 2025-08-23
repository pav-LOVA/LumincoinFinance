const HttpUtils = require("../../../utils/http-utils");
const AuthUtils = require("../../../utils/auth-utils");

class ExpensesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute = '/expenses';
        }

        document.getElementById('updateButton').addEventListener('click', this.updateCategory.bind(this));
        this.expenseCategoryElement = document.getElementById('expenseCategory');

        this.getCategory(id).then();
    }

    async getCategory(id) {
        const result = await HttpUtils.request('/categories/expense/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        this.categoryOriginalData = result.response;
        this.showCategory(result.response);
    }

    showCategory(category) {
        this.expenseCategoryElement.value = category.title;
    }

    validateForm() {
        let isValid = true;
        if (this.expenseCategoryElement.value && this.expenseCategoryElement.value) {
            this.expenseCategoryElement.classList.remove('is-invalid');
        } else {
            this.expenseCategoryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async updateCategory(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {};
            if(this.expenseCategoryElement.value !== this.categoryOriginalData.title) {
                changedData.title = this.expenseCategoryElement.value;
            }

            if(Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/categories/expense/' + this.categoryOriginalData.id, 'PUT', true, changedData);
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
}

module.exports = ExpensesEdit;
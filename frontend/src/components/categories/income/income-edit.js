const HttpUtils = require('./../../../utils/http-utils');
const AuthUtils = require("../../../utils/auth-utils");

class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute = '/income';
        }

        document.getElementById('updateButton').addEventListener('click', this.updateCategory.bind(this));
        this.incomeCategoryElement = document.getElementById('incomeCategory');

        this.getCategory(id).then();
    }

    async getCategory(id) {
        const result = await HttpUtils.request('/categories/income/' + id);
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
        this.incomeCategoryElement.value = category.title;
    }

    validateForm() {
        let isValid = true;
        if (this.incomeCategoryElement.value && this.incomeCategoryElement.value) {
            this.incomeCategoryElement.classList.remove('is-invalid');
        } else {
            this.incomeCategoryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async updateCategory(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {};
            if(this.incomeCategoryElement.value !== this.categoryOriginalData.title) {
                changedData.title = this.incomeCategoryElement.value;
            }

            if(Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/categories/income/' + this.categoryOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && (result.response.error))) {
                    return alert('Возникла ошибка, обратитесь в поддержку');
                }
                return this.openNewRoute('/income');
            }
        }
    }
}

module.exports = IncomeEdit;
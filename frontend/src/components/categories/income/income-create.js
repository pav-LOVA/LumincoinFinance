const HttpUtils = require('./../../../utils/http-utils');

class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));

        this.incomeCategoryElement = document.getElementById('incomeCategory');
    }

    validateForm() {
        let isValid = true;
            if (this.incomeCategoryElement.value) {
                this.incomeCategoryElement.classList.remove('is-invalid');
            } else {
                this.incomeCategoryElement.classList.add('is-invalid');
                isValid = false;
            }
        return isValid;
    }

    async saveCategory(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData= {
                title: this.incomeCategoryElement.value,
            }

            const result = await HttpUtils.request('/categories/income/', 'POST', true, createData);
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

module.exports = IncomeCreate;
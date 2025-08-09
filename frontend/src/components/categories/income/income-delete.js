const HttpUtils = require('./../../../utils/http-utils');

class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute = '/';
        }
        this.id = id;
        document.getElementById('delete').addEventListener('click', this.deleteCategory.bind(this));
    }

    async deleteCategory(e) {
        e.preventDefault();

        const result = await HttpUtils.request('/categories/income/' + this.id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && (result.response.error))) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        return this.openNewRoute('/income');
    }
}

module.exports = IncomeDelete;
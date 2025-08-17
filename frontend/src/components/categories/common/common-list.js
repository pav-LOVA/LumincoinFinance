const HttpUtils = require("../../../utils/http-utils");
const AuthUtils = require("../../../utils/auth-utils");


class CommonList {
    constructor(openNewRoute) {
        this.openNewRoute=openNewRoute;

        document.getElementById('nonDelete').addEventListener('click', this.hidePopup.bind(this));

        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)){
            return this.openNewRoute('/login');
        }

        this.getOperations().then();
    }

    async getOperations() {
        const result = await HttpUtils.request('/operations');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        this.showRecords(result.response);
    }

    showRecords(operations) {
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerHTML = '<strong>' + operations[i].id + '</strong>';
            if (operations[i].type === 'income') {
                trElement.insertCell().innerHTML = '<span class="text-income text-success">' + 'доход' + '</span>';
            } else if (operations[i].type ==='expense') {
                trElement.insertCell().innerHTML = '<span class="text-expense text-danger">' + 'расход' + '</span>';
            }
            trElement.insertCell().innerText = operations[i].category;
            trElement.insertCell().innerText = operations[i].amount;
            trElement.insertCell().innerText = operations[i].date;
            trElement.insertCell().innerText = operations[i].comment;
            trElement.insertCell().innerHTML = '<div class="icon">' +
                '<a href="/income&expenses/delete?id=' + operations[i].id + '" class="fa fa-trash me-2" id="trash"></a>' +
                '<a href="/income&expenses/edit?id=' + operations[i].id + '" class="fa fa-pencil" ></a>' +
                '</div>';

            recordsElement.appendChild(trElement);
            const deleteButtonElement = document.getElementById('trash');
            deleteButtonElement.addEventListener('click', () => this.showPopup(operations[i].id));
        }
    }

    showPopup(id){
        document.getElementById('popUp').style.display = 'flex';
        document.getElementById('delete').href = '/expenses/delete?id=' + id;
    }

    hidePopup(){
        document.getElementById('popUp').style.display = 'none';
    }
}

module.exports = CommonList;

const HttpUtils = require("../../../utils/http-utils");

class CommonList {
    constructor(openNewRoute) {
        this.openNewRoute=openNewRoute;
        this.periodButtons = document.querySelectorAll('.filter button[data-period]');
        this.dateFrom = document.getElementById('dateFrom');
        this.dateTo = document.getElementById('dateTo');

        document.getElementById('nonDelete').addEventListener('click', this.hidePopup.bind(this));


        this.getOperations();
        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.periodButtons.forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');

                const period = btn.dataset.period;
                this.getOperations(period);
            });
        });

        const todayBtn = document.querySelector('.filter button[data-period="today"]');
        if (todayBtn) todayBtn.classList.add('active');

        this.dateFrom.addEventListener('change', () => this.onCustomDateChange());
        this.dateTo.addEventListener('change', () => this.onCustomDateChange());
    }

    onCustomDateChange() {
        this.periodButtons.forEach(btn => btn.classList.remove('active'));
        const intervalBtn = document.querySelector('.filter button[data-period="interval"]');
        intervalBtn.classList.add('active');

        if (this.dateFrom.value && this.dateTo.value) {
            this.getOperations('interval');
        }
    }

    async getOperations(period = 'today') {
        let url = '/operations?period=' + period;

        if (period === 'interval') {
            const from = this.dateFrom.value;
            const to = this.dateTo.value;

            const params = [];
            if (from) params.push(this.dateFrom=from);
            if (to) params.push(this.dateTo=to);
            if (params.length > 0) url += '&' + params.join('&');
        }

        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';

        const result = await HttpUtils.request(url);
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
                '<a href="/income&expenses" class="fa fa-trash me-2" data-id=' + operations[i].id+ '></a>' +
                '<a href="/income&expenses/edit?id=' + operations[i].id + '" class="fa fa-pencil" ></a>' +
                '</div>';
            recordsElement.appendChild(trElement);

            const deleteButtonElement = trElement.querySelector('.fa-trash');
            deleteButtonElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPopup(e.currentTarget.dataset.id);
            });
        }
    }

    showPopup(id){
        document.getElementById('popUp').style.display = 'flex';
        document.getElementById('delete').href = '/income&expenses/delete?id=' + id;
    }

    hidePopup(){
        document.getElementById('popUp').style.display = 'none';
    }
}

module.exports = CommonList;

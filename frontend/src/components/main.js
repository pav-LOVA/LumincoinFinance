const Chart = require('chart.js/auto');
const HttpUtils = require('./../utils/http-utils');

class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.incomeChart = document.getElementById('incomeChart');
        this.expenseChart = document.getElementById('expenseChart');

        this.incomeChartInstance = null;
        this.expenseChartInstance = null;

        this.periodButtons = document.querySelectorAll('.filter button[data-period]');
        this.dateFrom = document.getElementById('dateFrom');
        this.dateTo = document.getElementById('dateTo');

        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.periodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const period = btn.dataset.period;
                this.getOperations(period);
            });
        });

        this.dateFrom.addEventListener('change', () => this.onCustomDateChange());
        this.dateTo.addEventListener('change', () => this.onCustomDateChange());

        this.getOperations('today');
    }

    onCustomDateChange() {
        this.periodButtons.forEach(b => b.classList.remove('active'));
        const intervalBtn = document.querySelector('.filter button[data-period="interval"]');
        intervalBtn.classList.add('active');

        if (this.dateFrom.value && this.dateTo.value) {
            this.getOperations('interval');
        } else {
            this.getOperations('today');
        }
    }

    async getOperations(period) {
        let url = '/operations?period=' + period;

        if (period === 'interval') {
            const from = this.dateFrom.value;
            const to = this.dateTo.value;
            const params = [];
            if (from) params.push(`dateFrom=${from}`);
            if (to) params.push(`dateTo=${to}`);
            if (params.length > 0) url += '&' + params.join('&');
        }

        const result = await HttpUtils.request(url);
        if (result.redirect) return this.openNewRoute(result.redirect);
        if (result.error || !result.response || result.response.error) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        const operations = result.response;
        this.renderCharts(operations);
    }

    renderCharts(operations) {
        const incomeData = {};
        const expenseData = {};

        operations.forEach(op => {
            const category = op.category || 'Без категории';

            if (op.type === 'income') {
                incomeData[category] = (incomeData[category] || 0) + op.amount;
            } else if (op.type === 'expense') {
                expenseData[category] = (expenseData[category] || 0) + op.amount;
            }
        });

        this.showIncomeChart(incomeData);
        this.showExpenseChart(expenseData);
    }

    showIncomeChart(data) {
        const chartData = {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#dc2638','#20C997','#0D6EFD','#f4c123','#f18c38','#3db7cd','#cc7ee6','#70258f','#27dd2a','#ffc0cb','#aaaaaa','#171715']
            }]
        };

        if (this.incomeChartInstance) this.incomeChartInstance.destroy();

        this.incomeChartInstance = new Chart(this.incomeChart, {
            type: 'pie',
            data: chartData,
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    showExpenseChart(data) {
        const chartData = {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#dc2638','#f18c38','#f4c123','#27dd2a','#20C997', '#43e1dd','#0D6EFD','#cc7ee6','#70258f','#ffc0cb','#aaaaaa','#171715']
            }]
        };

        if (this.expenseChartInstance) this.expenseChartInstance.destroy();

        this.expenseChartInstance = new Chart(this.expenseChart, {
            type: 'pie',
            data: chartData,
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }
}

module.exports = Main;
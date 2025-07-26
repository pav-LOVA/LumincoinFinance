const Chart = require('chart.js/auto');

class Main {
    constructor() {
        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
        };

        const dataIncome = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [25, 35, 15, 23, 12],
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD']
            }],
            width: 0.4,
        };

        const dataExpense = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                data: [5, 12, 28, 30, 25],
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD']
            }]
        };

        new Chart(document.getElementById('incomeChart'), {
            type: 'pie',
            data: dataIncome,
            options: chartOptions
        });

        new Chart(document.getElementById('expenseChart'), {
            type: 'pie',
            data: dataExpense,
            options: chartOptions
        });
    }

}

module.exports = Main;
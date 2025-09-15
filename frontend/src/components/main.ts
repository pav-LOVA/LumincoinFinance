import { Chart } from "chart.js/auto";
import type { Chart as ChartType } from "chart.js";

import {HttpUtils} from '../utils/http-utils';
import type {OperationType} from "../types/operation.type";


export class Main {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    readonly incomeChart: HTMLCanvasElement | null;
    readonly expenseChart: HTMLCanvasElement | null;
    private incomeChartInstance: ChartType<"pie", number[], string> | null = null;
    private expenseChartInstance: ChartType<"pie", number[], string> | null = null;
    private periodButtons: NodeListOf<HTMLButtonElement>;
    private dateFrom: HTMLInputElement;
    private dateTo: HTMLInputElement;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.incomeChart = document.getElementById('incomeChart') as HTMLCanvasElement | null;
        this.expenseChart = document.getElementById('expenseChart') as HTMLCanvasElement | null;
        this.periodButtons = document.querySelectorAll('.filter button[data-period]') as NodeListOf<HTMLButtonElement>;
        this.dateFrom = document.getElementById('dateFrom') as HTMLInputElement;
        this.dateTo = document.getElementById('dateTo') as HTMLInputElement;

        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', (e: MouseEvent): void => {
                e.preventDefault();
                this.periodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const period: string | undefined = btn.dataset.period as string;
                this.getOperations(period);
            });
        });

        this.dateFrom.addEventListener('change', (): void  => this.onCustomDateChange());
        this.dateTo.addEventListener('change', (): void  => this.onCustomDateChange());
        this.getOperations('today');
    }

    private onCustomDateChange(): void {
        this.periodButtons.forEach(b => b.classList.remove('active'));
        const intervalBtn: HTMLButtonElement | null = document.querySelector('.filter button[data-period="interval"]');
        if(intervalBtn) intervalBtn.classList.add('active');

        if (this.dateFrom.value && this.dateTo.value) {
            this.getOperations('interval');
        } else {
            this.getOperations('today');
        }
    }

    private async getOperations(period: string): Promise<any> {
        let url: string = '/operations?period=' + period;

        if (period === 'interval') {
            const from = this.dateFrom.value;
            const to = this.dateTo.value;
            const params = [];
            if (from) params.push(`dateFrom=${from}`);
            if (to) params.push(`dateTo=${to}`);
            if (params.length > 0) url += '&' + params.join('&');
        }

        const result: any = await HttpUtils.request(url);
        if (result.redirect) return this.openNewRoute(result.redirect);
        if (result.error || !result.response || result.response.error) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }

        const operations: OperationType[]  = result.response;
        this.renderCharts(operations);
    }

    private renderCharts(operations: OperationType[]): void {
        const incomeData: Record<string, number> = {};
        const expenseData: Record<string, number> = {};

        operations.forEach(op => {
            const category: string = op.category || 'Без категории';

            if (op.type === 'income') {
                incomeData[category] = (incomeData[category] || 0) + op.amount;
            } else if (op.type === 'expense') {
                expenseData[category] = (expenseData[category] || 0) + op.amount;
            }
        });

        this.showIncomeChart(incomeData);
        this.showExpenseChart(expenseData);
    }

    private showIncomeChart(data: Record<string, number>) {
        const chartData = {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#dc2638','#20C997','#0D6EFD','#f4c123','#f18c38','#3db7cd','#cc7ee6','#70258f','#27dd2a','#ffc0cb','#aaaaaa','#171715']
            }]
        };

        if (this.incomeChartInstance) this.incomeChartInstance.destroy();

        this.incomeChartInstance = new Chart(this.incomeChart as HTMLCanvasElement, {
            type: 'pie',
            data: chartData,
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    private showExpenseChart(data: Record<string, number>) {
        const chartData = {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#dc2638','#f18c38','#f4c123','#27dd2a','#20C997', '#43e1dd','#0D6EFD','#cc7ee6','#70258f','#ffc0cb','#aaaaaa','#171715']
            }]
        };

        if (this.expenseChartInstance) this.expenseChartInstance.destroy();

        this.expenseChartInstance = new Chart(this.expenseChart as HTMLCanvasElement, {
            type: 'pie',
            data: chartData,
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }
}
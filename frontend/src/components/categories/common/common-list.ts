import {HttpUtils} from "../../../utils/http-utils";
import {OperationResponseType} from "../../../types/operation-response.type";

export class CommonList {
    readonly openNewRoute: (url: string | URL) => Promise<void>;
    private periodButtons: NodeListOf<HTMLButtonElement>;
    private dateFrom: HTMLInputElement;
    private dateTo: HTMLInputElement;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.periodButtons = document.querySelectorAll('.filter button[data-period]');
        this.dateFrom = document.getElementById('dateFrom') as HTMLInputElement;
        this.dateTo = document.getElementById('dateTo') as HTMLInputElement;

        const nonDelete: HTMLElement | null = document.getElementById('nonDelete');
        if(nonDelete) {
            nonDelete.addEventListener('click', this.hidePopup.bind(this));
        }

        this.getOperations();
        this.periodButtons.forEach((btn: HTMLButtonElement) => {
            btn.addEventListener('click', (e: any):void => {
                e.preventDefault();
                this.periodButtons.forEach((btn: HTMLButtonElement) => btn.classList.remove('active'));
                btn.classList.add('active');

                const period: string | undefined = btn.dataset.period as string;
                this.getOperations(period);
            });
        });

        const todayBtn: Element | null = document.querySelector('.filter button[data-period="today"]');
        if (todayBtn) todayBtn.classList.add('active');

        this.dateFrom.addEventListener('change', (): void => this.onCustomDateChange());
        this.dateTo.addEventListener('change', (): void => this.onCustomDateChange());
    }

    private onCustomDateChange(): void {
        this.periodButtons.forEach((btn: HTMLButtonElement) => btn.classList.remove('active'));
        const intervalBtn: Element | null = document.querySelector('.filter button[data-period="interval"]');
        if (intervalBtn) {
            intervalBtn.classList.add('active');
        }
        if (this.dateFrom.value && this.dateTo.value) {
            this.getOperations('interval');
        }
    }

    private async getOperations(period = 'today'): Promise<any> {
        let url: string = '/operations?period=' + period;

        if (period === 'interval') {
            const from: string = this.dateFrom.value;
            const to: string = this.dateTo.value;
            const params = [];
            if (from) params.push(`dateFrom=${from}`);
            if (to) params.push(`dateTo=${to}`);
            if (params.length > 0) url += '&' + params.join('&');
        }

        const recordsElement: HTMLElement | null = document.getElementById('records');
        if(recordsElement) {
            recordsElement.innerHTML = '';
        }

        const result = await HttpUtils.request(url);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        this.showRecords(result.response);
    }

    private showRecords(operations:any): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        for (let i: number = 0; i < operations.length; i++) {
            const trElement: HTMLTableRowElement = document.createElement('tr');
            trElement.insertCell().innerHTML = '<strong>' + operations[i].id + '</strong>';
            if (operations[i].type === 'income') {
                trElement.insertCell().innerHTML = '<span class="text-income text-success">' + 'доход' + '</span>';
            } else if (operations[i].type ==='expense') {
                trElement.insertCell().innerHTML = '<span class="text-expense text-danger">' + 'расход' + '</span>';
            }
            if (!operations[i].category) {
                trElement.insertCell().innerText = 'Без категории';
            } else {
                trElement.insertCell().innerText = operations[i].category;
            }
            trElement.insertCell().innerText = operations[i].amount;
            trElement.insertCell().innerText = operations[i].date;
            trElement.insertCell().innerText = operations[i].comment;
            trElement.insertCell().innerHTML = '<div class="icon">' +
                '<a href="/income&expenses" class="fa fa-trash me-2" data-id=' + operations[i].id+ '></a>' +
                '<a href="/income&expenses/edit?id=' + operations[i].id + '" class="fa fa-pencil" ></a>' +
                '</div>';
            if(recordsElement) {
                recordsElement.appendChild(trElement);
            }

            const deleteButtonElement: HTMLElement | null = trElement.querySelector('.fa-trash');
            if(deleteButtonElement) {
                deleteButtonElement.addEventListener('click', (e:any):void => {
                    e.preventDefault();
                    this.showPopup(e.currentTarget.dataset.id);
                });
            }
        }
    }

    private showPopup(id:number): void{
        const popUp: HTMLElement | null = document.getElementById('popUp');
        if(popUp) {
            popUp.style.display = 'flex';
        }
        const deleteButton: HTMLElement | null = document.getElementById('delete');
        if(deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.deleteOperation(id);
            });
        }
    }

    private hidePopup():void{
        const popUp: HTMLElement | null = document.getElementById('popUp');
        if(popUp) {
            popUp.style.display = 'none';
        }
    }

    private async deleteOperation(id: number): Promise<void> {
        const result : OperationResponseType = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if (result.error || !result.response) {
            return alert('Возникла ошибка, обратитесь в поддержку');
        }
        return this.openNewRoute('/income&expenses');
    }
}

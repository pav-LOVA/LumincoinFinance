class ExpensesList {
    constructor(openNewRoute) {
        this.openNewRoute=openNewRoute;

        document.getElementById('delete').addEventListener('click', this.getDeleteElement.bind(this));
        document.getElementById('nonDelete').addEventListener('click', this.getNonDeleteElement.bind(this));
    }

    getDeleteElement(){
        document.getElementById('popUp').style.display = 'flex';
    }

    getNonDeleteElement(){
        document.getElementById('popUp').style.display = 'none';
    }
}

module.exports = ExpensesList;
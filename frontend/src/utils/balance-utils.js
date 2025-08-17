const config = require("../config/config");
const AuthUtils = require("./auth-utils");

class BalanceUtils {
    static balanceKey = 'balance';

    static getBalanceInfo(key = null) {
        if (key && this.balanceKey) {
            return localStorage.getItem(key);
        } else {
            return {[this.balanceKey]: localStorage.getItem(this.balanceKey)};
        }
    }

    static setBalanceInfo(balance) {
            localStorage.setItem(this.balanceKey, balance);
    }

    static removeBalanceInfo() {
        localStorage.removeItem(this.balanceKey);
    }

    static async getBalance() {
        let result = false;
        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        if (accessToken) {
            const response = await fetch(config.api + '/balance', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': accessToken,
                }
            });
            if (response && response.status === 200) {
                const balanceInfo = await response.json();
                if (balanceInfo && balanceInfo.balance !== null) {
                    this.setBalanceInfo(balanceInfo.balance);
                    return balanceInfo.balance;
                }
            }
        }
        if (!result) {
            this.removeBalanceInfo();
        }
        return result;
    }
}

module.exports = BalanceUtils;
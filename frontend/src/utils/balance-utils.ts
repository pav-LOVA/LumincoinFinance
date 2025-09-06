import config from "../config/config";
import {AuthUtils} from "./auth-utils";


export class BalanceUtils {
    static balanceKey: 'balance' = 'balance';

    // static getBalanceInfo(key = null) {
    //     if (key && this.balanceKey) {
    //         return localStorage.getItem(key);
    //     } else {
    //         return {[this.balanceKey]: localStorage.getItem(this.balanceKey)};
    //     }
    // }

    static setBalanceInfo(balance: any): void {
            localStorage.setItem(this.balanceKey, balance);
    }

    static removeBalanceInfo(): void {
        localStorage.removeItem(this.balanceKey);
    }

    static async getBalance(): Promise<boolean> {
        let result: boolean = false;
        const accessToken: string | null = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        if (accessToken) {
            const response: Response = await fetch(config.api + '/balance', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': accessToken,
                }
            });
            if (response && response.status === 200) {
                const balanceInfo: any = await response.json();
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
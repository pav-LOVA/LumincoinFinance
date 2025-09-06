import config from "../config/config";
import type {UserInfoType} from "../types/user-info.type";
import {AuthKeysType} from "../types/auth-keys.type";
import type {AuthInfoMap} from "../types/auth-info.type";


export class AuthUtils {
    static accessTokenKey: AuthKeysType = AuthKeysType.accessTokenKey;
    static refreshTokenKey: AuthKeysType = AuthKeysType.refreshTokenKey;
    static userInfoKey: AuthKeysType = AuthKeysType.userInfoKey;

    public static setAuthInfo(accessToken:string, refreshToken:string, userInfo: UserInfoType | null = null): void{
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    public static getAuthInfo(key: AuthKeysType): string | null;
    public static getAuthInfo(): AuthInfoMap;
    public static getAuthInfo(key?: AuthKeysType | null): string | null | AuthInfoMap {
        if (key) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
            } as AuthInfoMap;
        }
    }

    public static async updateRefreshToken():Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey) as string | null;
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const tokens: { accessToken: string, refreshToken: string, error?: boolean } = await response.json();
                if (tokens && !tokens.error) {
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                    result = true;
                }
            }
        }
        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}
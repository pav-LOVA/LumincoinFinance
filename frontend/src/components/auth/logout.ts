import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    readonly openNewRoute: (url: string | URL) => Promise<void>;

    constructor(openNewRoute: (url: string | URL) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)){
            this.openNewRoute('/login');
            return;
        }
        this.logout().then();
    }

    private async logout(): Promise<void> {
        await HttpUtils.request('/logout', 'POST', false,{
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });
        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login');
    }
}
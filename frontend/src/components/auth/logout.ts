import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    readonly openNewRoute: any;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)){
            return this.openNewRoute('/login');
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
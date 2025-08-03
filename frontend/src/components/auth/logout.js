const AuthUtils = require("../../utils/auth-utils");
const HttpUtils = require("../../utils/http-utils");

class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)){
            return this.openNewRoute('/login');
        }
        this.logout().then();
    }

    async logout() {
        await HttpUtils.request('/logout', 'POST', false,{
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });
        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login');
    }
}

module.exports = Logout;
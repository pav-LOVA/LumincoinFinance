const HttpUtils = require("../../../utils/http-utils");
const AuthUtils = require("../../../utils/auth-utils");

class CommonEdit {
    constructor(openNewRoute) {
        this.openNewRoute=openNewRoute;


        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)){
            return this.openNewRoute('/login');
        }
    }

}

module.exports = CommonEdit;
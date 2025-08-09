const HttpUtils = require("../../../utils/http-utils");
const AuthUtils = require("../../../utils/auth-utils");

class CommonList {
    constructor(openNewRoute) {
        this.openNewRoute=openNewRoute;

        document.getElementById('delete').addEventListener('click', this.getDeleteElement.bind(this));
        document.getElementById('nonDelete').addEventListener('click', this.getNonDeleteElement.bind(this));

        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)){
            return this.openNewRoute('/login');
        }
    }

    getDeleteElement(){
        document.getElementById('popUp').style.display = 'flex';
    }

    getNonDeleteElement(){
        document.getElementById('popUp').style.display = 'none';
    }


}

module.exports = CommonList;
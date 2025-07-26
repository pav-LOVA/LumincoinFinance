const Router = require ("./router");
const style = require ("./styles/styles.scss");

class App {
    constructor() {
        new Router();
    }
}

(new App());

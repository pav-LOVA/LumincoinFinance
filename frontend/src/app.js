const Router = require ("./router");
const style = require ("./styles/styles.scss");
// import {Router} from "./router";
// import "./styles/styles.scss";

class App {
    constructor() {
        new Router();
    }
}

(new App());

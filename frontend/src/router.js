const FileUtils = require("./utils/file-utils");
const Main = require("./components/main");
const Login = require("./components/auth/login");
const SignUp = require("./components/auth/sign-up");
const Logout = require("./components/auth/logout");
const CommonList = require("./components/categories/common/common-list");
const CommonCreate = require("./components/categories/common/common-create");
const CommonEdit = require("./components/categories/common/common-edit");
const CommonDelete = require("./components/categories/common/common-delete");
const IncomeList = require("./components/categories/income/income-list");
const IncomeCreate = require("./components/categories/income/income-create");
const IncomeEdit = require("./components/categories/income/income-edit");
const IncomeDelete = require("./components/categories/income/income-delete");
const ExpensesList = require("./components/categories/expenses/expenses-list");
const ExpensesCreate = require("./components/categories/expenses/expenses-create");
const ExpensesEdit = require("./components/categories/expenses/expenses-edit");
const ExpensesDelete = require("./components/categories/expenses/expenses-delete");
const AuthUtils = require("./utils/auth-utils");
const BalanceUtils = require('./utils/balance-utils');


class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.userName = null;
        this.userLastName = null;

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/404',
                title: 'Page no found',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income&expenses',
                title: 'Доходы & Расходы',
                filePathTemplate: '/templates/pages/categories/common/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CommonList(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income&expenses/create',
                title: 'Создать новую категорию доходов',
                filePathTemplate: '/templates/pages/categories/common/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CommonCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income&expenses/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/categories/common/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CommonEdit(this.openNewRoute.bind(this));
                },
            },
            // {
            //     route: '/income&expenses/delete',
            //     load: () => {
            //         new CommonDelete(this.openNewRoute.bind(this));
            //     },
            // },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/categories/income/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/create',
                title: 'Создать новую категорию доходов',
                filePathTemplate: '/templates/pages/categories/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/categories/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            // {
            //     route: '/income/delete',
            //     load: () => {
            //         new IncomeDelete(this.openNewRoute.bind(this));
            //     },
            // },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/categories/expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesList(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/create',
                title: 'Создать новую категорию расходов',
                filePathTemplate: '/templates/pages/categories/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/categories/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            // {
            //     route: '/expenses/delete',
            //     load: () => {
            //         new ExpensesDelete(this.openNewRoute.bind(this));
            //     },
            // },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style)
                })
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }
            if (newRoute.title) {
                this.titlePageElement.innerHTML = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');

                    this.userNameElement = document.getElementById('user-name');
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
                        if(userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if(userInfo.name && userInfo.lastName) {
                                this.userName = userInfo.name;
                                this.userLastName = userInfo.lastName;
                            }
                        }
                    this.userNameElement.innerText = this.userName + ' ' + this.userLastName;
                    this.userNameElement = document.getElementById('balance').innerText = await BalanceUtils.getBalance() + '$';

                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute(null);
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

module.exports = Router;
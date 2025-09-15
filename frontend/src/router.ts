import {FileUtils} from "./utils/file-utils";
import {Main} from "./components/main";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {CommonList} from "./components/categories/common/common-list";
import {CommonCreate} from "./components/categories/common/common-create";
import {CommonEdit} from "./components/categories/common/common-edit";
import {IncomeList} from "./components/categories/income/income-list";
import {IncomeCreate} from "./components/categories/income/income-create";
import {IncomeEdit} from "./components/categories/income/income-edit";
import {ExpensesList} from "./components/categories/expenses/expenses-list";
import {ExpensesCreate} from "./components/categories/expenses/expenses-create";
import {ExpensesEdit} from "./components/categories/expenses/expenses-edit";
import {AuthUtils} from "./utils/auth-utils";
import {BalanceUtils} from './utils/balance-utils';
import type {RouteType} from "./types/route.type";


export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    readonly userNameElement: HTMLElement | null;
    readonly userBalanceElement: HTMLElement | null;
    private userName: string | null;
    private userLastName: string | null;
    private routes: RouteType[];

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.userName = null;
        this.userLastName = null;
        this.userNameElement = document.getElementById('user-name');
        this.userBalanceElement = document.getElementById('balance');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
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
                title: '',
                filePathTemplate: '',
                useLayout: false,
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
        ];
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    public async openNewRoute(url: string | URL):Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    private async clickHandler(e:MouseEvent): Promise<void> {
        let element: HTMLAnchorElement | null = null;
        const target = e.target as HTMLElement;
        if (target.nodeName === 'A') {
            element = target as HTMLAnchorElement;
        } else if (target.parentNode && (target.parentNode as HTMLElement).nodeName === 'A') {
            element = target.parentNode as HTMLAnchorElement;
        }

        if (element) {
            e.preventDefault();
            const currentRoute: string = window.location.pathname;
            const url: any = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    private async activateRoute(_: Event | null, oldRoute: string | null = null):Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);
            if (currentRoute) {
                if (currentRoute.styles && currentRoute.styles.length > 0) {
                    currentRoute.styles.forEach(style => {
                        const styleElement: Element | null = document.querySelector(`link[href='/css/${style}']`);
                        if (styleElement) {
                            styleElement.remove();
                        }
                    })
                }
                if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                    currentRoute.unload();
                }
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const firstLink = document.querySelector('link[rel="stylesheet"]');
                    FileUtils.loadPageStyle('/css/' + style, firstLink);
                    // FileUtils.loadPageStyle('/css/' + style, '');
                });
            }
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerHTML = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;

                if (newRoute.useLayout && this.contentPageElement) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini', 'layout-fixed');

                        let userInfo: any = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
                        if(userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if(userInfo.name && userInfo.lastName) {
                                this.userName = userInfo.name;
                                this.userLastName = userInfo.lastName;
                            }
                        }
                        if (this.userNameElement) {
                            this.userNameElement.innerText = this.userName + ' ' + this.userLastName;
                        }
                        if (this.userBalanceElement) {
                            this.userBalanceElement.innerText = await BalanceUtils.getBalance() + '$';
                        }

                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini', 'layout-fixed');
                }
                if(contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
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

    private activateMenuItem(route: RouteType): void {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href: string | null = item.getAttribute('href');
            if (href && (route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}
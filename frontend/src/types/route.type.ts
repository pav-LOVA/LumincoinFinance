export type RouteType = {
    route: string,
    title: string,
    filePathTemplate: string,
    useLayout: '/templates/layout.html' | false,
    load?(): void,
    unload?(): void,
    styles?:string[],
};
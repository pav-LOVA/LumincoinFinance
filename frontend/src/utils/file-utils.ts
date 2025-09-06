export class FileUtils {
    static loadPageStyle(src: string, insertBeforeElement: any) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        document.head.insertBefore(link, insertBeforeElement);
    }
}
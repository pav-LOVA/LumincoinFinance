export class FileUtils {
    static loadPageStyle(src: string, insertBeforeElement?: Node | null): void {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        if (insertBeforeElement instanceof Node) {
            document.head.insertBefore(link, insertBeforeElement);
        } else {
            document.head.appendChild(link);
        }
    }
}
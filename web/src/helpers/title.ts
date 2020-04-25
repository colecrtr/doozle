export function setTitle(newTitle: string): void {
    const base = "Doozle";

    if (newTitle) {
        window.document.title = `${base} - ${newTitle}`;
    } else {
        window.document.title = base;
    }
}
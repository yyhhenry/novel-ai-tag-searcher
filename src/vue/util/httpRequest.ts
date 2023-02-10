export const promiseHttpRequest = (url: URL | string, query: Record<string, string> = {}) => new Promise<string | undefined>(resolve => {
    const base = window.location.href;
    const urlObj = new URL(url, base);
    const req = new XMLHttpRequest();
    const queryString = Object.entries(query).map(([key, value]) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value);
        return `${encodedKey}=${encodedValue}`;
    }).join('&');
    req.open('POST', urlObj);
    req.send(queryString);
    req.addEventListener('readystatechange', () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                resolve(undefined);
            }
        }
    });
    req.addEventListener('error', () => {
        resolve(undefined);
    });
});


/**
 * Perform a simple http request
 */
export default function request<T>(url: string): Promise<T>;
export default function request<T>(method: string, url: string): Promise<T>;
export default function request<T>(method: string, url: string, body?: any): Promise<T>;

export default function request<T>(one: string, two?: string, body?: any): Promise<T> {
    let url = two || one;
    let method = two ? one : 'GET';

    return new Promise<T>((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.addEventListener('load', e => {
            let res = req.responseText;

            if (req.getResponseHeader('content-type') == 'application/json')
                res = JSON.parse(res);

            if (req.status == 200)
                resolve(<any>res);
            else
                reject(res);
        });
        req.open(method, url);

        if (body) {
            req.setRequestHeader('content-type', 'application/json');
            req.send(JSON.stringify(body));
        } else {
            req.send();
        }
    });
}
import { Provider } from 'zhonya';
// import * as Logging from 'zhonya/logging';

import * as method from 'zhonya/util/method';

const injections = new Map<string, (type: any) => any>();

function defineElement(value: any, name: string, ...args: any[]) {
    let callback = injections.get(name);
    if (callback != null){
        callback(value);
    }
}

export function hook(name: string, callback: (type: any) => any) {
    injections.set(name, callback);
}

export function setup(hook: Provider) {
    hook.postInit('rcp-fe-components-js-libs', plugin => {
        plugin.api.getComponentsJS('v1').then((api: any) => {
            method.after(api.__proto__, 'defineElement', defineElement);
        });
    });
}
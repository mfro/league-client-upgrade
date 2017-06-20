import { Provider } from 'base/plugin';
// import * as Logging from 'base/logging';

import * as method from 'base/util/method';

const injections: { name: string, callback: (type: any) => any }[] = [];

function defineElement(value: any, name: string, ...args: any[]) {
    let inject = injections.find(i => i.name == name);
    if (inject != null){
        inject.callback(value);
    }
}

export function hook(name: string, callback: (type: any) => any) {
    let injection = { name: name, callback };
    injections.push(injection);
}

export function setup(hook: Provider) {
    hook.postInit('rcp-fe-components-js-libs', plugin => {
        plugin.api.getComponentsJS('v1').then((api: any) => {
            method.after(api.__proto__, 'defineElement', defineElement);
        });
    });
}
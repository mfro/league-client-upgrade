import { Provider } from '@';
// import * as Logging from '@/logging';

import * as method from '@/util/method';

declare type MixinCallback = (mixins: any[]) => any | void;
declare type PrototypeCallback = (ctor: any) => any | void;

const mixinCbs = new Map<string, MixinCallback>();
const protoCbs = new Map<string, PrototypeCallback>();

function defineElement(original: Function, name: string, ...mixins: any[]) {
    let mixinCb = mixinCbs.get(name);
    if (mixinCb != null) {
        let add = mixinCb(mixins);
        if (add) mixins.push(add);
    }

    let ret = original(name, ...mixins);

    let protoCb = protoCbs.get(name);
    if (protoCb != null) {
        protoCb(ret);
    }

    return ret;
}

export function getSuper(self: { mixins: any[] }, name: string, index: number) {
    let filtered = self.mixins.filter(m => Object.getOwnPropertyDescriptor(m, name));
    let mixin = filtered[index < 0 ? filtered.length + index : index];

    let value = mixin[name];

    if (typeof value == 'function')
        return value.bind(self);

    return value;
}

export function hookMixin(name: string, callback: MixinCallback) {
    mixinCbs.set(name, callback);
}

export function hookPrototype(name: string, callback: PrototypeCallback) {
    protoCbs.set(name, callback);
}

export function setup(hook: Provider) {
    hook.postInit('rcp-fe-components-js-libs', plugin => {
        plugin.api.getComponentsJS('v1').then((api: any) => {
            method.replace(Object.getPrototypeOf(api), 'defineElement', defineElement);
        });
    });
}
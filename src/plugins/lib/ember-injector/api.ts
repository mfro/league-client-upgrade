import { Provider } from '@';
// import * as Logging from '@/logging';

import * as method from '@/util/method';

import Ember from 'rcp-fe-ember-libs/v1';

let hookedEmbers: Ember[] = [];

const injections: { class: string, callback: (ember: Ember) => any }[] = [];

function hookEmber(Ember: Ember) {
    if (hookedEmbers.includes(Ember)) return;
    hookedEmbers.push(Ember);

    method.replace(Ember.Component, 'extend', (original, ...args) => {
        let ret = original(...args);

        for (let arg of args) {
            if (!arg.classNames) continue;

            for (let classname of arg.classNames) {
                for (let inject of injections.filter(a => a.class == classname)) {
                    let mixin = inject.callback(Ember);
                    ret = ret.extend(mixin);

                    injections.splice(injections.indexOf(inject), 1);
                }
            }
        }

        return ret;
    });
}

export function hook(classname: string, callback: (ember: Ember) => any) {
    let injection = { class: classname, callback };
    injections.push(injection);
}

export function setup(hook: Provider) {
    hook.postInit('rcp-fe-ember-libs', plugin => {
        method.after(plugin.api, 'getEmber', (promise, ...args) => {
            promise.then(hookEmber);
        });
    });
}
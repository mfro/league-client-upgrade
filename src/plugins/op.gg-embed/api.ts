import { Provider } from 'base/plugin';

import * as method from 'base/util/method';

import { API as ComponentsInjector } from 'base/plugins/components-injector';

let inject: ComponentsInjector;

function open(this: any, node: any) {
    let url = `https://na.op.gg/summoner/userName=${this.member.name}`;

    window.open(url);
}

function getContextMenu(this: any, original: Function, ...args: any[]) {
    var value = original(...args);

    value.splice(3, 0, {
        action: open,
        args: [],
        target: this,
        label: 'Open OP.GG Profile',
    });

    return value;
}

export function setup(hook: Provider) {
    inject = hook.getPlugin<ComponentsInjector>('components-injector').api;

    inject.hook('lol-social-roster-member', type => {
        method.replace(type.prototype, 'getContextMenu', getContextMenu);
    });
}
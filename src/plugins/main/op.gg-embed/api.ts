import { Provider } from 'zhonya';

import * as method from 'zhonya/util/method';

import componentsInjector from 'zhonya/plugins/lib/components-injector';

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
    componentsInjector.api.hook('lol-social-roster-member', type => {
        method.replace(type.prototype, 'getContextMenu', getContextMenu);
    });
}
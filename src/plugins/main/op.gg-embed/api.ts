import { Provider } from '@';

import * as method from '@/util/method';

import componentsInjector from '@/plugins/lib/components-injector';

function open(this: any, node: any) {
    let url = `https://na.op.gg/summoner/userName=${this.member.name}`;

    window.open(url);
}

function getContextMenu(this: any, original: Function) {
    var value = original(...arguments);

    value.splice(3, 0, {
        action: open,
        args: [],
        target: this,
        label: 'Open OP.GG Profile',
    });

    return value;
}

export function setup(hook: Provider) {
    componentsInjector.api.hookPrototype('lol-social-roster-member', ctor => {
        method.replace(ctor.prototype, 'getContextMenu', getContextMenu);
    });
}
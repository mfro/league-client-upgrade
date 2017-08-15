import { Provider } from 'zhonya';
import * as Logging from 'zhonya/logging';

import componentsInjector from 'zhonya/plugins/lib/components-injector';

import Observe from 'zhonya/plugins/lib/observe';
import * as CommonLibs from 'rcp-fe-common-libs/v1';
import * as Chat from 'rcp-be-lol-chat/v1';

import style from './style.less';

let chat: CommonLibs.Binding;

function onMe(me: Chat.User) {
    if (!me || !me.lol) return;
    if (me.lol.aceData == 'v1') return;

    me.lol.aceData = 'v1';

    chat.put('/me', me);
}

export function setup(hook: Provider) {
    style();

    Observe.api.bind('/lol-chat/v1').then(c => {
        chat = c;
        chat.observe('/me', onMe);
    });

    componentsInjector.api.hookMixin('lol-social-roster-member', hookRosterMember);
}

function hookRosterMember(mixins: any[]) {
    return {
        created(this: HTMLElement & { onSync: Function, watch: Function, member: any }) {
            this.watch('member.lol.aceData', (aceData: any) => {
                if (!this.member) return;
                Logging.log('aceData', this.member.name, aceData);

                this.classList.toggle('_mfro_has-ace', aceData == 'v1');
            });
        },
    };
}
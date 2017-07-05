import { Provider } from 'zhonya';
import * as Logging from 'zhonya/logging';
import * as method from 'zhonya/util/method';

import Ember from 'rcp-fe-ember-libs/v1';
import * as Login from 'rcp-be-lol-login/v1';

import emberInjector from 'zhonya/plugins/ember-injector';

import style from './style.less';

import Root from './root';
import * as saved from './saved';

let styleNode: HTMLStyleElement;

declare type LoginComponent = Ember.Component<{
    session: Login.Session,
    password: string
}>;

function Mixin(Ember: Ember) {
    return {
        zhonya_sessionObserver: Ember.observer('session.state', function (this: LoginComponent) {
            let session = this.get('session');

            if (!session || session.state != 'SUCCEEDED')
                return;

            saved.patch({
                username: session.username,
                password: this.get('password'),
            });
        }),

        init(this: Ember.Component<any>) {
            this._super();

            method.before(this.actions, 'login', (...args) => {
                Logging.log(...args);
            });
        },

        didRender(this: LoginComponent) {
            this._super();

            let lower = this.$('.login-body-lower-section').get(0);
            let parent = lower.parentElement!;
            let node = this.$('[data-login-save-root]').get(0);

            if (node) return;

            node = document.createElement('span');
            parent.insertBefore(node, lower);

            let vue = new Root({ data: () => ({ styleNode }) });
            vue.$mount(node);
        }
    };
}

export function setup(hook: Provider) {
    hook.preInit('rcp-fe-lol-login', () => {
        emberInjector.api.hook('login-component', Mixin);
    });

    styleNode = style();
    saved.start();
}
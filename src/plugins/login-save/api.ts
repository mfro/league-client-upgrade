import { Provider } from 'zhonya';
// import * as Logging from 'zhonya/logging';
import * as method from 'zhonya/util/method';

import Ember from 'rcp-fe-ember-libs/v1';
import { LoginComponent } from 'rcp-fe-lol-login/v1';

import emberInjector from 'zhonya/plugins/ember-injector';

import Root from './root';
import * as saved from './saved';

function Mixin(Ember: Ember) {
    const map = new Map<LoginComponent, { root: Root, didManual: boolean }>();

    return {
        zhonya_sessionObserver: Ember.observer('session.state', function (this: LoginComponent) {
            let session = this.get('session');
            let data = map.get(this)!;

            if (!session) return;

            switch (session.state) {
                case 'IN_PROGRESS':
                    break;

                case 'SUCCEEDED':
                    if (!data.didManual) break;

                    saved.patch({
                        username: session.username,
                        password: this.get('password'),
                    });
                    break;

                default:
                    data.didManual = false;
                    break;
            }
        }),

        init(this: LoginComponent) {
            this._super();

            let root = new Root();
            map.set(this, {
                root,
                didManual: false
            });

            method.before(this.actions, 'login', (...args) => {
                map.get(this)!.didManual = true;
            });
        },

        didRender(this: LoginComponent) {
            this._super();

            let data = map.get(this);
            if (!data) return;
            if (data.root.$el && data.root.$el.parentNode) return;

            let lower = this.$('.login-body-lower-section').get(0);
            if (!lower || !lower.parentNode) return;

            let tmp = document.createElement('span');
            lower.parentNode.insertBefore(tmp, lower);

            data.root.$mount(tmp);
        }
    };
}

export function setup(hook: Provider) {
    hook.preInit('rcp-fe-lol-login', () => {
        emberInjector.api.hook('login-component', Mixin);
    });

    saved.start();
}
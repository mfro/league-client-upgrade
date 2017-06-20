import { Provider } from 'base/plugin';
// import * as Logging from 'base/logging';

import Ember from 'rcp-fe-ember-libs/v1';

import emberInjector from 'base/plugins/ember-injector';

import * as style from './style.less';

function Mixin(Ember: Ember) {
    return {
        init(this: Ember.Component<{}>) {
            this._super();

            Ember.run.scheduleOnce('afterRender', this, () => {
                let div = document.createElement('div');
                div.innerText = 'Modifications applied';
                div.className = 'mfro-version-info';

                let target = this.$('.login-body-lower-section .login-external-links')[0];
                target.insertBefore(div, target.firstChild);
            });
        }
    }
}

export function setup(hook: Provider) {
    hook.preInit('rcp-fe-lol-login', () => {
        emberInjector.api.hook('login-component', Mixin);
    });

    style();
}
import { Provider } from 'base/plugin';
// import * as Logging from 'base/logging';

import Ember from 'rcp-fe-ember-libs/v1';
import { API as EmberInjector } from 'base/plugins/ember-injector';

function Mixin(Ember: Ember) {
    return {
        init(this: Ember.Component<{}>) {
            this._super();

            Ember.run.scheduleOnce('afterRender', this, () => {
                let div = document.createElement('div');
                div.innerText = 'Modifications applied';
                div.style.paddingTop = '8px';

                let target = this.$('.login-body-lower-section')[0];
                target.appendChild(div);
            });
        }
    }
}

export function setup(hook: Provider) {
    let ember = hook.getPlugin<EmberInjector>('ember-injector');

    hook.preInit('rcp-fe-lol-login', () => {
        ember.api.hook('login-component', Mixin);
    });
}
import { Provider } from 'zhonya';
// import * as Logging from 'zhonya/logging';

import Ember from 'rcp-fe-ember-libs/v1';

import l10nInjector from 'zhonya/plugins/l10n-injector';

import IconsTab from './icons-tab';
import Vue from 'vue';

const l10n_key = 'zhonya-owned-icon-tab';

function create(Ember: Ember, uikit: any) {
    return Ember.Component.extend({
        didRender(this: Ember.Component<{}>) {
            this._super(...arguments);

            let vue = new Vue({
                mixins: [IconsTab],
                data() {
                    return { uikit };
                }
            });

            vue.$mount(this.element);
        }
    });
}

export function setup(hook: Provider) {
    l10nInjector.api.add(l10n_key, 'ICONS');

    hook.getRiotPluginApi('rcp-fe-ember-libs').then(api => {
        return api.getEmber('2.12.0');
    }).then(Ember => {
        hook.getRiotPluginApi(
            'rcp-fe-lol-uikit',
            'rcp-fe-lol-collections',
        ).then(([uikit, collections]) => {
            collections.registerSubSection({
                name: 'icons',
                locKey: l10n_key,
                jmxEnabledKey: "LCUChampionGridEnabled",
                componentFactoryName: 'IconsRootComponent',
                componentFactoryDef: {
                    name: 'IconsRootComponent',
                    IconsRootComponent: create(Ember, uikit)
                },
                priority: 150
            })
        });
    });
}
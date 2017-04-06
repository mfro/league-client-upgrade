import { Provider } from 'base/plugin';
// import * as Logging from 'base/logging';

import Ember from 'rcp-fe-ember-libs/v1';
import { API as L10nInjector } from 'base/plugins/l10n-injector';

import SkinsTab from './skins-tab';
import Vue from 'vue';

const l10n_key = 'zhonya-owned-skins-tab';

function create(Ember: Ember, championDetails: any, uikit: any) {
    return Ember.Component.extend({
        didRender(this: Ember.Component<{}>) {
            this._super(...arguments);

            let vue = new Vue({
                mixins: [SkinsTab],
                data() {
                    return { uikit, championDetails };
                }
            });

            vue.$mount(this.element);
        }
    });
}

export function setup(hook: Provider) {
    let l10n = hook.getPlugin<L10nInjector>('l10n-injector');
    l10n.api.add(l10n_key, 'SKINS');

    hook.getRiotPluginApi('rcp-fe-ember-libs').then(api => {
        return api.getEmber('2.12.0');
    }).then(Ember => {
        hook.getRiotPluginApi(
            'rcp-fe-lol-uikit',
            'rcp-fe-lol-collections',
            'rcp-fe-lol-champion-details',
        ).then(([uikit, collections, champions]) => {
            collections.registerSubSection({
                name: 'skins',
                locKey: l10n_key,
                jmxEnabledKey: "LCUChampionGridEnabled",
                componentFactoryName: 'SkinsRootComponent',
                componentFactoryDef: {
                    name: 'SkinsRootComponent',
                    SkinsRootComponent: create(Ember, champions, uikit)
                },
                priority: 150
            })
        });
    });
}
import { Provider } from '@';
// import * as Logging from '@/logging';

import Ember from 'rcp-fe-ember-libs/v1';

import l10nInjector from '@/plugins/lib/l10n-injector';

import SkinsTab from './skins-tab';

const l10n_key = 'zhonya-owned-skins-tab';

function create(Ember: Ember) {
    return Ember.Component.extend({
        didRender(this: Ember.Component<{}>) {
            this._super(...arguments);

            let vue = new SkinsTab();
            vue.$mount(this.element);
        }
    });
}

export function setup(hook: Provider) {
    l10nInjector.api.add(l10n_key, 'SKINS');

    let collections: any;
    hook.getRiotPluginApi(
        'rcp-fe-ember-libs',
        'rcp-fe-lol-collections',
    ).then(([emberLibs, c]) => {
        collections = c;
        return emberLibs.getEmber('2.12.0');
    }).then(Ember => {
        collections.registerSubSection({
            name: 'skins',
            locKey: l10n_key,
            jmxEnabledKey: "LCUChampionGridEnabled",
            componentFactoryName: 'SkinsRootComponent',
            componentFactoryDef: {
                name: 'SkinsRootComponent',
                SkinsRootComponent: create(Ember)
            },
            priority: 150
        })
    });
}
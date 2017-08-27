import { Provider } from '@';
// import * as Logging from '@/logging';

import Ember from 'rcp-fe-ember-libs/v1';

import l10nInjector from '@/plugins/lib/l10n-injector';

import IconsTab from './icons-tab';

const l10n_key = 'zhonya-owned-icon-tab';

function create(Ember: Ember) {
    return Ember.Component.extend({
        didRender(this: Ember.Component<{}>) {
            this._super(...arguments);

            let tab = new IconsTab();
            tab.$mount(this.element);
        }
    });
}

export function setup(hook: Provider) {
    l10nInjector.api.add(l10n_key, 'ICONS');

    let collections: any;
    hook.getRiotPluginApi(
        'rcp-fe-ember-libs',
        'rcp-fe-lol-collections',
    ).then(([emberLibs, c]) => {
        collections = c;
        return emberLibs.getEmber('2.12.0');
    }).then(Ember => {
        collections.registerSubSection({
            name: 'icons',
            locKey: l10n_key,
            jmxEnabledKey: "LCUChampionGridEnabled",
            componentFactoryName: 'IconsRootComponent',
            componentFactoryDef: {
                name: 'IconsRootComponent',
                IconsRootComponent: create(Ember)
            },
            priority: 160
        })
    });
}
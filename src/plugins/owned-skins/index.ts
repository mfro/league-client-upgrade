import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
}

export default <PluginDeclaration<{}>>{
    name: 'owned-skins',
    version: '1.0.0',
    description: 'Adds a tab to the collection page that displays all of your owned skins',

    riotDependencies: {
        'rcp-fe-lol-uikit': '0.x',
        'rcp-fe-ember-libs': '0.x',
        
        'rcp-fe-lol-collections': '1.x',
        'rcp-fe-lol-champion-details': '0.x',
    },

    dependencies: {
        'l10n-injector': '1.x',
    },

    api: api
};
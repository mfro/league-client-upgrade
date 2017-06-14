import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

import './tooltip';

export default <PluginDeclaration<{}>>{
    name: 'champselect-summoner-info',
    version: '1.0.0',
    description: 'Displays summoner ranked stats and other info for team mates in champ select',

    riotDependencies: {
        'rcp-fe-lol-champ-select': '1.0.906',
        'rcp-fe-lol-leagues': '0.0.341',
        'rcp-fe-lol-uikit': '0.x',

        'rcp-be-lol-summoner': '2.x',
        'rcp-be-lol-leagues': '1.x'
    },

    dependencies: {
        'ember-injector': '1.x'
    },

    api: api
};
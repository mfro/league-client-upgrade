import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export default <PluginDeclaration<{}>>{
    name: 'champselect-prettier',
    version: '1.0.0',
    disabled: true,
    description: 'Tweaks champ select to look a bit better',

    riotDependencies: {
        'rcp-fe-lol-champ-select': '1.0.562',
    },

    dependencies: {
        'ember-injector': '1.x'
    },

    api: api
};
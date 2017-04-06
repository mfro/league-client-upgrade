import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export default <PluginDeclaration<{}>>{
    name: 'version-info',
    version: '1.0.0',
    description: 'Adds zhonya version to the login page',

    riotDependencies: {
        'rcp-fe-lol-login': '0.0.358'
    },

    dependencies: {
        'ember-injector': '1.x'
    },

    api: api
};
import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
}

export default <PluginDeclaration<API>>{
    name: 'op.gg-embed',
    version: '1.0.0',
    description: 'Adds op.gg links to parts of the client',

    riotDependencies: {
        'rcp-fe-lol-social': '1.1.30',
    },

    dependencies: {
        'components-injector': '1.x',
    },

    api: api
};

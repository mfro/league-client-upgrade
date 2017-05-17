import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
    add: (key: string, value: string) => void;
}

export default <PluginDeclaration<API>>{
    name: 'l10n-injector',
    version: '1.0.0',
    description: 'Utility plugin for adding strings to the league client for custom UI components',

    riotDependencies: {
        'rcp-fe-l10n': '0.0.561'
    },

    api: api
}
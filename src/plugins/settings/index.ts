import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
    addBoolean(key: string, label: string, def: boolean): void;
    addBoolean(category: string, key: string, label: string, def: boolean): void;

    // addCategory(name: string, label: string): void;
    // addCategory(name: string, label: string, after: string): void;
}

export default <PluginDeclaration<API>>{
    name: 'settings',
    version: '1.0.0',
    description: 'Adds zhonya settings to the league client settings page',
    
    riotDependencies: {
        'rcp-fe-settings': '0.0.173'
    },

    dependencies: {
        'l10n-injector': '1.x'
    },

    api: api
};
import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
    hook(name: string, callback: (type: any) => any): void;
}

export default <PluginDeclaration<API>>{
    name: 'components-injector',
    version: '1.0.0',
    description: 'Utility plugin for modifying web components on the league client',

    riotDependencies: {
        'rcp-fe-components-js-libs': '0.0.17',
    },

    api: api
};

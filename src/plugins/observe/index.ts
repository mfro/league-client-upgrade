import { PluginDeclaration } from 'base/plugin';

import * as CommonLibs from 'rcp-fe-common-libs/v1';

import * as api from './api';

export interface API {
    bind(endpoint: string): Promise<CommonLibs.Binding>;
}

export default <PluginDeclaration<API>>{
    name: 'observe',
    version: '1.0.0',
    description: 'Exposes an API for listening to changes in the riot backend api',

    riotDependencies: {
        'rcp-fe-common-libs': '1.x'
    },

    api: api
};

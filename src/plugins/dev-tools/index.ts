import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
}

export default <PluginDeclaration<API>>{
    name: 'dev-tools',
    version: '1.0.0',
    description: 'Opens and displays the dev tools',

    disabled: true,
    api: api
};
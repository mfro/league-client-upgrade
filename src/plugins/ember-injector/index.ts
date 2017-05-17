import { PluginDeclaration } from 'base/plugin';

import Ember from 'rcp-fe-ember-libs/v1';

import * as api from './api';

export interface API {
    hook(classname: string, callback: (ember: Ember) => any): void;
}

export default <PluginDeclaration<API>>{
    name: 'ember-injector',
    version: '1.0.0',
    description: 'Utility plugin for modifying ember components on the league client',

    riotDependencies: {
        'rcp-fe-ember-libs': '0.0.66',
    },

    api: api
};
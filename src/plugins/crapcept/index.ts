import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export default <PluginDeclaration<{}>>{
    name: 'crapcept',
    version: '1.0.0',
    description: 'Automatically accept ready checks',
    
    riotDependencies: {
        'rcp-be-lol-matchmaking': '1.x'
    },
    
    dependencies: {
        'settings': '1.x',
        'observe': '1.x'
    },

    api: api
};
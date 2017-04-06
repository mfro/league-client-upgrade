import { PluginDeclaration } from 'base/plugin';

import * as api from './api';

export interface API {
}

export default <PluginDeclaration<API>>{
    name: 'game-in-progress',
    version: '1.0.0',
    disabled: true,
    description: 'Display stats for all members of a game, replacing the default "Game is still in progress..." screen',

    riotDependencies: {
        'rcp-fe-lol-game-in-progress': '0.0.53'
    },

    dependencies: {
        'observe': '1.x',
    },

    api: api
}
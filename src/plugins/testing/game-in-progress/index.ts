import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'game-in-progress',
    description: 'Display stats for all members of a game, replacing the default "Game is still in progress..." screen',

    riotDependencies: {
        'rcp-fe-lol-game-in-progress': '0.0.77'
    },

    dependencies: [
        'observe',
    ],

    api: api
});
import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'ultimate-bravery',
    description: 'Adds Ultimate Bravery to the client',

    riotDependencies: {
        'rcp-be-lol-chat': '1.x',
        'rcp-be-lol-login': '1.x',
        'rcp-be-lol-gameflow': '1.x',
        'rcp-be-lol-game-data': '1.x',
        'rcp-be-lol-item-sets': '1.x',
        'rcp-be-lol-collections': '1.x',
        'rcp-be-lol-champ-select': '1.x',
    },

    dependencies: [
        'observe'
    ],

    api: api
});
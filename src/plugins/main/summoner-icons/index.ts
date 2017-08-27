import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'summoner-icons',
    description: 'Adds a tab to the collection page that displays all of your owned skins',

    riotDependencies: {
        'rcp-fe-lol-uikit': '0.x',
        'rcp-fe-ember-libs': '0.x',
        
        'rcp-fe-lol-collections': '1.x',

        'rcp-be-lol-collections': '1.x',
    },

    dependencies: [
        'l10n-injector',
    ],

    api: api
});
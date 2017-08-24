import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'owned-skins',
    description: 'Adds a tab to the collection page that displays all of your owned skins',

    riotDependencies: {
        'rcp-fe-lol-uikit': '0.x',
        'rcp-fe-ember-libs': '0.x',
        
        'rcp-fe-lol-collections': '1.x',
        'rcp-fe-lol-champion-details': '0.x',

        'rcp-be-lol-collections': '1.x',
        'rcp-be-lol-champions': '1.x',
        'rcp-be-lol-login': '1.x'
    },

    dependencies: [
        'l10n-injector',
    ],

    api: api
});
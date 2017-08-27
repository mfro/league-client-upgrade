import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'prettier-champselect',
    description: 'Tweaks champ select to look a bit better',

    riotDependencies: {
        'rcp-fe-lol-champ-select': '1.0.954',
    },

    dependencies: [
        'ember-injector',
    ],

    api: api
});
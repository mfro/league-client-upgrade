import * as Zhonya from 'base/main';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'champselect-prettier',
    disabled: true,
    description: 'Tweaks champ select to look a bit better',

    riotDependencies: {
        'rcp-fe-lol-champ-select': '1.0.562',
    },

    dependencies: [
        'ember-injector',
    ],

    api: api
});
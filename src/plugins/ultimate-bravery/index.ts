import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'ultimate-bravery',
    description: 'Adds Ultimate Bravery to the client',

    riotDependencies: {
        'rcp-be-lol-chat': '1.2.171'
    },

    dependencies: [
        'observe'
    ],

    api: api
});
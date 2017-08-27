import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'crapcept',
    description: 'Automatically accept ready checks',
    
    riotDependencies: {
        'rcp-be-lol-matchmaking': '1.x'
    },
    
    dependencies: [
        'settings',
        'observe'
    ],

    api: api
});
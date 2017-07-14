import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
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
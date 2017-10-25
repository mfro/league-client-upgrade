import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'settings',
    description: 'Adds zhonya settings to the league client settings page',
    
    riotDependencies: {
        'rcp-fe-lol-settings': '0.0.183'
    },

    api: api
});
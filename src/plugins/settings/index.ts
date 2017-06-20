import * as Zhonya from 'base/main';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'settings',
    description: 'Adds zhonya settings to the league client settings page',
    
    riotDependencies: {
        'rcp-fe-lol-settings': '0.0.179'
    },

    api: api
});
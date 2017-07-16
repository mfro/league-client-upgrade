import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'ace-identifier',
    description: 'Identifies other users of ACE',

    riotDependencies: {
        'rcp-be-lol-chat': '1.x',
        'rcp-fe-lol-social': '1.1.50'
    },
    
    dependencies: [
        'observe',
    ],

    api: api
});
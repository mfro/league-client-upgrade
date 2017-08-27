import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'ace-identifier',
    description: 'Identifies other users of ACE',

    riotDependencies: {
        'rcp-be-lol-chat': '1.x',
        'rcp-fe-lol-social': '1.1.131'
    },
    
    dependencies: [
        'observe',
    ],

    api: api
});
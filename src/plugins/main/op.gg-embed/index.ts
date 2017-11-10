import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'op.gg-embed',
    description: 'Adds op.gg links to parts of the client',

    riotDependencies: {
        'rcp-fe-lol-social': '1.1.177',
    },

    dependencies: [
        'components-injector',
    ],

    api: api
});

import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'op.gg-embed',
    description: 'Adds op.gg links to parts of the client',

    riotDependencies: {
        'rcp-fe-lol-social': '1.3.36',
    },

    dependencies: [
        'components-injector',
    ],

    api: api
});

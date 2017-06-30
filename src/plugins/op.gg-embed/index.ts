import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'op.gg-embed',
    description: 'Adds op.gg links to parts of the client',

    riotDependencies: {
        'rcp-fe-lol-social': '1.1.43',
    },

    dependencies: [
        'components-injector',
    ],

    api: api
});

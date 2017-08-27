import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'observe',
    description: 'Exposes an API for listening to changes in the riot backend api',

    riotDependencies: {
        'rcp-fe-common-libs': '1.x'
    },

    api: api
});

import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'observe',
    description: 'Exposes an API for listening to changes in the riot backend api',

    riotDependencies: {
        'rcp-fe-common-libs': '1.x'
    },

    api: api
});

import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'components-injector',
    description: 'Utility plugin for modifying web components on the league client',

    riotDependencies: {
        'rcp-fe-components-js-libs': '0.0.17',
    },

    api: api
});

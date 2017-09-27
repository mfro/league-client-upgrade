import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'version-info',
    description: 'Adds zhonya version to the login page',

    riotDependencies: {
        'rcp-fe-lol-login': '0.0.463'
    },

    dependencies: [
        'ember-injector',
    ],

    api: api
});
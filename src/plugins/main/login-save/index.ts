import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'login-save',
    description: 'Adds saved logins to the league client',

    riotDependencies: {
        'rcp-fe-lol-login': '0.0.478',
    },

    dependencies: [
        'ember-injector'
    ],

    api: api
});

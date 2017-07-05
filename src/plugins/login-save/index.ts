import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'login-save',
    description: 'Adds saved logins to the league client',

    riotDependencies: {
        'rcp-fe-lol-login': '0.0.419',
    },

    dependencies: [
        'ember-injector'
    ],

    api: api
});

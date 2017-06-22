import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'version-info',
    description: 'Adds zhonya version to the login page',

    riotDependencies: {
        'rcp-fe-lol-login': '0.0.416'
    },

    dependencies: [
        'ember-injector',
    ],

    api: api
});
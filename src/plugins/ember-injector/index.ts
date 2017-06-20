import * as Zhonya from 'base/main';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'ember-injector',
    description: 'Utility plugin for modifying ember components on the league client',

    riotDependencies: {
        'rcp-fe-ember-libs': '0.0.71',
    },

    api: api
});
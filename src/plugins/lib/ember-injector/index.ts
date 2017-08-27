import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'ember-injector',
    description: 'Utility plugin for modifying ember components on the league client',

    riotDependencies: {
        'rcp-fe-ember-libs': '0.0.75',
    },

    api: api
});
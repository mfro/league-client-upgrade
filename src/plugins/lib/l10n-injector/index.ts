import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'l10n-injector',
    description: 'Utility plugin for adding strings to the league client for custom UI components',

    riotDependencies: {
        'rcp-fe-l10n': '0.0.628',
        'rcp-fe-lol-l10n': '0.0.637',
    },

    api: api
});
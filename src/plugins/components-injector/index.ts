import * as Zhonya from 'base/main';

import * as api from './api';

export interface API {
    hook(name: string, callback: (type: any) => any): void;
}

export default Zhonya.addPlugin({
    name: 'components-injector',
    description: 'Utility plugin for modifying web components on the league client',

    riotDependencies: {
        'rcp-fe-components-js-libs': '0.0.17',
    },

    api: api
});

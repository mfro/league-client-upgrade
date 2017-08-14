import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'test-login',
    description: 'Testing with dependencies',

    dependencies: [
        'observe',
        'test-central',
    ],

    api: api
});

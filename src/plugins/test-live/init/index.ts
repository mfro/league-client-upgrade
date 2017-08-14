import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'test-init',
    description: 'Basic debug info',

    api: api
});

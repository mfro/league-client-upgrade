import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'dev-tools',
    description: 'Opens and displays the dev tools',

    api: api
});
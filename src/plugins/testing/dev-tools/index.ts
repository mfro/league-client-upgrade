import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'dev-tools',
    description: 'Opens and displays the dev tools',

    api: api
});
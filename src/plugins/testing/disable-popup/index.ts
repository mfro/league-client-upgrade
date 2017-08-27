import { addPlugin } from '@';

import * as api from './api';

export default addPlugin({
    name: 'disable-popup',
    description: 'Disables the annoying focus-grabbing popup that the client does for queue pops and stuff',

    api: api
});
import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'disable-popup',
    description: 'Disables the annoying focus-grabbing popup that the client does for queue pops and stuff',

    api: api
});
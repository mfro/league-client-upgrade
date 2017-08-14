import Raven from 'raven-js';

import { Provider } from 'zhonya';

interface User {
    id?: string;
    username?: string;
}

const user: User = {};

export function patchUser(arg: User) {
    Object.assign(user, arg);

    Raven.setUserContext(user);
}

export function setup(hook: Provider) {
}
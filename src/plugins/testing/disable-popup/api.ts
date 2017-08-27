import { Provider } from '@';
// import * as Logging from '@/logging';

import * as method from '@/util/method';

export function setup(hook: Provider) {
    let desc = Object.getOwnPropertyDescriptor(window, 'riotInvoke');
    if (!desc.writable) return;
    
    method.replace(window, 'riotInvoke', (original, ...args: any[]) => {
        // Logging.log(args[0]);

        return original(...args);
    });
}
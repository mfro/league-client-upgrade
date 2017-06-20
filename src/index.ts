import * as Zhonya from './main';
import * as Logging from './logging';

import * as method from './util/method';

declare const require: any;

const context = require.context('./plugins', true, /index.ts$/i);
context.keys().forEach(context);

Logging.log(`injected into ${location.href} (${location.hostname})`);

if (location.hostname == '127.0.0.1') {
    Zhonya.start();

    let opened: Window[] = [];
    window.addEventListener('beforeunload', e => {
        for (let win of opened) {
            if (win.location.href == 'about:blank')
                win.close();
        }
        opened.splice(0);
    });

    method.after(window, 'open', (win: Window, ...args) => {
        Logging.log('window.open', ...args);
        opened.push(win);
    });
}

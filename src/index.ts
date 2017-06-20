import * as Zhonya from './main';
import * as Logging from './logging';

import * as method from './util/method';

import allPlugins from './plugins';

Logging.log(`injected into ${location.href} (${location.hostname})`);

if (location.hostname == '127.0.0.1') {
    allPlugins.forEach(Zhonya.install);

    (<any>window).Zhonya = Zhonya;
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
import * as Zhonya from 'zhonya';
import * as Logging from 'zhonya/logging';

import * as method from 'zhonya/util/method';
import * as plugins from 'zhonya/plugins';

import * as pack from 'zhonya/../package.json';
import Raven from 'raven-js';

Raven.config('https://ad73264cff4b4f698be52bbe552c5170@sentry.io/184631');
Raven.install();

Raven.setRelease(pack.version);

Logging.log(`injected into ${location.href} (${location.hostname})`);

if (Zhonya.isDisabled)
    Logging.log('disabling...');

else {
    plugins.load();

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
        if (!win) return;
        Logging.log('window.open', ...args);
        opened.push(win);
    });
}

window.addEventListener('keydown', e => {
    if (e.keyCode != 116)
        return;

    if (Zhonya.isDisabled)
        localStorage.removeItem('ace-disable');
    else
        localStorage.setItem('ace-disable', 'true');

    location.reload();
});

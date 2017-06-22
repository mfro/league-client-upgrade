import * as Zhonya from './main';
import * as Logging from './logging';

import * as method from 'utility/method';

declare const require: any;

Logging.log(`injected into ${location.href} (${location.hostname})`);

if (Zhonya.isDisabled)
    Logging.log('disabling...');

else if (location.hostname == '127.0.0.1') {
    const context = require.context('./plugins', true, /\.\/[^\/]+\/index\.ts$/i);
    context.keys().forEach(context);

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

window.addEventListener('keydown', e => {
    if (e.keyCode != 116)
        return;

    if (Zhonya.isDisabled)
        localStorage.removeItem('ace-disable');
    else
        localStorage.setItem('ace-disable', 'true');

    location.reload();
});

import Raven from 'raven-js';

import * as Logging from 'zhonya/logging';

declare function require(path: string): any;
declare namespace require {
    function context(path: string, subDirectories?: boolean, regex?: RegExp): Context;

    interface Context {
        (path: string): any;
        keys(): string[];
    }
}

export function load() {
    const context = require.context('./main', true, /\.\/[^\/]+\/index\.ts$/i);

    for (let key of context.keys()) {
        try {
            context(key);
        } catch (x) {
            Raven.captureException(x, { level: 'warning' });
            Logging.error("Error while loading: " + key, x);
        }
    }

    const test = require.context('./test-live', true, /\.\/[^\/]+\/index\.ts$/i);

    for (let key of test.keys()) {
        try {
            test(key);
        } catch (x) {
            Raven.captureException(x, { level: 'warning' });
            Logging.error("Error while loading: " + key, x);
        }
    }
}
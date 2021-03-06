import * as Logging from '@/logging';

declare function require(path: string): any;
declare namespace require {
    function context(path: string, subDirectories?: boolean, regex?: RegExp): Context;

    interface Context {
        (path: string): any;
        keys(): string[];
    }
}

/** Loads all plugin modules through webpack */
export function load() {
    const context = require.context('./main', true, /\.\/[^\/]+\/index\.ts$/i);

    for (let key of context.keys()) {
        try {
            context(key);
        } catch (x) {
            Logging.error("Error while loading: " + key, x);
        }
    }
}
import { Provider, RiotPlugin } from 'base/plugin';
// import * as Logging from 'base/logging';

import * as method from 'base/util/method';

const injections = new Map<string, string>();

export function setup(hook: Provider) {
    hook.postInit('rcp-fe-l10n', inject);

    hook.postInit('rcp-fe-lol-l10n', inject);
}

export function add(key: string, value: string) {
    injections.set(key, value);
}

function inject(plugin: RiotPlugin) {
    let tra = plugin.api.tra();

    method.replace(tra, 'get', (original, key) => {
        let value = injections.get(key);

        return value || original(key);
    });
}

import { Provider } from 'base/plugin';
import * as Logging from 'base/logging';

import * as Matchmaking from 'rcp-be-lol-matchmaking/v1';
import * as CommonLibs from 'rcp-fe-common-libs/v1';
import { API as Settings } from 'base/plugins/settings';
import { API as Observe } from 'base/plugins/observe';

let settings: Settings;
let matchmaking: CommonLibs.Binding;

function onReadyCheck(check: Matchmaking.ReadyCheck) {
    if (!check || check.playerResponse != 'None') return;

    matchmaking.post('/ready-check/accept');
    Logging.log('accept ready-check', check);
}

export function setup(hook: Provider) {
    settings = hook.getPlugin<Settings>('settings').api;

    settings.addBoolean('crapcept', 'Automatically Accept Ready Check', false);

    let observe = hook.getPlugin<Observe>('observe').api;

    observe.bind('/lol-matchmaking/v1').then(binding => {
        matchmaking = binding;
        matchmaking.observe('/ready-check', onReadyCheck);
    });
}
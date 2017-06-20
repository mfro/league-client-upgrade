import { Provider } from 'base/plugin';
import * as Logging from 'base/logging';

import * as Matchmaking from 'rcp-be-lol-matchmaking/v1';
import * as CommonLibs from 'rcp-fe-common-libs/v1';

import settings from 'base/plugins/settings';
import observe from 'base/plugins/observe';

let matchmaking: CommonLibs.Binding;

function onReadyCheck(check: Matchmaking.ReadyCheck) {
    if (!check || check.playerResponse != 'None') return;

    matchmaking.post('/ready-check/accept');
    Logging.log('accept ready-check', check);
}

export function setup(hook: Provider) {
    settings.api.addBoolean('crapcept', 'Automatically Accept Ready Check', false);

    observe.api.bind('/lol-matchmaking/v1').then(binding => {
        matchmaking = binding;
        matchmaking.observe('/ready-check', onReadyCheck);
    });
}
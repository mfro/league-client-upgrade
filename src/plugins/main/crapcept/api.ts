import { Provider } from '@';
import * as Logging from '@/logging';

import * as Matchmaking from 'rcp-be-lol-matchmaking/v1';
import * as CommonLibs from 'rcp-fe-common-libs/v1';

import settings from '@/plugins/lib/settings';
import observe from '@/plugins/lib/observe';

let matchmaking: CommonLibs.Binding;

function onReadyCheck(check: Matchmaking.ReadyCheck) {
    if (!check || check.playerResponse != 'None') return;
    if (check.state == 'Error') return;

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
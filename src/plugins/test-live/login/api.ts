import Raven from 'raven-js';

import { Provider } from 'zhonya';

import Observe from 'zhonya/plugins/lib/observe';
import { Summoner } from 'rcp-be-lol-summoner/v1';

import central from 'zhonya/plugins/test-live/central';

export function setup(hook: Provider) {
    Observe.api.bind('/lol-summoner/v1').then(binding => {
        binding.observe<Summoner>('/current-summoner', summoner => {
            if (!summoner || !summoner.displayName) return;

            central.api.patchUser({
                username: summoner.displayName,
            });
    
            const msg = `Login as ${summoner.displayName} (${summoner.puuid})`;
            Raven.captureMessage(msg, {
                level: 'info',
                extra: {
                    fullSummoner: summoner
                }
            })
        });
    });
}
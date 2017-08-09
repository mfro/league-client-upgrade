import { Provider } from 'zhonya';
// import * as Logging from 'zhonya/logging';

import Ember from 'rcp-fe-ember-libs/v1';
import { ChampSelectComponent, Summoner } from 'rcp-fe-lol-champ-select/v1';

import emberInjector from 'zhonya/plugins/lib/ember-injector';

import style from './style.less';

function prettier(this: ChampSelectComponent, member: Summoner, enemy: boolean, Ember: Ember) {
    const team = enemy ? '.enemy-party' : '.your-party';
    const node = this.$(team + ' .lines .summoner-wrapper').eq(member.get('summonerIndex'));

    let champId = member.championId;
    const skinId = member.selectedSkinId;
    if (skinId) {
        node.css('background-image', `url(/lol-game-data/assets/v1/champion-splashes/${champId}/${skinId}.jpg)`);
    } else if (champId = member.championPickIntent) {
        node.css('background-image', `url(/lol-game-data/assets/v1/champion-splashes/${champId}/${champId}000.jpg)`);
    } else {
        node.css('background-image', '');
    }
}

function mixin(Ember: Ember) {
    return {
        didRender: function (this: ChampSelectComponent) {
            this._super(...arguments);

            const local = this.get('currentSummoner');

            for (let summoner of this.get('summoners')) {
                prettier.bind(this)(summoner, summoner.team != local.team, Ember);
            }

            for (let member of this.get('session.myTeam') || []) {
                prettier.bind(this)(member, false, Ember);
            }

            for (let member of this.get('session.theirTeam') || []) {
                prettier.bind(this)(member, true, Ember);
            }
        }
    };
}

export function setup(hook: Provider) {
    style();

    hook.preInit('rcp-fe-lol-champ-select', () => {
        emberInjector.api.hook('champion-select', mixin);
    });
}
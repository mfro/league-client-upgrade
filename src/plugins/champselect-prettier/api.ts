import { Provider } from 'zhonya';
// import * as Logging from 'zhonya/logging';

import Ember from 'rcp-fe-ember-libs/v1';
import * as ChampSelect from 'rcp-be-lol-champ-select/v1';
import { ChampSelectComponent } from 'rcp-fe-lol-champ-select/v1';

import emberInjector from 'zhonya/plugins/ember-injector';

import style from './style.less';

function prettier(this: ChampSelectComponent, member: ChampSelect.Cell, enemy: boolean, Ember: Ember) {
    const node = this.$('.lines .summoner-wrapper.visible').eq(member.cellId);

    const champId = member.championId;
    const skinId = member.selectedSkinId;
    
    if (champId) {
        node.css('background-image', `url(/lol-game-data/assets/v1/champion-splashes/${champId}/${skinId}.jpg)`);
    } else {
        node.css('background-image', '');
    }
}

function mixin(Ember: Ember) {
    return {
        didRender: function (this: ChampSelectComponent) {
            this._super(...arguments);

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
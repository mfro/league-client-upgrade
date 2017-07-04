import { Provider } from 'zhonya';
// import * as Logging from 'zhonya/logging';

import Ember from 'rcp-fe-ember-libs/v1';
import * as ChampSelect from 'rcp-be-lol-champ-select/v1';
import { ChampSelectComponent } from 'rcp-fe-lol-champ-select/v1';

import emberInjector from 'zhonya/plugins/ember-injector';

import style from './style.less';

function prettier(this: ChampSelectComponent, member: ChampSelect.Cell, Ember: Ember) {
    // let session = this.get('session');

    const index = member.cellId % 5;
    const node = this.$('.lines .summoner-wrapper').eq(index);

    const champId = member.championId;
    const skinId = member.selectedSkinId;
    
    if (champId) {
        node.css('background-image', `url(/lol-game-data/assets/v1/champion-splashes/${champId}/${skinId}.jpg)`);
    } else {
        node.css('background-image', '');
    }

    // Logging.log(session, member, node);
}

function mixin(Ember: Ember) {
    return {
        didRender: function (this: ChampSelectComponent) {
            this._super(...arguments);

            let team = this.get('session.myTeam');

            for (let member of team || []) {
                prettier.bind(this)(member, Ember);
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
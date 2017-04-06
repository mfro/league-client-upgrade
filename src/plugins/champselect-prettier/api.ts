import { Provider } from 'base/plugin';
import * as Logging from 'base/logging';

import Ember from 'rcp-fe-ember-libs/v1';
import * as ChampSelect from 'rcp-be-lol-champ-select/v1';
import { ChampSelectComponent } from 'rcp-fe-lol-champ-select/v1';
import { API as EmberInjector } from 'base/plugins/ember-injector';

import * as style from './style.less';

function prettier(this: ChampSelectComponent, member: ChampSelect.Member, Ember: Ember) {
    let session = this.get('session');

    const index = member.cellId % 5;
    const node = this.$('.lines .summoner-wrapper').eq(index);

    const id = member.championId;
    if (id) {
        node.css('background-image', `url(/lol-game-data/assets/v1/champion-splashes/${id}/${id}000.jpg)`);
    } else {
        node.css('background-image', '');
    }

    Logging.log(session, member, node);
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
    let ember = hook.getPlugin<EmberInjector>('ember-injector');

    style();
    
    hook.preInit('rcp-fe-lol-champ-select', () => {
        ember.api.hook('champion-select', mixin);
    });
}
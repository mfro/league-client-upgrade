import { Provider } from '@';
// import * as Logging from '@/logging';

import request from '@/util/request';

import Ember from 'rcp-fe-ember-libs/v1';
import * as Summoner from 'rcp-be-lol-summoner/v1';
import * as ChampSelect from 'rcp-be-lol-champ-select/v1';
import { ChampSelectComponent } from 'rcp-fe-lol-champ-select/v1';

import emberInjector from '@/plugins/lib/ember-injector';

import Tooltip from './tooltip';
import Vue from 'vue';

let trans: Promise<any>;
let uikit: any;
let tierNames: any;

function addTooltip(this: ChampSelectComponent, member: ChampSelect.Cell, Ember: Ember) {
    let summoner: Summoner.Summoner;
    let leagues: any[];
    request<[Summoner.Summoner]>(`/lol-summoner/v2/summoners?name=${member.displayName}`).then<any[]>(data => {
        summoner = data[0];
        return request(`/lol-leagues/v1/summoner-leagues/${summoner.summonerId}`);
    }).then(data => {
        leagues = data;
        return <any>trans;
    }).then(trans => {
        let rankings = leagues.map(l => ({
            type: trans['LEAGUES_QUEUE_NAME_' + l.queueType],
            tier: tierNames[l.leagueTier.toLowerCase()],
            rank: l.requesterLeagueRank
        }));

        let tooltip = new Vue({
            mixins: [Tooltip],
            data: {
                name: summoner.displayName,
                level: summoner.summonerLevel,
                rankings: rankings
            }
        });

        const el = this.$(".summoner-wrapper[data-summoner-name='" + member.displayName + "']")[0];
        el.style.pointerEvents = 'auto';

        const render = () => {
            tooltip.$mount();
            return tooltip.$el;
        };

        uikit.getTooltipManager().assign(el, render, {}, {
            targetAnchor: {
                x: "center",
                y: "top"
            },
            tooltipAnchor: {
                x: "center",
                y: "bottom"
            },
            offset: {
                x: -50,
                y: 0
            },
            hideEvent: "mouseleave"
        });
    });
}

function mixin(Ember: Ember) {
    return {
        zhonya_summonerInfoTeamObserver: Ember.observer('session.myTeam.[]', function (this: ChampSelectComponent, ...args: any[]) {
            Ember.run.scheduleOnce('afterRender', this, () => {
                for (let member of this.get('session.myTeam')) {
                    addTooltip.bind(this)(member, Ember);
                }
            });
        })
    };
}

export function setup(hook: Provider) {
    trans = request('/fe/lol-leagues/trans.json');

    hook.preInit('rcp-fe-lol-champ-select', () => {
        emberInjector.api.hook('champion-select', mixin);
    });

    hook.postInit('rcp-fe-lol-uikit', plugin => uikit = plugin.api);
    hook.postInit('rcp-fe-lol-league-tier-names', plugin => plugin.api.getNames().then((t: any) => tierNames = t));
}
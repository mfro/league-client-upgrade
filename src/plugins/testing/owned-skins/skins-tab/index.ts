import Vue from '@mfro/vue-ts';

// import * as Logging from '@/logging';

import request from '@/util/request';

import * as Login from 'rcp-be-lol-login/v1';
import * as GameData from 'rcp-be-lol-game-data/v1';

import * as template from './layout.html';

@Vue.Component({ mixins: [template.mixin] })
export default class SkinsTab extends Vue {
    @Vue.Data
    champions: GameData.Champion[] | null;

    @Vue.Data
    showUnowned = false;

    @Vue.Data
    sort = 'alphabet';

    @Vue.Data
    group = true;

    mastery: GameData.ChampionMastery[];

    get ownedCount() {
        return this.sorted && this.sorted.reduce((a, b) => a + b.skins.filter(s => s.ownership.owned).length - 1, 0);
    }

    get totalCount() {
        return this.champions && this.champions.reduce((a, b) => a + b.skins.length - 1, 0);
    }

    get sorted() {
        if (!this.champions) return null;

        let list = this.champions.filter(champ => {
            if (champ.id < 0)
                return false;

            if (!this.showUnowned && (!(<any>champ).ownership.owned || champ.skins.filter(s => s.ownership.owned).length == 1))
                return false;

            return true;
        });

        return list.sort((a, b) => {
            switch (this.sort) {
                default: return 0;
                case 'alphabet': return alphabet(a, b);
                case 'count': return count(a, b);
                case 'mastery':
                    if (!this.mastery) return 0;
                    const masteryA = this.mastery.find(m => m.championId === a.id);
                    const masteryB = this.mastery.find(m => m.championId === b.id);
                    return mastery(masteryA, masteryB);
            };
        });
    }

    created() {
        // Step 1: Fetch summoner id.
        request<Login.Session>("/lol-login/v1/session").then<[GameData.Champion[], GameData.ChampionMastery[]]>(data => {
            const summonerId = data.summonerId;

            // Step 2: Fetch owned champions and skins, as well as mastery score.
            return Promise.all([
                request(`/lol-champions/v1/inventories/${summonerId}/champions`),
                request(`/lol-collections/v1/inventories/${summonerId}/champion-mastery`)
            ]);
        }).then(([champs, championMasteryData]) => {
            // Store our mastery data for sorting later.
            this.mastery = championMasteryData;
            this.champions = champs;
        });
    }
}

function alphabet(a: GameData.Champion, b: GameData.Champion) {
    return a.name.localeCompare(b.name);
}

function count(a: GameData.Champion, b: GameData.Champion) {
    return b.skins.filter(b => b.ownership.owned).length - a.skins.filter(a => a.ownership.owned).length;
}

function mastery(a: GameData.ChampionMastery | undefined, b: GameData.ChampionMastery | undefined) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    if (b.championLevel != a.championLevel) {
        return b.championLevel - a.championLevel;
    }

    return b.championPoints - a.championPoints;
}
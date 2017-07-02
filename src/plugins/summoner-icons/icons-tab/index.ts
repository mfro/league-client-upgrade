import * as Logging from 'logging';

import request from 'utility/request';

import * as Login from 'rcp-be-lol-login/v1';
import * as GameData from 'rcp-be-lol-game-data/v1';

import * as Template from './layout.html';

interface Data {
    icons: GameData.Icon[] | null;
    owned: number[];

    showUnowned: boolean;
    sort: string;

    //non-reactive
    uikit: any;

    //computed
    sorted: GameData.Champion[] | null;
    ownedCount: number;
    totalCount: number;
}

export default Template<Data>({
    data() {
        return {
            icons: null,
            owned: null,

            showUnowned: false,
            sort: 'alphabet',
        }
    },

    computed: {
        ownedCount() {
            return this.owned && this.owned.length;
        },

        totalCount() {
            return this.icons && this.icons.length - this.owned.length;
        },

        sorted() {
            if (!this.icons) return null;

            let list = this.icons.filter(icon => {
                if (!this.showUnowned && !this.owned.includes(icon.id))
                    return false;

                return true;
            });

            return list;
        }
    },

    created() {
        // Step 1: Fetch summoner id.
        request<Login.Session>("/lol-login/v1/session").then<[GameData.Icon[], { icons: number[] }]>(data => {
            const summonerId = data.summonerId;

            // Step 2: Fetch owned champions and skins, as well as mastery score.
            return Promise.all([
                request(`/lol-game-data/assets/v1/profile-icons.json`),
                request(`/lol-collections/v1/inventories/${summonerId}/summoner-icons`),
            ]);
        }).then(([all, owned]) => {
            this.icons = all;
            this.owned = owned.icons;

            Logging.log(this.icons, this.owned, this);
        });
    }
});

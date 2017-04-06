import { API as Observe } from 'base/plugins/observe';
// import * as Logging from 'base/logging';

// import { Summoner } from 'rcp-be-lol-summoner/v1';
import * as Common from 'rcp-fe-common-libs/v1';

import * as Template from './layout.html';
import GameMember from '../game-member';

interface Data {
    observe: Observe;
    blueTeam: any[];
    redTeam: any[];
    // data: { [id: number]: { summoner: Summoner, leagues: any[] } };

    // leagues: Common.Binding;
    // summoner: Common.Binding;
    gameflow: Common.Binding;

    // getData(isAlly: boolean, member: any): void;
}

export default Template<Data>({
    components: { GameMember },

    data() {
        return {
            data: {},
            redTeam: null,
            blueTeam: null,
        };
    },

    created() {
        this.observe.bind('/lol-gameflow/v1').then(gameflow => {
            gameflow.observe('/session', (data: any) => {
                this.redTeam = data.gameData.teamTwo;
                this.blueTeam = data.gameData.teamOne;
            });
        });
        // Promise.all([
        //     this.observe.bind('/lol-gameflow/v1'),
        //     this.observe.bind('/lol-summoner/v1'),
        //     this.observe.bind('/lol-leagues/v1'),
        // ]).then(([gameflow, summoner, leagues]) => {
        //     this.gameflow = gameflow;
        //     // this.summoner = summoner;
        //     // this.leagues = leagues;

        //     gameflow.observe('/session', (data: any) => {
        //         this.redTeam = data.gameData.teamTwo;
        //         this.blueTeam = data.gameData.teamOne;
        //         // for (let member of <any[]>[].concat(data.gameData.teamOne, data.gameData.teamTwo)) {
        //         //     this.getData(data.gameData.teamOne.includes(member), member);
        //         // }
        //         // Logging.log('gameflow', data);
        //     });
        // });
    },

    // methods: {
    //     getData(isAlly: boolean, member: any) {
    //         Promise.all([
    //             this.summoner.get('/summoners/' + member.summonerId),
    //             this.leagues.get('/summoner-leagues/' + member.summonerId),
    //         ]).then(([summoner, leagues]) => {
    //             Logging.log(isAlly, member, summoner, leagues);
    //         });
    //         Logging.log(member.summonerId);
    //     }
    // }
});
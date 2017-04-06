import { API as Observe } from 'base/plugins/observe';
import * as Logging from 'base/logging';

import { Summoner } from 'rcp-be-lol-summoner/v1';
// import * as Common from 'rcp-fe-common-libs/v1';

import * as Template from './layout.html';

interface Data {
    // props
    member: any;
    observe: Observe;

    // data
    summoner: Summoner;
    leagues: any[];
}

export default Template<Data>({
    props: {
        member: Object,
        observe: Object
    },

    data() {
        return {
            summoner: null
        };
    },

    created() {
        this.observe.bind('/lol-summoner/v1').then(bind => {
            bind.get<Summoner>('/summoners/' + this.member.summonerId).then(summ => {
                Logging.log(summ);
                this.summoner = summ;
            });
        });
        //  + this.member.summonerId
        this.observe.bind('/lol-leagues/v1').then(bind => {
            bind.get<any[]>('/summoner-leagues/39277681').then(leagues => {
                Logging.log(leagues);
                this.leagues = leagues;
            });
        })
    },
})
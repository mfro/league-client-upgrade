import * as Zhonya from 'zhonya';

import * as api from './api';

export default Zhonya.addPlugin({
    name: 'champselect-summoner-info',
    description: 'Displays summoner ranked stats and other info for team mates in champ select',

    riotDependencies: {
        'rcp-fe-lol-champ-select': '1.0.969',
        'rcp-fe-lol-league-tier-names': '0.0.31',
        'rcp-fe-lol-uikit': '0.x',

        'rcp-be-lol-summoner': '2.x',
        'rcp-be-lol-leagues': '1.x'
    },
    
    dependencies: [
        'ember-injector',
    ],

    api: api
});
import { Provider } from 'base/plugin';
import * as Logging from 'base/logging';

import Vue from 'vue';

import StatsScreen from './stats-screen';

export function setup(hook: Provider) {
    hook.getRiotPluginApi('rcp-fe-lol-game-in-progress').then(api => {
        Logging.log('game-in-progress', api);
    });

    let vue = new Vue(StatsScreen);
    let div = document.createElement('div');
    document.body.appendChild(div);
    vue.$mount(div);
}
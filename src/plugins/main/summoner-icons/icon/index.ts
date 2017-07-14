import Vue from '@mfro/vue-ts';

import * as GameData from 'rcp-be-lol-game-data/v1';

import * as template from './layout.html';

@Vue.Component({ mixins: [template.mixin] })
export default class Icon extends Vue {
    @Vue.Prop
    owned: boolean;

    @Vue.Prop
    icon: GameData.Icon;
}
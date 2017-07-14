import Vue from '@mfro/vue-ts';

import * as template from './layout.html';

@Vue.Component({ mixins: [template.mixin] })
export default class SummonerInfoTooltip extends Vue { }

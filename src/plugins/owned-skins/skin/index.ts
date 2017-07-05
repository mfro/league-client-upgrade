import Vue from '@mfro/vue-ts';

import * as GameData from 'rcp-be-lol-game-data/v1';

import * as template from './layout.html';

import * as Zhonya from 'zhonya';

@Vue.Component({ mixins: [template.mixin] })
export default class Skin extends Vue {
    @Vue.Prop
    showUnowned: boolean;

    @Vue.Prop
    skin: GameData.Skin;

    @Vue.Prop
    champion: GameData.Champion;

    uikit: Zhonya.RiotPlugin;
    championDetails: Zhonya.RiotPlugin;

    mounted() {
        this.uikit = Zhonya.provider.getRiotPlugin('rcp-fe-lol-uikit');
        this.championDetails = Zhonya.provider.getRiotPlugin('rcp-fe-lol-champion-details');

        this.uikit.api.getTooltipManager().assign(this.$el, this.renderTooltip, {}, {
            targetAnchor: {
                x: "center",
                y: "top"
            },
            tooltipAnchor: {
                x: "center",
                y: "bottom"
            },
            hideEvent: "mouseleave"
        });
    }

    open(champion: GameData.Champion, skin: GameData.Skin) {
        this.championDetails.api.show({ championId: champion.id, skinId: skin.id });
    }

    renderTooltip() {
        let text: string;
        if (this.skin.ownership.owned) {
            let date = new Date(this.skin.ownership.rental.purchaseDate);
            text = `Purchased on ${date.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })}`;
        } else {
            text = 'Not owned';
        }

        let block = this.uikit.api.getTemplateHelper().contentBlockTooltip(this.skin.name, text, 'tooltip-system');

        let tip = document.createElement('lol-uikit-tooltip');
        tip.className = 'skin-tooltip ' + this.skin.ownership.owned ? 'owned' : 'unowned';
        tip.appendChild(block);

        return tip;
    }
}

import * as GameData from 'rcp-be-lol-game-data/v1';

import * as template from './layout.html';
import Vue from '@mfro/vue-ts';

@Vue.Component({ mixins: [template.mixin] })
export default class Skin extends Vue {
    @Vue.Prop
    showUnowned: boolean;

    @Vue.Prop
    uikit: any;

    @Vue.Prop
    championDetails: any;

    @Vue.Prop
    skin: GameData.Skin;

    @Vue.Prop
    champion: GameData.Champion;

    mounted() {
        this.uikit.getTooltipManager().assign(this.$el, this.renderTooltip, {}, {
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
        this.championDetails.show({ championId: champion.id, skinId: skin.id });
    }

    renderTooltip() {
        // let locale = navigator.language;

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

        let block = this.uikit.getTemplateHelper().contentBlockTooltip(this.skin.name, text, 'tooltip-system');

        let tip = document.createElement('lol-uikit-tooltip');
        tip.className = 'skin-tooltip ' + this.skin.ownership.owned ? 'owned' : 'unowned';
        tip.appendChild(block);

        return tip;
    }
}

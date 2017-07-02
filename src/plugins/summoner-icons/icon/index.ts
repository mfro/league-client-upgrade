import * as GameData from 'rcp-be-lol-game-data/v1';

import * as Template from './layout.html';

interface Data {
    icon: GameData.Icon;

    uikit: any;

    renderTooltip: () => HTMLElement;
}

export default Template<Data>({
    props: {
        owned: Boolean,

        uikit: Object,

        icon: Object,
    },

    mounted() {
        // this.uikit.getTooltipManager().assign(this.$el, this.renderTooltip, {}, {
        //     targetAnchor: {
        //         x: "center",
        //         y: "top"
        //     },
        //     tooltipAnchor: {
        //         x: "center",
        //         y: "bottom"
        //     },
        //     hideEvent: "mouseleave"
        // });
    },

    methods: {
        // renderTooltip() {
        //     // let locale = navigator.language;

        //     let text: string;
        //     if (this.skin.ownership.owned) {
        //         let date = new Date(this.skin.ownership.rental.purchaseDate);
        //         text = `Purchased on ${date.toLocaleDateString(undefined, {
        //             weekday: 'long',
        //             month: 'long',
        //             day: 'numeric',
        //             year: 'numeric'
        //         })}`;
        //     } else {
        //         text = 'Not owned';
        //     }
            
        //     let block = this.uikit.getTemplateHelper().contentBlockTooltip(this.skin.name, text, 'tooltip-system');

        //     let tip = document.createElement('lol-uikit-tooltip');
        //     tip.className = 'skin-tooltip ' + this.skin.ownership.owned ? 'owned' : 'unowned';
        //     tip.appendChild(block);

        //     return  tip;
        // }
    }
});
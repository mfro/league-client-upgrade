import Vue from '@mfro/vue-ts';

import * as template from './layout.html';

import * as saved from '../saved';

@Vue.Component({ mixins: [template.mixin] })
export default class LoginSaveRoot extends Vue {
    @Vue.Data
    saved: saved.Account[];

    @Vue.Data
    isVisible = false;

    styleNode: HTMLStyleElement;

    created() {
        saved.get().then(list => {
            this.saved = list.filter(a => a.password && a.display);
            this.isVisible = !!this.styleNode.parentNode;

            if (this.isVisible && this.saved.length == 0)
                this.hide();
        });
    }

    hide() {
        this.styleNode.parentNode!.removeChild(this.styleNode);
        this.isVisible = false;
    }

    show() {
        document.head.appendChild(this.styleNode);
        this.isVisible = true;
    }
}
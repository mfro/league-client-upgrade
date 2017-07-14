import Vue from '@mfro/vue-ts';

import * as template from './layout.html';

import * as saved from '../saved';
import replaceStyle from './replace.less';

let replaceStyleNode: HTMLStyleElement;

@Vue.Component({ mixins: [template.mixin] })
export default class LoginSaveRoot extends Vue {
    @Vue.Data
    saved: saved.Account[];

    @Vue.Data
    isVisible = false;

    created() {
        replaceStyleNode || (replaceStyleNode = replaceStyle());

        saved.get().then(list => {
            this.saved = list.filter(a => a.password && a.display);
            this.isVisible = !!replaceStyleNode.parentNode;

            if (this.isVisible && this.saved.length == 0)
                this.hide();
        });
    }

    hide() {
        replaceStyleNode.parentNode!.removeChild(replaceStyleNode);
        this.isVisible = false;
    }

    show() {
        document.head.appendChild(replaceStyleNode);
        this.isVisible = true;
    }
}
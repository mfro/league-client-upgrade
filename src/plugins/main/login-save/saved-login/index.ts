import Vue from '@mfro/vue-ts';
import request from '@/util/request';

import * as template from './layout.html';

import { Account } from '../saved';

@Vue.Component({ mixins: [template.mixin] })
export default class LoginSaveRoot extends Vue {
    @Vue.Prop
    account: Account;

    get iconStyle() {
        return {
            backgroundImage: `url(/lol-game-data/assets/v1/profile-icons/${this.account.iconId}.jpg`
        };
    }

    submit() {
        request('POST', '/lol-login/v1/session', {
            username: this.account.username,
            password: this.account.password
        });
    }
}
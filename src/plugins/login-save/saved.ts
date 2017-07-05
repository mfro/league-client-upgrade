import request from 'zhonya/util/request';

import * as Login from 'rcp-be-lol-login/v1';
import * as Chat from 'rcp-be-lol-chat/v1';

import Observe from 'zhonya/plugins/observe';

export interface Account {
    display?: string;
    username: string;
    password?: string;
    iconId?: number;
}

const name = 'zhonya-saved-accounts';

let chatMe: Chat.User;
let loginSession: Login.Session;

export function get(): Promise<Account[]> {
    return request<{ data: any }>('/lol-settings/v2/local/' + name).then(res => {
        return res.data ? res.data.accounts : [];
    });
}

export function patch(account: Account) {
    return get().then(list => {
        let old = list.find(a => a.username == account.username);

        if (!old) {
            list.push(account);
        } else {
            for (let key in account) {
                (<any>old)[key] = (<any>account)[key];
            }
        }

        return request('PATCH', '/lol-settings/v2/local/' + name, {
            data: { accounts: list },
            schemaVersion: 1
        })
    });
}

export function start() {
    Promise.all([
        Observe.api.bind('/lol-chat/v1'),
        Observe.api.bind('/lol-login/v1'),
    ]).then(([chat, login]) => {
        chat.observe<Chat.User>('/me', v => (chatMe = v, update()));
        login.observe<Login.Session>('/session', v => (loginSession = v, update()));
    });
}

function update() {
    if (!chatMe || !chatMe.icon || !chatMe.name) return;
    if (!loginSession || !loginSession.username) return;

    patch({
        display: chatMe.name,
        username: loginSession.username,
        iconId: chatMe.icon
    });
}
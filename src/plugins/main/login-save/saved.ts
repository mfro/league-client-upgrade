import request from '@/util/request';

import * as Login from 'rcp-be-lol-login/v1';
import * as Chat from 'rcp-be-lol-chat/v1';

import Observe from '@/plugins/lib/observe';

export interface Account {
    display?: string;
    username: string;
    password?: string;
    iconId?: number;
}

const name = 'zhonya-saved-accounts';

let chatMe: Chat.User;
let loginSession: Login.Session;

let cached: Promise<Account[]>;

export function get(): Promise<Account[]> {
    if (cached) return cached;

    return cached = request<{ data: any }>('/lol-settings/v2/local/' + name).then(res => {
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

        cached = Promise.resolve(list);
        return request('PATCH', '/lol-settings/v2/local/' + name, {
            data: { accounts: list },
            schemaVersion: 1
        });
    });
}

export function start() {
    Promise.all([
        Observe.api.bind('/lol-chat/v1'),
        Observe.api.bind('/lol-login/v1'),
    ]).then(([chat, login]) => {
        chat.observe<Chat.User>('/me', v => {
            chatMe = v;
            update();
        });

        login.observe<Login.Session>('/session', v => {
            loginSession = v;
            update();
        });
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
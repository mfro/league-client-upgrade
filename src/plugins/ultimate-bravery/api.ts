import * as Zhonya from 'zhonya';
import * as Logging from 'logging';

import * as CommonLibs from 'rcp-fe-common-libs/v1';

import * as Chat from 'rcp-be-lol-chat/v1';
import * as Login from 'rcp-be-lol-login/v1';
import * as GameData from 'rcp-be-lol-game-data/v1';
import * as GameFlow from 'rcp-be-lol-game-flow/v1';
import * as ItemSets from 'rcp-be-lol-item-sets/v1';
import * as Collections from 'rcp-be-lol-collection/v1';
import * as ChampSelect from 'rcp-be-lol-champ-select/v1';

import observe from 'plugins/observe';

interface BraveBuild {
    spell1Id: number;
    spell2Id: number;
    championId: number;

    spell: string;
    items: number[];
    masteries: {
        items: Collections.MasterySelection[];
        summary: { 1: number, 2: number, 3: number };
    };
}

const keywords = [
    'be brave my son',
    'be brave little one',
    'be brave my child',
];

const wrong = {
    normal: [3070, 3029, 3003, 3004],
    quick: [3073, 3029, 3007, 3008],
};

let collections: CommonLibs.Binding;
let champSelect: CommonLibs.Binding;
let itemSets: CommonLibs.Binding;
let gameData: CommonLibs.Binding;
let gameFlow: CommonLibs.Binding;
let chat: CommonLibs.Binding;

let login: CommonLibs.Binding;

let me: Chat.User;
let ignore = new Array<string>();

let loginSession: Login.Session;
let champSelectSession: ChampSelect.Session;
let isBrave = false;

let building = false;
let chatRoomName: string | null;

function build(action: ChampSelect.Action) {
    if (building)
        return;
    else
        building = true;

    Promise.all([
        champSelect.get<{ championIds: number[] }>('/pickable-champions'),

        gameFlow.get<GameFlow.Session>('/session'),

        gameData.get<GameData.Item[]>('/items.json'),

        gameData.get<GameData.SummonerSpell[]>('/summoner-spells.json'),

        gameData.get<GameData.Masteries>('/summoner-masteries.json'),
    ]).then(([pickable, session, items, spells, masteries]) => {
        let build = <BraveBuild><any>{};

        let i = Math.floor(Math.random() * pickable.championIds.length);
        build.championId = pickable.championIds[i];

        let map = session.gameData.queue.mapId;
        let mode = session.gameData.queue.gameMode;

        let validSpells = spells.filter(s => s.gameModes.includes(mode));
        i = Math.floor(Math.random() * validSpells.length);
        build.spell1Id = validSpells.splice(i, 1)[0].id;
        i = Math.floor(Math.random() * validSpells.length);
        build.spell2Id = validSpells.splice(i, 1)[0].id;

        let boots = items.find(i => i.id == 1001)!.to;
        let validItems = items.filter(i =>
            i.mapInclusions.includes(map) &&
            i.id >= 3000 &&
            i.to.length == 0 &&
            !boots.includes(i.id) &&
            ((!wrong.quick.includes(i.id) && !wrong.normal.includes(i.id)) ||
                (wrong.quick.includes(i.id) && map == 12) ||
                (wrong.normal.includes(i.id) && map != 12)));

        build.items = [];
        build.items.push(boots[Math.floor(Math.random() * boots.length)]);

        for (var j = 0; j < 5; j++) {
            let i = Math.floor(Math.random() * validItems.length);
            build.items.push(validItems.splice(i, 1)[0].id);
        }

        build.spell = ['Q', 'W', 'E'][Math.floor(Math.random() * 3)];

        function fillGroup(group: GameData.MasteryGroup, count: number) {
            for (var row of group.rows) {
                if (count <= 0) return;

                i = Math.floor(Math.random() * row.masteries.length);

                build.masteries.items.push({
                    id: row.masteries[i],
                    rank: row.maxPointsInRow
                });

                count -= row.maxPointsInRow;
            }
        }

        build.masteries = {
            items: [],
            summary: <any>{}
        };

        let indeces = [0, 1, 2];
        i = indeces.splice(Math.floor(Math.random() * indeces.length), 1)[0];
        (<any>build.masteries.summary)[i + 1] = 18;
        fillGroup(masteries.tree.groups[i], 18);

        i = indeces.splice(Math.floor(Math.random() * indeces.length), 1)[0];
        (<any>build.masteries.summary)[i + 1] = 12;
        fillGroup(masteries.tree.groups[i], 12);

        (<any>build.masteries.summary)[indeces[0] + 1] = 12;

        lockIn(build, action);
    });
}

function lockIn(build: BraveBuild, action: ChampSelect.Action) {
    champSelect.patch(`/session/actions/${action.id}`, {
        championId: build.championId,
        completed: true
    });

    champSelect.patch(`/session/my-selection`, {
        spell1Id: build.spell1Id,
        spell2Id: build.spell2Id
    });

    itemSets.get<any>(`/item-sets/${loginSession.summonerId}/sets`).then(data => {
        data.itemSets.push({
            associatedChampions: [build.championId],
            associatedMaps: [],
            blocks: [],
            map: "any",
            mode: "any",
            sortrank: 0,
            title: "Ultimate Bravery | Ability: " + build.spell,
            type: "custom",
            uid: 'ultimate-bravery-' + guid()
        });

        itemSets.put(`/item-sets/${loginSession.summonerId}/sets`, data);;
    });

    collections.get<Collections.MasteryBook>(`/inventories/${loginSession.summonerId}/mastery-book`).then(book => {
        book.pages.forEach(p => p.current = false);
        book.pages.push({
            id: Math.floor(Math.random() * 1e6),
            current: true,
            masteries: build.masteries.items,
            name: "Ultimate Bravery",
            summary: build.masteries.summary
        });

        collections.put(`/inventories/${loginSession.summonerId}/mastery-book`, book);
    });

    chat.post(`/conversations/${encodeURIComponent(chatRoomName!)}/messages`, <Chat.Message>{
        body: `${me.name} is choosing the warriors path!\n` +
        `Ability: ${build.spell[0]}`,

        type: 'ultimate-bravery'
    });
}

function cleanup(thorough: boolean) {
    chatRoomName = null;
    isBrave = building = false;

    Logging.log('cleanup', thorough);

    if (thorough) {
        itemSets.get<ItemSets.Sets>(`/item-sets/${loginSession.summonerId}/sets`).then(data => {
            data.itemSets = data.itemSets.filter(set => !set.uid.includes('ultimate-bravery'));

            itemSets.put(`/item-sets/${loginSession.summonerId}/sets`, data);
        });

        collections.get<Collections.MasteryBook>(`/inventories/${loginSession.summonerId}/mastery-book`).then(book => {
            book.pages = book.pages.filter(page => page.name != 'Ultimate Bravery');

            collections.put(`/inventories/${loginSession.summonerId}/mastery-book`, book);
        });
    }
}

function update() {
    if (champSelectSession == null || !isBrave)
        return;

    let allActions = new Array<ChampSelect.Action>().concat(...champSelectSession.actions);
    let cell = champSelectSession.myTeam.find(c => c.cellId == champSelectSession.localPlayerCellId)!;
    let pick = allActions.find(a => a.actorCellId == cell.cellId && a.type == 'pick')!;

    if (!pick || pick.completed)
        return;

    build(pick);
}

function onMessage(room: Chat.Conversation, msg: Chat.Message) {
    if (isBrave)
        return;

    if (keywords.includes(msg.body.toLowerCase())) {
        isBrave = true;

        chat.post(`/conversations/${encodeURIComponent(chatRoomName!)}/messages`, <Chat.Message>{
            body: 'THE ONLY TRUE DEATH IS A WARRIORS DEATH!!!',
            type: 'chat'
        });

        update();
    }
}

function onChampSelectSession(value: ChampSelect.Session) {
    champSelectSession = value;

    if (value == null || value.localPlayerCellId < 0)
        return;

    update();

    let name = value.chatDetails.chatRoomName.toLowerCase().replace(/@.*/, '');

    if (!name || name == chatRoomName)
        return;

    chatRoomName = name;
    Logging.log('got chat room', chatRoomName);
    chat.observe<Chat.Conversation>(`/conversations/${encodeURIComponent(chatRoomName)}`, room => {
        if (!room || !room.lastMessage)
            return;

        if (ignore.includes(room.lastMessage.id))
            return;

        ignore.push(room.lastMessage.id);
        onMessage(room, room.lastMessage);
    });
}

function onGameFlowSession(value: GameFlow.Session) {
    if (value == null)
        return;

    switch (value.phase) {
        case 'InProgress':
        case 'GameStart':
            cleanup(false);
            break;

        case 'None':
            cleanup(true);
            break;
    }
}

function init() {
    chat.observe<Chat.User>('/me', m => me = m);
    gameFlow.observe<GameFlow.Session>('/session', onGameFlowSession);
    champSelect.observe<ChampSelect.Session>('/session', onChampSelectSession);

    login.observe<Login.Session>('/session', s => loginSession = s);
}

export function setup(hook: Zhonya.Provider) {
    Promise.all([
        observe.api.bind('/lol-collections/v1'),
        observe.api.bind('/lol-chat/v1'),
        observe.api.bind('/lol-login/v1'),
        observe.api.bind('/lol-gameflow/v1'),
        observe.api.bind('/lol-item-sets/v1'),
        observe.api.bind('/lol-champ-select/v1'),
        observe.api.bind('/lol-game-data/assets/v1'),
    ]).then(args => {
        collections = args[0];
        chat = args[1];
        login = args[2];
        gameFlow = args[3];
        itemSets = args[4];
        champSelect = args[5];
        gameData = args[6];
        init();
    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
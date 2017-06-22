import * as Zhonya from 'zhonya';
import * as Logging from 'logging';

import * as CommonLibs from 'rcp-fe-common-libs/v1';

import * as Chat from 'rcp-be-lol-chat/v1';
import * as GameData from 'rcp-be-lol-game-data/v1';
import * as GameFlow from 'rcp-be-lol-game-flow/v1';
import * as ChampSelect from 'rcp-be-lol-champ-select/v1';

import observe from 'plugins/observe';
// import request from 'utility/request';

interface BraveBuild {
    spell1Id: number;
    spell2Id: number;
    championId: number;

    spell: string;
    items: number[];
    masteries: number[];
}

const keyword = 'be brave my son'.toLowerCase();
const wrong = {
    normal: [3070, 3029, 3003, 3004],
    quick: [3073, 3029, 3007, 3008],
};

let champSelect: CommonLibs.Binding;
let gameData: CommonLibs.Binding;
let gameFlow: CommonLibs.Binding;
let chat: CommonLibs.Binding;

let me: Chat.User;
let ignore = new Array<string>();

let session: ChampSelect.Session;
let isBrave = false;

let chatRoomName: string | null;

let building = false;

function lockIn(build: BraveBuild, action: ChampSelect.Action) {
    champSelect.patch(`/session/actions/${action.id}`, {
        championId: build.championId,
        completed: true
    });

    champSelect.patch(`/session/my-selection`, {
        spell1Id: build.spell1Id,
        spell2Id: build.spell2Id
    });

    chat.post(`/conversations/${chatRoomName}/messages`, <Chat.Message>{
        body: `${me.name} is doing ultimate bravery!
Masteries: ${build.masteries.join(' | ')}
Ability: ${build.spell[0]}`,

        type: 'ultimate-bravery'
    });
}

function update() {
    if (session == null || !isBrave)
        return;

    let allActions = new Array<ChampSelect.Action>().concat(...session.actions);
    let cell = session.myTeam.find(c => c.cellId == session.localPlayerCellId)!;
    let pick = allActions.find(a => a.actorCellId == cell.cellId && a.type == 'pick')!;

    if (!pick || pick.completed)
        return;

    if (building)
        return;

    building = true;

    Promise.all([
        champSelect.get<{ championIds: number[] }>('/pickable-champions'),

        gameFlow.get<GameFlow.Session>('/session'),

        gameData.get<GameData.Item[]>('/items.json'),

        gameData.get<GameData.SummonerSpell[]>('/summoner-spells.json'),
    ]).then(([pickable, session, items, spells]) => {
        let build = <any>{};

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

        build.masteries = [];

        let indeces = [0, 1, 2];
        build.masteries[indeces.splice(Math.floor(Math.random() * indeces.length), 1)[0]] = 18;
        build.masteries[indeces.splice(Math.floor(Math.random() * indeces.length), 1)[0]] = 12;
        build.masteries[indeces[0]] = 0;

        lockIn(build, pick);
    });
}

function onMessage(room: Chat.Conversation, msg: Chat.Message) {
    Logging.log(msg);

    if (msg.body.toLowerCase() == keyword) {
        Logging.log('Ultimate BRAVERY!!!!');
        isBrave = true;
        update();
    }
}

function onChampSelectSession(value: ChampSelect.Session) {
    Logging.log('champselect', value);

    session = value;
    update();

    Logging.log('champselect2', value);

    if (value == null || value.localPlayerCellId < 0)
        return;

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
    Logging.log('gameflow', value);

    if (value == null || value.phase != 'ChampSelect') {
        chatRoomName = null;
        building = false;
        Logging.log('left champ select');
    }
}

function init() {
    if (chat == null || champSelect == null || gameData == null || gameFlow == null)
        return;

    alert('init ultimate-bravery');

    chat.observe<Chat.User>('/me', m => me = m);
    gameFlow.observe<GameFlow.Session>('/session', onGameFlowSession);
    champSelect.observe<ChampSelect.Session>('/session', onChampSelectSession);
}

export function setup(hook: Zhonya.Provider) {
    observe.api.bind('/lol-chat/v1').then(b => (chat = b, init()));
    observe.api.bind('/lol-gameflow/v1').then(b => (gameFlow = b, init()));
    observe.api.bind('/lol-champ-select/v1').then(b => (champSelect = b, init()));
    observe.api.bind('/lol-game-data/assets/v1').then(b => (gameData = b, init()));
}
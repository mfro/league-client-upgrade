declare module 'rcp-be-lol-chat/v1' {
    interface Conversation {
        id: string;
        inviterId: string;
        isMuted: boolean;
        lastMessage: Message | null;
        name: string;
        password: string;
        type: string;
        unreadMessageCount: number;
    }

    interface Message {
        body: string;
        fromId: number;
        id: string;
        isHistorical: true;
        timestamp: string;
        type: string;
    }

    interface User {
        availability: string;
        icon: number;
        id: number;
        lastSeenOnlineTimestamp: null;
        lol: {
            championId: string;
            clubsData: string;
            gameQueueType: string;
            gameStatus: string;
            isObservable: string;
            level: string;
            mapId: string;
            rankedLeagueDivision: string;
            rankedLeagueName: string;
            rankedLeagueQueue: string;
            rankedLeagueTier: string;
            rankedLosses: string;
            rankedWins: string;
            skinVariant: string;
            skinname: string;
            tier: string;

            aceData?: string;
        },
        name: string;
        statusMessage: string | null;
    }
}
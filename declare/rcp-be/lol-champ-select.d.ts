declare module 'rcp-be-lol-champ-select/v1' {
    interface Member {
        displayName: number;
        championId: number;
        cellId: number;
    }

    interface Session {
        myTeam: any;
    }
}
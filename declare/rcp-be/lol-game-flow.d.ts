declare module 'rcp-be-lol-gameflow/v1' {
    interface Session {
        gameClient: GameClient;
        gameData: GameData;
        gameDodge: GameDodge;

        map: any;

        phase: string;
    }

    interface GameClient {
        observerServerIp: string;
        observerServerPort: number;
        running: boolean;
        serverIp: string;
        serverPort: number;
        visible: boolean;
    }

    interface GameData {
        gameId: number;
        gameName: string;
        isCustomGame: boolean;
        password: string;
        playerChampionSelections: any[];

        queue: GameQueue;

        spectatorsAllowed: boolean;
        teamOne: any[];
        teamTwo: any[];
    }

    interface GameQueue {
        areFreeChampionsAllowed: boolean;
        category: string;
        gameMode: string;
        gameMutator: string;

        gameTypeConfig: GameTypeConfig;

        id: number;
        isRanked: boolean;
        isTeamBuilderManaged: boolean;
        isTeamOnly: boolean;
        mapId: number;
        maxLevel: number;
        maxSummonerLevelForFirstWinOfTheDay: number;
        maximumParticipantListSize: number;
        minLevel: number;
        minimumParticipantListSize: number;
        queueAvailability: string;
        queueRewards: {
            isChampionPointsEnabled: boolean;
            isIpEnabled: boolean;
            isXpEnabled: boolean;
            partySizeIpRewards: any[];
        };
        spectatorEnabled: boolean;
        type: string;
    }

    interface GameTypeConfig {
        advancedLearningQuests: boolean;
        allowTrades: boolean;
        banMode: string;
        banTimerDuration: number;
        battleBoost: boolean;
        crossTeamChampionPool: boolean;
        deathMatch: boolean;
        doNotRemove: boolean;
        duplicatePick: boolean;
        exclusivePick: boolean;
        id: number;
        learningQuests: boolean;
        mainPickTimerDuration: number;
        maxAllowableBans: number;
        name: string;
        onboardCoopBeginner: boolean;
        pickMode: string;
        postPickTimerDuration: number;
        reroll: boolean;
        teamChampionPool: boolean;
    }

    interface GameDodge {
        dodgeIds: number[];
        state: string;
    }
}
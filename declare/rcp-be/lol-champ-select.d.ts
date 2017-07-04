declare module 'rcp-be-lol-champ-select/v1' {
    interface Cell {
        assignedPosition: string;
        cellId: number;
        championId: number;
        championPickIntent: number;
        displayName: string;
        playerType: string;
        selectedSkinId: number;
        spell1Id: number;
        spell2Id: number;
        team: number;
        wardSkinId: number;
    }

    interface Action {
        actorCellId: number;
        championId: number;
        completed: boolean;
        id: number;
        pickTurn: number;
        type: string;
    }

    interface Session {
        actions: Action[][];
        bans: {
            numBans: number;
            myTeamBans: any[];
            theirTeamBans: any[]
        };
        ceremonies: any[];
        chatDetails: ChatDetails;
        isSpectating: false;
        localPlayerCellId: number;
        myTeam: Cell[];
        theirTeam: Cell[];

        timer: {
            adjustedTimeLeftInPhase: number;
            adjustedTimeLeftInPhaseInSec: number;
            internalNowInEpochMs: number;
            isInfinite: false;
            phase: string;
            timeLeftInPhase: number;
            timeLeftInPhaseInSec: number;
            totalTimeInPhase: number;
        };

        trades: any[];
    }

    interface ChatDetails {
        chatRoomName: string;
        chatRoomPassword: string;
    }
}
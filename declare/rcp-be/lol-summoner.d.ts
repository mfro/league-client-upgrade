declare module 'rcp-be-lol-summoner/v1' {
    interface Summoner {
        accountId: number;
        displayName: string;
        internalName: string;
        lastSeasonHighestRank: string;
        percentCompleteForNextLevel: number;
        profileIconId: number;
        puuid: string;
        rerollPoints: RerollSummary;
        summonerId: number;
        summonerLevel: number;
        xpSinceLastLevel: number;
        xpUntilNextLevel: number;
    }

    interface RerollSummary {
        currentPoints: number;
        maxRolls: number;
        numberOfRolls: number;
        pointsCostToRoll: number;
        pointsToReroll: number;
    }
}
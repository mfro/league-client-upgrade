declare module 'rcp-be-lol-game-data/v1' {
    interface ChampionMastery {
        championId: number;
        championPoints: number;
        championLevel: number;
    }

    interface Skin {
        name: string;
        id: number;
        ownership: {
            owned: boolean,
            rental: { purchaseDate: number }
        };
    }

    interface Champion {
        skins: Skin[];
        name: string;
        id: number;
    }
}
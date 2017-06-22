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

    interface Item {
        id: number;
        name: string;
        description: string;
        active: boolean;
        inStore: boolean;
        from: number[];
        to: number[];
        categories: string[];
        mapInclusions: number[];
        maxStacks: number;
        modeInclusions: number[];
        requiredChampion: string;
        requiredBuffCurrencyName: string;
        requiredBuffCurrencyCost: number;
        specialRecipe: number;
        isEnchantment: boolean;
        price: number;
        priceTotal: number;
        iconPath: string;
    }

    interface SummonerSpell {
        cooldown: number;
        description: string;
        gameModes: string[];
        id: number;
        name: string;
        summonerLevel: number;
    }

    interface Masteries {
        type: string;
        tree: {
            groups: MasteryGroup[];
        };
        data: {
            [id: string]: MasteryDefinition
        };
    }

    interface MasteryGroup {
        id: number;
        name: string;
        version: number;
        rows: MasteryRow[];
    }

    interface MasteryRow {
        id: number;
        pointsToActivate: number;
        maxPointsInRow: number;
        masteries: number[];
    }

    interface MasteryDefinition {
        id: number;
        column: number;
        maxRank: number;
        minTier: number;
        minLevel: number;
        name: string;
        iconPath: string;
        description: string[];
    }
}
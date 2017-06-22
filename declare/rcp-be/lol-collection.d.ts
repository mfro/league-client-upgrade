declare module 'rcp-be-lol-collection/v1' {
    interface MasteryBook {
        pages: MasteryPage[];
        summonerId: number;
    }

    interface MasteryPage {
        current: boolean;
        id: number;
        masteries: MasterySelection[];
        name: string;
        summary: {
            1: number;
            2: number;
            3: number
        };
    }

    interface MasterySelection {
        id: number;
        rank: number
    }
}
declare module 'rcp-be-lol-item-sets/v1' {
    interface Sets {
        accountId: number;
        itemSets: Set[];
        preferredItemSlots: never;
        timestamp: number;
    }

    interface Set {
        associatedChampions: number[];
        associatedMaps: number[];
        blocks: never[];
        map: "any" | "SR" | "HA" | "TT" | "CS";
        mode: "any" | "CLASSIC" | "ARAM" | "ODIN";
        sortrank: number;
        startedFrom: string;
        title: string;
        type: "global" | "custom";
        uid: string;
    }
}
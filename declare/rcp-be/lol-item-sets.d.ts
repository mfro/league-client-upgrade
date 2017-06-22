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
        blocks: SetBlock[];
        map: "any" | "SR" | "HA" | "TT" | "CS";
        mode: "any" | "CLASSIC" | "ARAM" | "ODIN";
        sortrank: number;
        priority?: boolean;
        startedFrom?: string;
        title: string;
        type: "global" | "custom";
        uid: string;
    }

    interface SetBlock {
        items: SetItem[];
        type: string;
    }

    interface SetItem {
        id: string;
        count: number;
    }
}
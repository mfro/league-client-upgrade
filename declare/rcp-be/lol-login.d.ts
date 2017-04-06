declare module "rcp-be-lol-login/v1" {
    export interface Session {
        error: any;
        isNewPlayer: boolean;

        puuid: string;
        idToken: string;
        gasToken: GasToken;
        userAuthtoken: string;

        state: string;
        queueStatus: any;
        connected: boolean;

        username: string;
        accountId: number;
        summonerId: number;
    }

    export interface GasToken {
        date_time: string;
        signature: string;
        gas_account_id: string;
        vouching_key_id: string;
        pvpnet_account_id: string;
    }
}
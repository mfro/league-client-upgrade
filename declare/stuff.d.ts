declare interface RiotInvokeRequest {
    request: string;
    onSuccess?: Function;
    onFailure?: Function;
}

declare interface Array<T> {
    includes(t: T): boolean;
}

declare interface WebpackRequire {
    (path: string): any;

    context(path: string, subDirectories?: boolean, regex?: RegExp): WebpackContext;
}

declare interface WebpackContext {
    (path: string): any;
    
    keys(): string[];
}

declare interface Window {
    riotInvoke(req: RiotInvokeRequest): number
    require: WebpackRequire;
}

declare interface VueDefinition<T> {
    data(): T;
}
declare interface Array<T> {
    includes(t: T): boolean;
}

declare interface Window {
    riotInvoke(req: any): void;
}

declare module "*.html" {
    import Template from '@mfro/vue-loader'
    const x: Template;
    export = x;
}

declare module "*.less" {
    const x: (doc?: HTMLDocument) => HTMLStyleElement;
    export = x;
}

declare interface VueDefinition<T> {
    data(): T;
}
declare interface Array<T> {
    includes(t: T): boolean;
}

declare interface Window {
    riotInvoke(req: any): void;
}

declare module "*.html" {
    import Vue from 'vue';
    const x: <T>(a: Vue.ComponentOptions<T & Vue>) => Vue.ComponentOptions<T & Vue>;
    export = x;
}

declare module "*.less" {
    const x: () => void;
    export = x;
}

declare interface VueDefinition<T> {
    data(): T;
}
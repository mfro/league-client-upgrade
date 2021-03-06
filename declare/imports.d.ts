declare module "*.html" {
    import Template from '@mfro/vue-loader'
    const x: Template;
    export = x;
}

declare module "*.less" {
    const x: (doc?: HTMLDocument) => HTMLStyleElement;
    export = x;
}

declare module "*.json" {
    const x: any;
    export = x;
}
/// <reference path="rcp-be/index.d.ts" />
/// <reference path="rcp-fe/index.d.ts" />

declare namespace Ember {
    interface Component {
        $: JQueryStatic;
        _super(...args: any[]): void;
    }
}

declare namespace PluginRunner {
}
declare namespace Ember {
    interface Component {
        $: JQueryStatic;
        _super(...args: any[]): void;
    }
}

declare namespace PluginRunner {
}
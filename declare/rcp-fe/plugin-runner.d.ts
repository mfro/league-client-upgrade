declare module 'rcp-fe-plugin-runner/v1' {
    interface Provider {
        get(s: string): any;
        getSocket(): any;
    }

    interface PluginDefinition {
        app: string;
        assetBundleNames: string[];
        dependencies: { fullName: string, version: string }[];
        dynLibFileName: string;
        dynLibPath: string;
        feature: string;
        fullName: string;
        implementedContracts: { fullName: string, version: string }[];
        isDynamicLibraryInited: boolean;
        isDynamicLibraryLoaded: boolean;
        mountedAssetBundles: { [name: string]: string };
        orderDynamicLibraryInited: number;
        orderDynamicLibraryLoaded: number;
        orderWADFileMounted: number;
        pluginInfoApiSemVer: string;
        shortName: string;
        subtype: string;
        supertype: string;
        threadingModel: string;
        version: string;
    }
}
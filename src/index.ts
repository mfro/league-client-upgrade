import * as PluginRunner from 'rcp-fe-plugin-runner/v1';
import * as semver from 'semver';

import * as Logging from '@/logging';

import * as riot from './plugin-hook';

export const isDisabled = riot.isDisabled;

let plugins: Plugin<any>[] = [];
let riotPlugins: RiotPlugin[] = [];

let metadata = riot.getMetaData();

declare type RiotPluginCallback = (plugin: RiotPlugin) => void;

interface PluginAPI {
    setup: (provider: Provider) => void;
}

export enum PluginState {
    /** The plugin has been declared but not initialized */
    UNINITIALIZED,
    /** The plugin has been initialized */
    ENABLED,
    /** The plugin is disabled, either manually or by dependency failure  */
    DISABLED
}

export interface PluginDefinition {
    /** The name of the plugin - used for dependencies and logs */
    name: string;
    /** Optionally disable a plugin, is completely ignored and all dependents are disabled too */
    disabled?: boolean;
    /** Description of the purpose of a plugin */
    description: string;
    /** Other plugins that this plugins depends on.
     *  This plugin will load only once every plugin in this list is enabled */
    dependencies?: string[];
    /** Riot plugins that this plugin depends on. 
     *  This plugin will only load if all of these dependencies are satisfied.
     *  Uses semver. */
    riotDependencies?: { [name: string]: string };
}

export interface RiotPlugin {
    /** The API exposed by the riot plugin. Is null before initialization */
    api: any;
    /** The provider instance used to initialize this plugin. */
    provider: PluginRunner.Provider | null;
    /** True if the plugin has been loaded and its API acquired */
    isInitialized: boolean;

    /** The definition of the plugin from the plugin-manager riot API */
    definition: PluginRunner.PluginDefinition;
}

export interface Provider {
    /** Get a list of all plugins */
    allPlugins(): Plugin<any>[];
    /** Get a riot plugin by full name */
    getRiotPlugin(key: string): RiotPlugin;

    /** Add a pre-init hook for a riot plugin by full name */
    preInit(key: string, callback: RiotPluginCallback): void;
    /** Add a post-init hook for a riot plugin by full name */
    postInit(key: string, callback: RiotPluginCallback): void;

    /** Gets the API for a riot plugin.
     *  If it is not available yet, the promise does not resolve until it is */
    getRiotPluginApi(key: string): Promise<any>;
    /** Gets the API for a riot plugin.
     *  If it is not available yet, the promise does not resolve until it is */
    getRiotPluginApi(...keys: string[]): Promise<any[]>;
}

export const provider: Provider = {
    allPlugins(): Plugin<any>[] {
        return plugins;
    },

    getRiotPlugin(name: string): RiotPlugin {
        let plugin = riotPlugins.find(p => p.definition.fullName == name);
        if (!plugin) throw new Error('Riot plugin not found: ' + name);
        return plugin;
    },

    preInit(name: string, callback: RiotPluginCallback): void {
        riot.hook(name, 'preInit', name => callback(provider.getRiotPlugin(name)));
    },

    postInit(name: string, callback: RiotPluginCallback): void {
        riot.hook(name, 'postInit', name => callback(provider.getRiotPlugin(name)));
    },

    getRiotPluginApi(...names: string[]) {
        if (names.length == 1) {
            let plugin = provider.getRiotPlugin(names[0]);
            if (plugin.isInitialized)
                return Promise.resolve(plugin.api);
            else
                return new Promise(resolve => provider.postInit(names[0], p => resolve(p.api)));
        }

        return Promise.all(names.map(key => provider.getRiotPluginApi(key)));
    }
};

export class Plugin<T extends PluginAPI> {
    /** The API for this plugin. */
    api: T;
    /** The current state of this plugin  */
    state: PluginState;
    /** The provider for this plugin */
    provider: Provider;
    /** The definition used to crreate this plugin */
    definition: PluginDefinition;

    constructor(dec: PluginDefinition & { api: T }) {
        this.api = dec.api;
        this.state = PluginState.UNINITIALIZED;
        this.definition = dec;
        this.provider = provider;
    }

    private disable(msg: string) {
        Logging.error(msg);
        this.state = PluginState.DISABLED;
        return false;
    }

    /** Initialize this plugin.
     *  If it is already intialized, this method does nothing and returns true.
     *  If it is disabled, this method does nothing and returns false
     *  Otherwise, it initializes all of this plugin's dependencies,
     *  then this plugin and returns true 
     *  @return true if setup succeeded */
    setup() {
        // If the plugin has already been setup, return true
        if (this.state == PluginState.ENABLED)
            return true;

        // If the plugin has tried and failed to setup, return false
        if (this.state == PluginState.DISABLED)
            return false;

        let riot = this.definition.riotDependencies || {};
        for (let name in riot) {
            let dep = provider.getRiotPlugin(name);
            let version = riot[name];

            if (!dep)
                return this.disable(`${this.definition.name}: Could not find dependency ${name}. disabling...`);

            if (!semver.satisfies(dep.definition.version, version))
                return this.disable(`${this.definition.name}: Version mismatch for dependency ${name}, expected ${version}, got ${dep.definition.version}. disabling...`);
        }

        let dependencies = this.definition.dependencies || [];
        for (let name of dependencies) {
            let dep = getPlugin(name);

            if (!dep)
                return this.disable(`${this.definition.name}: Could not find dependency ${name}. disabling...`);

            if (!dep.setup())
                return this.disable(`${this.definition.name}: Dependency ${dep.definition.name} failed to setup, disabling...`);
        }

        try {
            this.api.setup(provider);

            Logging.log(`${this.definition.name}: Setup succeeded`);
            this.state = PluginState.ENABLED;
            return true;
        } catch (x) {
            Logging.error(`${this.definition.name}: Setup failed, disabling...`, x);
            this.state = PluginState.DISABLED;
            return false;
        }
    }
}

/** 
 * Start ace, initializing all of the plugins and loading the riot plugins
 */
export function start() {
    metadata.then(metadata => {
        // Map the riot plugin definitions to actual plugins
        for (let item of metadata) {
            let plugin: RiotPlugin = {
                api: null,
                provider: null,
                isInitialized: false,
                definition: item
            };

            riotPlugins.push(plugin);

            riot.hook(item.fullName, 'postInit', (name, api, provider) => {
                plugin.api = api;
                plugin.provider = provider;
                plugin.isInitialized = true;
            });
        }

        // Setup all of our plugins
        for (let plugin of plugins) {
            plugin.setup();
        }

        // Complete the riot plugin hooks
        riot.start();
    });
}

/**
 * Add a plugin to ace
 * 
 * @param definition The declaration of the plugin to add
 */
export function addPlugin<T extends PluginAPI>(definition: PluginDefinition & { api: T }) {
    let plugin = new Plugin(definition);

    if (definition.disabled) {
        plugin.state = PluginState.DISABLED;
        Logging.log('not loading ' + definition.name);
    }

    plugins.push(plugin);

    return plugin;
}

/**
 * Gets a plugin by name
 * @param key The name of the plugin
 */
function getPlugin<T extends PluginAPI>(key: string) {
    let plugin = plugins.find(p => p.definition.name == key);
    if (!plugin) throw new Error('Plugin not found: ' + key);

    return <Plugin<T>>plugin;
}

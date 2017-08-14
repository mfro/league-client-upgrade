import * as PluginRunner from 'rcp-fe-plugin-runner/v1';
import * as semver from 'semver';

import * as Logging from 'zhonya/logging';

import * as riot from './plugin-hook';
import Raven from 'raven-js';

export const isDisabled = riot.isDisabled;

let plugins: Plugin<any>[] = [];
let riotPlugins: RiotPlugin[] = [];

let metadata = riot.getMetaData();

declare type RiotPluginCallback = (plugin: RiotPlugin) => void;

interface PluginAPI {
    setup: (provider: Provider) => void;
}

export enum PluginState {
    UNINITIALIZED,
    ENABLED,
    DISABLED
}

export interface PluginDefinition {
    name: string;
    disabled?: boolean;
    description: string;
    dependencies?: string[];
    riotDependencies?: { [name: string]: string };
}

export interface RiotPlugin {
    api: any;
    provider: PluginRunner.Provider | null;
    isInitialized: boolean;

    definition: PluginRunner.PluginDefinition;
}

export interface Provider {
    allPlugins(): Plugin<any>[];
    getRiotPlugin(key: string): RiotPlugin;

    preInit(key: string, callback: RiotPluginCallback): void;
    postInit(key: string, callback: RiotPluginCallback): void;

    getRiotPluginApi(key: string): Promise<any>;
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
    api: T;
    state: PluginState;
    provider: Provider;
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
            Raven.captureException(x, { level: 'warning' });
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

        // Setup all the zhonya plugins
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

function getPlugin<T extends PluginAPI>(key: string) {
    let plugin = plugins.find(p => p.definition.name == key);
    if (!plugin) throw new Error('Plugin not found: ' + key);

    return <Plugin<T>>plugin;
}

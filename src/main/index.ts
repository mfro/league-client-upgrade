import * as PluginRunner from 'rcp-fe-plugin-runner/v1';
import * as semver from 'semver';

import * as Logging from 'logging';

import * as riot from './plugin-hook';

export const isDisabled = riot.isDisabled;

let preInits = new Map<string, RiotPluginCallback[]>();
let postInits = new Map<string, RiotPluginCallback[]>();

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

export class Plugin<T extends PluginAPI> {
    api: T;
    state: PluginState;
    definition: PluginDefinition;

    constructor(dec: PluginDefinition & { api: T }) {
        this.api = dec.api;
        this.state = PluginState.UNINITIALIZED;
        this.definition = dec;
    }

    private wrap<T extends Function>(action: T) {
        return <any>((...args: any[]) => {
            let deps = this.definition.riotDependencies;
            if (!deps || !deps[args[0]])
                throw new Error(`${this.definition.name}: Requested undeclared dependency ${name}.`);

            return action(...args);
        });
    }

    private checkRiotDepenency(name: string) {
        let deps = this.definition.riotDependencies;
        if (!deps || !deps[name])
            throw new Error(`${this.definition.name}: Requested undeclared dependency ${name}.`);
        return true;
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
            let dep = getRiotPlugin(name);
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
            this.api.setup({
                allPlugins: () => plugins,

                preInit: this.wrap(preInit),
                postInit: this.wrap(postInit),

                getRiotPlugin: this.wrap(getRiotPlugin),

                getRiotPluginApi: (...keys: string[]) => {
                    keys.forEach(a => this.checkRiotDepenency(a));
                    return getRiotPluginApi(...keys);
                }
            });

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
            preInits.set(item.fullName, []);
            postInits.set(item.fullName, []);

            riotPlugins.push({
                api: null,
                provider: null,
                isInitialized: false,
                definition: item
            });
        }

        // Setup all the zhonya plugins
        for (let plugin of plugins) {
            plugin.setup();
        }

        // Complete the riot plugin hooks
        riot.load({
            preInit(name) {
                let plugin = riotPlugins.find(p => p.definition.fullName == name);
                if (!plugin) return;

                let pre = preInits.get(plugin.definition.fullName);
                if (!pre) return;
                for (let p of pre) p(plugin);
            },

            postInit(name, api, provider) {
                let plugin = riotPlugins.find(p => p.definition.fullName == name);
                if (!plugin) return;

                plugin.api = api;
                plugin.provider = provider;
                plugin.isInitialized = true;

                let post = postInits.get(plugin.definition.fullName);
                if (!post) return;
                for (let p of post) p(plugin);
            }
        });
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

function getRiotPlugin(key: string) {
    let plugin = riotPlugins.find(p => p.definition.fullName == key);
    if (!plugin) throw new Error('Riot plugin not found: ' + key);
    return plugin;
}

function preInit(name: string, callback: RiotPluginCallback) {
    let list = preInits.get(name);
    if (!list) throw new Error('Riot plugin not found: ' + name);
    list.push(callback);
}

function postInit(name: string, callback: RiotPluginCallback) {
    let list = postInits.get(name);
    if (!list) throw new Error('Riot plugin not found: ' + name);
    list.push(callback);
}

function getRiotPluginApi(...keys: string[]): Promise<any[]> {
    if (keys.length == 1) {
        let plugin = getRiotPlugin(keys[0]);
        if (plugin.isInitialized)
            return Promise.resolve(plugin.api);
        else
            return new Promise(resolve => postInit(keys[0], p => resolve(p.api)));
    }

    return Promise.all(keys.map(key => getRiotPluginApi(key)));
}

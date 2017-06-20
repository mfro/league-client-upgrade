import {
    Plugin, PluginState,
    PluginDeclaration,
    RiotPlugin, RiotPluginCallback
} from 'base/plugin';

import * as Logging from 'base/logging';

import * as riot from './plugin-hook';

let preInits = new Map<string, RiotPluginCallback[]>();
let postInits = new Map<string, RiotPluginCallback[]>();

let plugins: Plugin<any>[] = [];
let riotPlugins: RiotPlugin[] = [];

let metadata = riot.getMetaData();

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
            plugin.setup({
                allPlugins: () => plugins,

                getPlugin, getRiotPlugin,
                preInit, postInit,
                getRiotPluginApi
            });
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

export function addPlugin<T>(declaration: PluginDeclaration<T>) {
    let plugin = new Plugin(declaration);

    if (declaration.disabled) {
        plugin.state = PluginState.DISABLED;
        Logging.log('not loading ' + declaration.name);
    }

    plugins.push(plugin);

    return plugin;
}

export function getPlugin<T>(key: string) {
    let plugin = plugins.find(p => p.definition.name == key);
    if (!plugin) throw new Error('Plugin not found: ' + key);

    return <Plugin<T>>plugin;
}

export function getRiotPlugin(key: string) {
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

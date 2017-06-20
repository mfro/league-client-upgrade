import * as PluginRunner from 'rcp-fe-plugin-runner/v1';
import * as Logging from 'base/logging';

import * as method from 'base/util/method';
import request from 'base/util/request';

interface InitCallbacks {
    preInit?: (name: string) => void,
    postInit?: (name: string, api: any, provider: PluginRunner.Provider) => void
}

interface RegistrationHandler {
    (handler: (provider: PluginRunner.Provider) => Promise<any>): void
    withAffinity?(obj: PluginAPI): void;
}

interface HookArgs {
    /** The plugin fullName */
    name: string;

    /** Callback that tells plugin-runner that it is loaded */
    load: () => void;

    /** The host document for the plugin */
    document: HTMLDocument;
}

interface AnnounceEvent extends Event {
    /** Callback to be called by the plugin to get the API provider */
    registrationHandler: RegistrationHandler;
}

interface PluginAPI {
    init(provider: PluginRunner.Provider): Promise<any>;
    destroy(): void;
    gainAffinity(): Promise<any> | void;
}

interface PendingPlugin {
    name: string;

    api: PluginAPI;

    resolve(api: PluginAPI): void;
}

let callbacks: InitCallbacks;
let pending: PendingPlugin[] = [];

function dummyFunction() { }

/** Get the riot plugin defintions */
export function getMetaData() {
    return request<PluginRunner.PluginDefinition[]>('/plugin-manager/v2/plugins').then(data => {
        //Prelease tags are used for hotfixes and stuff we don't care about
        for (let plugin of data) {
            if (!plugin.version.includes('-')) continue;
            plugin.version = plugin.version.substring(0, plugin.version.indexOf('-'));
        }

        return data;
    }).catch(error => <PluginRunner.PluginDefinition[]>[]);
}

/** Load all of the riot pending plugins */
export function load(cbs: InitCallbacks) {
    callbacks = cbs;

    pending.forEach(loadPlugin);
}

function loadPlugin(plugin: PendingPlugin) {
    callbacks.preInit && callbacks.preInit(plugin.name);

    let wrapped: PluginAPI = {
        init(provider) {
            let promise = Promise.resolve(plugin.api.init(provider))

            return promise.then(result => {
                callbacks.postInit && callbacks.postInit(plugin.name, result, provider);

                return result;
            });
        },

        destroy() {
            // Logging.log('destroy', plugin.name, ...arguments);
            return plugin.api.destroy();
        },

        gainAffinity() {
            // Logging.log('gainAffinity', plugin.name, ...arguments);
            return plugin.api.gainAffinity();
        }
    };

    plugin.resolve(wrapped);
}

function hook(args: HookArgs) {
    Logging.log('hook', args.name);

    // 1: Replace the dispatchEvent method on the plugin's document
    method.replace(args.document, 'dispatchEvent', (original, event: AnnounceEvent) => {
        if (event.type != 'riotPlugin.announce')
            return original(event);

        let oldWithAffinity = event.registrationHandler.withAffinity!;

        event.registrationHandler = init => {
            event.registrationHandler.withAffinity!({
                init,
                destroy: dummyFunction,
                gainAffinity: dummyFunction
            });
        };

        event.registrationHandler.withAffinity = api => {
            let plugin = {
                name: args.name,
                api: api,

                resolve: oldWithAffinity
            };

            if (callbacks)
                loadPlugin(plugin);
            else
                pending.push(plugin);
        };

        original(event);
    });

    args.load();
}

(<any>window).$ZhonyaHook = hook;
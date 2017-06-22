import * as PluginRunner from 'rcp-fe-plugin-runner/v1';
import * as Logging from 'logging';

import * as method from 'utility/method';
import request from 'utility/request';

export const isDisabled = localStorage.getItem('ace-disable') == 'true';

interface InitCallbacks {
    preInit?: (name: string) => void,
    postInit?: (name: string, api: any, provider: PluginRunner.Provider) => void
}

interface RegistrationHandler {
    (handler: (provider: PluginRunner.Provider) => Promise<any>): void
    withAffinity?(obj: PluginAPI): void;
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

function hook(name: string, document: HTMLDocument) {
    // 1: Replace the dispatchEvent method on the plugin's document
    method.replace(document, 'dispatchEvent', (original, event: AnnounceEvent) => {
        if (event.type != 'riotPlugin.announce')
            return original(event);

        let oldWithAffinity = event.registrationHandler.withAffinity!;

        // 2: Replace the registration handler and withAffinity methods
        event.registrationHandler = init => {
            event.registrationHandler.withAffinity!({
                init,
                destroy: dummyFunction,
                gainAffinity: dummyFunction
            });
        };

        event.registrationHandler.withAffinity = api => {
            let plugin = {
                name: name,
                api: api,

                resolve: oldWithAffinity
            };

            // 4: Either delay or load the plugin
            if (callbacks)
                loadPlugin(plugin);
            else
                pending.push(plugin);
        };

        // 3: Call the original dispatchEvent method
        original(event);
    });
}

function hookImport(node: HTMLElement) {
    if (!(node instanceof HTMLLinkElement))
        return;

    let name = node.getAttribute('data-plugin-name');
    let load = node.onload as Function;

    if (!name)
        return;

    let late = Boolean(node.import);

    if (late)
        Logging.error('too late to load', name);

    node.onload = () => {
        if (late)
            Logging.error('jk not too late', name);

        hook(name!, node.import!);
        load();
    };
}

if (!isDisabled) {
    method.before(document.head, 'appendChild', node => {
        hookImport(node);
    });

    for (let child of Array.prototype.slice.call(document.head.children))
        hookImport(child);
}
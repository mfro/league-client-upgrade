import * as PluginRunner from 'rcp-fe-plugin-runner/v1';
import * as Logging from 'zhonya/logging';

import * as method from 'zhonya/util/method';
import request from 'zhonya/util/request';

export const isDisabled =
    localStorage.getItem('ace-disable') == 'true' ||
    location.hostname != '127.0.0.1';

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

let pending: PendingPlugin[] | null = [];
let hooks = new Map<string, Map<string, Function[]>>();

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

export function hook(plugin: string, event: 'preInit', cb: (name: string) => void): void
export function hook(plugin: string, event: 'postInit', cb: (name: string, api: any, provider: PluginRunner.Provider) => void): void
export function hook(plugin: string, event: string, cb: Function) {
    let map = hooks.get(plugin);
    if (!map) hooks.set(plugin, map = new Map());

    let list = map.get(event);
    if (!list) map.set(event, list = []);

    list.push(cb);
}

/** Load all of the riot pending plugins */
export function start() {
    if (pending == null)
        throw new Error('Already started');

    let todo = pending;
    pending = null;
    todo.forEach(loadPlugin);
}

function emit(plugin: string, event: string, args: any[]) {
    let hook = hooks.get(plugin);
    if (!hook) return;

    let list = hook.get(event);
    if (!list) return;

    for (let cb of list) {
        cb(...args);
    }
}

function loadPlugin(plugin: PendingPlugin) {
    emit(plugin.name, 'preInit', [plugin.name]);

    let wrapped: PluginAPI = {
        init(provider) {
            let promise = Promise.resolve(plugin.api.init(provider))

            return promise.then(result => {
                emit(plugin.name, 'postInit', [plugin.name, result, provider]);
                hooks.delete(plugin.name);

                return result;
            });
        },

        destroy() {
            Logging.log('destroy', plugin.name, ...arguments);
            return plugin.api.destroy();
        },

        gainAffinity() {
            // Logging.log('gainAffinity', plugin.name, ...arguments);
            return plugin.api.gainAffinity();
        }
    };

    plugin.resolve(wrapped);
}

function hookDocument(name: string, document: HTMLDocument) {
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
            if (pending)
                pending.push(plugin);
            else
                loadPlugin(plugin);
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
        window.location.reload();

    node.onload = () => {
        hookDocument(name!, node.import!);
        load();
    };
}

if (!isDisabled) {
    method.before(document.head, 'appendChild', node => {
        hookImport(node);
    });

    for (let child of Array.prototype.slice.call(document.head.children)) {
        hookImport(child);
    }
}
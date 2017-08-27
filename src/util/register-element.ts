import * as method from '@/util/method';

interface HookCallback {
    (name: string, args: any): void;
}

let hooks = new Map<string, HookCallback>();

method.replace(<any>document, 'registerElement', (original, name: string, args: any) => {
    let hook = hooks.get(name);

    if (hook) {
        hook(name, args);
    }

    return original(name, args);
});

/**
 * Register a callback to be executed before a custom element is registered
 * 
 * @export
 * @param {string} name the name of the custom element to hook
 * @param {HookCallback} callback the callback
 * @returns a callback to remove the hook
 */
export default function hookElement(name: string, callback: HookCallback) {
    hooks.set(name, callback);

    return () => hooks.delete(name);
}
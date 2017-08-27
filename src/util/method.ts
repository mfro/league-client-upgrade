import * as Logging from '@/logging';

/**
 * Replace method on target object.
 * 
 * The original function can be called through the callback prepended to the arguments.
 * 
 * @export
 * @param {*} target the target object on which to replace the method
 * @param {string} method the name of the method to replace
 * @param {Function} replacement the new method
 */
export function replace<T, M extends keyof T>(target: T, method: M, replacement: (original: Function, ...args: any[]) => any) {
    const old = <Function><any>target[method];

    target[method] = <any>function (this: any, ...args: any[]) {
        const original = (...args: any[]) => old.apply(this, args)

        try {
            return replacement.call(this, original, ...args);
        } catch (x) {
            Logging.error(`Wrapper failed for ${method}.`, ...args, x);
            return original(...args);
        }
    };
}

/**
 * Add a method that executes before a method on a target object.
 * 
 * @export
 * @param {*} target the target object on which to modify the method
 * @param {string} method the name of the method to modify
 * @param {Function} first the new method
 */
export function before<T, M extends keyof T>(target: T, method: M, first: (...args: any[]) => void) {
    replace(target, method, function (original, ...args) {
        first(...args);
        return original(...args);
    });
}

/**
 * Add a method that executes after a method on a target object. The return value of the method is prepended to the arguments
 * 
 * @export
 * @param {*} target the target object on which to modify the method
 * @param {string} method the name of the method to modify
 * @param {Function} first the new method
 */
export function after<T, M extends keyof T>(target: T, method: M, then: (ret: any, ...args: any[]) => void) {
    replace(target, method, function (original, ...args) {
        let ret = original(...args);
        then(ret, ...args);
        return ret;
    });
}
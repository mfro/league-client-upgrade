function invoke(func: Function, color: string, ...args: any[]) {
    func.call(console, '%czhonya', 'color: ' + color, ...args);
}

/**
 * Log an error
 * 
 * @export
 * @param {...any[]} args
 */
export function error(...args: any[]) {
    invoke(console.debug, 'red', ...args);
}

/**
 * Log a warning
 * 
 * @export
 * @param {...any[]} args
 */
export function warn(...args: any[]) {
    invoke(console.debug, 'yellow', ...args);
}

/**
 * Log something
 * 
 * @export
 * @param {...any[]} args
 */
export function log(...args: any[]) {
    invoke(console.debug, 'black', ...args);
}
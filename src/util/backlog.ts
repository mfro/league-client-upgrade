// import * as Logging from '@/logging';

export default class Backlog {
    private _flushed = false;
    private _waiting = new Map<Function, IArguments[]>();

    /**
     * Puts a function call into the backlog
     * 
     * @param {Function} callback the function called
     * @param {IArguments} args the arguments to that function
     * @returns true if the backlog has not been flushed, and the function call should abort
     * 
     * @memberOf Backlog
     */
    put(callback: Function, args: IArguments) {
        if (this._flushed) return false;

        let list = this._waiting.get(callback);
        if (!list) this._waiting.set(callback, list = []);

        list.push(args);
        return true;
    }

    /**
     * Flushes the backlog
     * 
     * @memberOf Backlog
     */
    flush() {
        this._flushed = true;

        for (let [func, backlog] of this._waiting) {
            for (let args of backlog) {
                func(...args);
            }
        }
    }
}
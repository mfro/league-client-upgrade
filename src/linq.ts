namespace linq {
    export function first<T>(self: Iterable<T>, check?: (t: T) => boolean) {
        for (let item of self) {
            if (!check || check(item)) {
                return item;
            }
        }

        return null;
    }

    export function any<T>(self: Iterable<T>, check?: (t: T) => boolean) {
        for (let item of self) {
            if (!check || check(item)) {
                return true;
            }
        }

        return false;
    }

    export function toArray<T>(self: Iterable<T>) {
        let arr = [];
        for (let a of self) {
            arr.push(a);
        }
        return arr;
    }
}

export default linq;
declare module "rcp-fe-ember-libs/v1" {
    type ModifyObserver = (obj: any, path: string | null, target: Function | any, method?: Function | string) => void;

    interface Ember {
        run: Ember.Run;
        observer(...args: any[]): Function;

        Component: Ember.Component<any>;
        HTMLBars: any;
    }

    class Observable {
        addObserver: ModifyObserver;
        beginPropertyChanges(): Observable;
        cacheFor(keyName: string): any;
        decrementProperty(keyName: string, decrement?: number): number;
        endPropertyChanges(): Observable;
        get(keyName: string): any;
        getProperties(...args: string[]): {};
        getProperties(keys: string[]): {};
        getWithDefault(keyName: string, defaultValue: any): any;
        hasObserverFor(key: string): boolean;
        incrementProperty(keyName: string, increment?: number): number;
        notifyPropertyChange(keyName: string): Observable;
        propertyDidChange(keyName: string): Observable;
        propertyWillChange(keyName: string): Observable;
        removeObserver(key: string, target: {}, method: Function | string): void;
        set(keyName: string, value: any): Observable;
        setProperties(hash: {}): Observable;
        /**
        Set the value of a boolean property to the opposite of its current value.
        */
        toggleProperty(keyName: string): boolean;
    }

    namespace Ember {
        interface Component<Props> {
            $: JQueryStatic;
            element: HTMLElement;

            get<P extends keyof Props>(path: P): Props[P];
            _super(...args: any[]): void;

            getProperties(...args: string[]): {};
            getProperties(keys: string[]): {};
            getWithDefault(keyName: string, defaultValue: any): any;
            hasObserverFor(key: string): boolean;
            incrementProperty(keyName: string, increment?: number): number;
            notifyPropertyChange(keyName: string): Observable;
            propertyDidChange(keyName: string): Observable;
            propertyWillChange(keyName: string): Observable;
            removeObserver(key: string, target: any, method: Function | string): Observable;
            set(keyName: string, value: any): Observable;
            setProperties(hash: {}): Observable;
            toggleProperty(keyName: string): any;
            extend(...args: any[]): Ember.Component<any>;
        }

        interface Run {
            (method: Function): void;
            (target: any, method: Function): void;
            begin(): void;
            cancel(timer: any): void;
            debounce(target: any, method: Function | string, ...args: any[]): void;
            end(): void;
            join(target: any, method: Function | string, ...args: any[]): any;
            later(target: any, method: Function | string, ...args: any[]): string;
            next(target: any, method: Function | string, ...args: any[]): number;
            once(target: any, method: Function | string, ...args: any[]): number;
            schedule(queue: string, target: any, method: Function | string, ...args: any[]): void;
            scheduleOnce(queue: string, target: any, method: Function | string, ...args: any[]): void;
            sync(): void;
            throttle(target: any, method: Function | string, ...args: any[]): void;
            queues: any[];
        }
    }

    export default Ember;
}
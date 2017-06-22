declare module 'rcp-fe-common-libs/v1' {
    interface BindingFactory {
        (url: string, socket: any): Binding;
    }

    interface Binding {
        get<T>(str: string): Promise<T>;
        post<T>(str: string, data?: any): Promise<T>;
        patch<T>(str: string, data?: any): Promise<T>;
        observe<T>(str: string, callback: (value: T) => void): void;
    }
}
import { Provider } from '@';
// import * as Logging from '@/logging';

import * as CommonLibs from 'rcp-fe-common-libs/v1';

let resolve: Function;
let init = new Promise(r => resolve = r);
let socket: any;
let createBinding: CommonLibs.BindingFactory;

export function bind(endpoint: string) {
    return init.then<CommonLibs.Binding>(() => {
        let binding = createBinding(endpoint, socket);
        return binding;
    });
}

export function setup(hook: Provider) {
    hook.postInit('rcp-fe-common-libs', plugin => {
        plugin.api.getDataBinding(1).then((create: CommonLibs.BindingFactory) => {
            createBinding = create;
            socket = plugin.provider!.getSocket();

            // Logging.log('resolving observe');

            resolve();
        }, (e: any) => {
            alert(e);
        });
    });
}
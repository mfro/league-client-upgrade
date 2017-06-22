// import * as PluginRunner from 'rcp-fe-plugin-runner/v1';

// import * as Logging from './logging';

// import * as semver from 'semver';

// export class Plugin<T> {
//     api: PluginAPI & T;
//     state: PluginState;
//     definition: PluginDefinition;

//     constructor(dec: PluginDeclaration<T>) {
//         this.api = dec.api;
//         this.state = PluginState.UNINITIALIZED;
//         this.definition = dec;
//     }

//     private checkDepenency(name: string) {
//         let deps = this.definition.dependencies;
//         if (!deps || !deps.includes(name))
//             throw new Error(`${this.definition.name}: Requested undeclared dependency ${name}.`);
//         return true;
//     }

//     private checkRiotDepenency(name: string) {
//         let deps = this.definition.riotDependencies;
//         if (!deps || !deps[name])
//             throw new Error(`${this.definition.name}: Requested undeclared dependency ${name}.`);
//         return true;
//     }

//     private disable(msg: string) {
//         Logging.error(msg);
//         this.state = PluginState.DISABLED;
//         return false;
//     }

//     setup(provider: Provider) {
//         // If the plugin has already been setup, return true
//         if (this.state == PluginState.ENABLED)
//             return true;

//         // If the plugin has tried and failed to setup, return false
//         if (this.state == PluginState.DISABLED)
//             return false;

//         let riot = this.definition.riotDependencies || {};
//         for (let name in riot) {
//             let dep = provider.getRiotPlugin(name);
//             let version = riot[name];

//             if (!dep)
//                 return this.disable(`${this.definition.name}: Could not find dependency ${name}. disabling...`);

//             if (!semver.satisfies(dep.definition.version, version))
//                 return this.disable(`${this.definition.name}: Version mismatch for dependency ${name}, expected ${version}, got ${dep.definition.version}. disabling...`);
//         }

//         let dependencies = this.definition.dependencies || [];
//         for (let name of dependencies) {
//             let dep = provider.getPlugin(name);

//             if (!dep)
//                 return this.disable(`${this.definition.name}: Could not find dependency ${name}. disabling...`);

//             if (!dep.setup(provider))
//                 return this.disable(`${this.definition.name}: Dependency ${dep.definition.name} failed to setup, disabling...`);
//         }

//         try {
//             this.api.setup({
//                 allPlugins: provider.allPlugins,

//                 getPlugin: (name: string) => {
//                     this.checkDepenency(name);
//                     return provider.getPlugin(name);
//                 },

//                 getRiotPlugin: (name) => {
//                     this.checkRiotDepenency(name);
//                     return provider.getRiotPlugin(name);
//                 },

//                 preInit: (name, callback) => this.checkRiotDepenency(name) && provider.preInit(name, callback),

//                 postInit: (name, callback) => this.checkRiotDepenency(name) && provider.postInit(name, callback),

//                 getRiotPluginApi: (...keys: string[]) => {
//                     keys.forEach(a => this.checkRiotDepenency(a));
//                     return provider.getRiotPluginApi(...keys);
//                 }
//             });

//             Logging.log(`${this.definition.name}: Setup succeeded`);
//             this.state = PluginState.ENABLED;
//             return true;
//         } catch (x) {
//             Logging.error(`${this.definition.name}: Setup failed, disabling...`, x);
//             this.state = PluginState.DISABLED;
//             return false;
//         }
//     }
// }

// export interface RiotPluginCallback {
//     (plugin: RiotPlugin): void;
// }

// export interface RiotPlugin {
//     api: any;
//     provider: PluginRunner.Provider | null;
//     isInitialized: boolean;

//     definition: PluginRunner.PluginDefinition;
// }

// export interface PluginDefinition {
//     name: string;
//     disabled?: boolean;
//     description: string;
//     dependencies?: string[];
//     riotDependencies?: { [name: string]: string };
// }

// export interface PluginDeclaration<T> extends PluginDefinition {
//     api: PluginAPI & T;
// }

// export interface Provider {
//     allPlugins(): Plugin<any>[];
//     getPlugin(key: string): Plugin<any>;
//     getRiotPlugin(key: string): RiotPlugin;

//     preInit(key: string, callback: RiotPluginCallback): void;
//     postInit(key: string, callback: RiotPluginCallback): void;

//     getRiotPluginApi(key: string): Promise<any>;
//     getRiotPluginApi(...keys: string[]): Promise<any[]>;
// }

// export enum PluginState {
//     UNINITIALIZED,
//     ENABLED,
//     DISABLED
// }

// interface PluginAPI {
//     setup: (provider: Provider) => void;
// }
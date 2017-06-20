import { Provider } from 'base/plugin';

import Backlog from 'base/util/backlog';

// import l10nInjector from 'base/plugins/l10n-injector';

// import Vue from 'vue';

import BooleanSetting from './boolean';
// import PluginList from './plugin-list';

let rcpSettings: any;

const default_category = 'lol-general';
// const settings_namespace = 'zhonya-settings';

const init_backlog = new Backlog();

export function addBoolean(one: string, two: string, three: string | boolean, four?: boolean) {
    if (init_backlog.put(addBoolean, arguments)) return;

    let key: string, label: string, category: string, fallback: boolean;

    if (four === undefined) {
        key = one;
        label = two;
        fallback = <boolean>three;
        category = default_category;
    } else {
        category = one;
        key = two;
        label = <string>three;
        fallback = four;
    }

    return new BooleanSetting(key, label, rcpSettings, category);
}

// export function addCategory(name: string, label: string, after?: string) {
//     if (init_backlog.put(addCategory, arguments)) return;
    
//     // Create a localization key for the property label and inject it
//     let titleKey = 'zhonya_settings_' + name;
//     l10n.add(titleKey, label);

//     // Get the category manager from the rcp-fe-settings api
//     let categoryManager = rcpSettings._settingsManager._settingsCategoryManager;

//     // Get the 'GENERAL' category which is always present
//     let general = categoryManager.categories.find((c: any) => c.name == 'lol-general');

//     // Use it's prototype to create our own category
//     let proto = Object.getPrototypeOf(general);
//     let category = new proto.constructor({
//         name: name,
//         titleKey: titleKey,

//         components: [],
//         group: general.group,

//         canReset: false,
//         requireLogin: false,
//     });

//     // Add it to both the category manager and the 'CLIENT' category group
//     categoryManager.categories.push(category);
//     if (after == null) {
//         general.group.categories.push(category)
//     } else {
//         let index = general.group.categories.findIndex((c: any) => c.name == after);
//         general.group.categories.splice(index + 1, 0, category);
//     }
// }

export function setup(hook: Provider) {
    // addCategory(default_category, 'EXTRA SETTINGS', 'lol-general');

    hook.postInit('rcp-fe-lol-settings', plugin => {
        rcpSettings = plugin.api;

        init_backlog.flush();

        // let context = rcpSettings.registerSettings(settings_namespace, default_category, 1, 'local');
        // context.setRenderer(() => {
        //     let all = hook.allPlugins();
        //     let vue = new Vue({
        //         mixins: [PluginList],
        //         data() { return { plugins: all }; }
        //     });
        //     vue.$mount();
        //     return vue.$el;
        // });
    });
}
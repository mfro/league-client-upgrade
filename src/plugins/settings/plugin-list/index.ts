import { Plugin, PluginState } from 'zhonya';

import Vue from 'vue';

// import * as Layout from './layout.vue';

interface Data {
    plugins: Plugin<any>[];
}

export default <Vue.ComponentOptions<Data & Vue>>{
    // mixins: [Layout],

    methods: {
        isEnabled(plugin: Plugin<any>) {
            return plugin.state == PluginState.ENABLED;
        },

        getState(plugin: Plugin<any>) {
            switch (plugin.state) {
                case PluginState.DISABLED: return 'Disabled';
                case PluginState.ENABLED: return 'Enabled';
                case PluginState.UNINITIALIZED: return 'Not initialized';
            }
        }
    }
}
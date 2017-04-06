<template>
    <div class="plugin-list">
        <div class="plugin" v-for="plugin in plugins">
            <div class="plugin-header">
                <span class="name">{{ plugin.definition.name }}</span>
                <span class="version">v{{ plugin.definition.version }}</span>
                <span class="status" v-if="!isEnabled(plugin)">(Inactive)</span>
            </div>

            <div class="plugin-properties">
                <div class="property">
                    <span class="name">Description:</span>
                    <span class="content">{{ plugin.definition.description }}</span>
                </div>
                <!--<div class="property">
                    <span class="name">State:</span>
                    <span class="content">{{ getState(plugin) }}</span>
                </div>-->
                <div class="property">
                    <span class="name">Dependencies:</span>
                    <span class="content">
                        {{ Object.keys(plugin.definition.dependencies || {}).length }} dependencies,
                        {{ Object.keys(plugin.definition.riotDependencies || {}).length }} built-in dependencies
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default { };
</script>

<style scoped lang="less">
    .plugin-list {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .plugin {
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
    }

    .plugin-header {
        display: flex;
        border-bottom: 1px solid #1e282d;
        padding: 5px 0;

        .name, .version, .status {
            padding-left: 5px;
            color: #f0e6d2;
            font-family: 'LoL Display';
            text-transform: uppercase;
            font-size: 16px;
        }

        .version {
            color: #afafae;
        }

        .status {
            color: #8e897f;
            font-size: italic;
        }
    }

    .plugin-properties {
        padding-top: 10px;
    }
    
    .property {
        padding: 0 5px;
        font-family: 'LoL Body';
        line-height: 16px;
        font-size: 14px;

        .name {
            color: #a09b8c;
        }

        .content {
            color: #fbf6e3;
            padding-left: 5px;
        }
    }
</style>
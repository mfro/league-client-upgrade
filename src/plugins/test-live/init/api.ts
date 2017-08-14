import Raven from 'raven-js';

import { Provider } from 'zhonya';

import request from 'zhonya/util/request';

import central from 'zhonya/plugins/test-live/central';

export function setup(hook: Provider) {
    Promise.all([
        '/system/v1/builds',
        '/riotclient/machine-id',
        '/riotclient/system-info/v1/basic-info',
        '/patcher/v1/executable-version',
        '/performance/v1/system-info',
    ].map(url => request<any>(url))).then(args => {
        let os = args[2].operatingSystem;
        let lines = [
            `LCU ${args[0].branch} on ${os.platform} ${os.versionMajor} ${os.edition}`,
            `Machine id: ${args[1]}`,
            `Version: ${args[0].branchFull} (${args[0].version}) (${args[3]})`,
            `CPU: ${args[4].CPUName}`,
            `GPU: ${args[4].GPUName}`,
        ];

        central.api.patchUser({
            id: args[1]
        });

        Raven.captureMessage(lines.join('\n'), {
            level: 'info',
            extra: {
                builds: args[0],
                machineId: args[1],
                systemInfo: args[2],
                patchedVersion: args[3],
                performanceInfo: args[4],
            },
        });
    });
}
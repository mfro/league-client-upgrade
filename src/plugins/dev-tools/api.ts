import { Provider } from 'base/plugin';
import request from 'base/util/request';
import * as Logging from 'base/logging';

if (location.search == '?mfro-devtool-inject') {
    request<any[]>('http://localhost:8888/json').then(list => {
        list = list.filter(a => a.url != 'about:blank');

        if (list.length != 1) {
            Logging.warn('found multiple pages', list);
            return;
        }

        let page = list[0];
        window.top.postMessage({
            type: 'mfro-devtools-json',
            page: page
        }, '*');;
    });
}

let frame: HTMLIFrameElement | null = null;
let devtoolsUrl: any = null;

function create() {
    if (devtoolsUrl != null)
        return open();

    if (frame != null)
        return;

    frame = document.createElement('iframe');
    frame.src = 'http://localhost:8888/?mfro-devtool-inject';
    frame.style.display = 'none';
    document.body.appendChild(frame);
}

function open() {
    let win = window.open('about:blank', 'popoutChatWindow', 'left=100,top=100,width=100,height=100');

    win.riotInvoke({
        request: JSON.stringify({
            name: "Window.ResizeTo",
            params: [1280, 1040]
        })
    });

    win.riotInvoke({
        request: JSON.stringify({
            name: "Window.CenterToScreen",
            params: []
        })
    });

    win.riotInvoke({
        request: JSON.stringify({
            name: "Window.Show",
            params: []
        })
    });

    win.location.href = devtoolsUrl;
}

export function setup(hook: Provider) {
    window.addEventListener('message', e => {
        if (e.data.type == 'mfro-devtools-json') {
            devtoolsUrl = 'http://localhost:8888' + e.data.page.devtoolsFrontendUrl;

            open();
            return;
        }
    });

    window.addEventListener('keydown', e => {
        if (e.keyCode == 123) create();
    });
}
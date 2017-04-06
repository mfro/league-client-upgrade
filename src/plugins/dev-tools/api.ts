import { Provider } from 'base/plugin';
import request from 'base/util/request';
import * as Logging from 'base/logging';

// import * as style from './style.less';

// if (location.host == 'localhost:8888') {
//     style();
// }

function create() {
    request<any[]>('http://localhost:8888/json').then(list => {
        list = list.filter(a => a.url != 'about:blank');

        if (list.length != 1) {
            Logging.warn('found multiple pages', list);
            return;
        }

        let page = list[0];
        window.open('http://localhost:8888' + page.devToolsFrontendUrl);        
    });
    // let win = window.open('about:blank', 'popoutChatWindow', 'left=100,top=100,width=100,height=100');

    // win.riotInvoke({
    //     request: JSON.stringify({
    //         name: "Window.ResizeTo",
    //         params: [1280, 1040]
    //     })
    // });

    // win.riotInvoke({
    //     request: JSON.stringify({
    //         name: "Window.CenterToScreen",
    //         params: []
    //     })
    // });

    // win.riotInvoke({
    //     request: JSON.stringify({
    //         name: "Window.Show",
    //         params: []
    //     })
    // });

    // win.location.href = 'http://localhost:8888/';
    // Logging.log('devtools', win);
}

export function setup(hook: Provider) {
    window.addEventListener('keydown', e => {
        console.log(e.keyCode);

        if (e.keyCode == 123) create();
    });
}
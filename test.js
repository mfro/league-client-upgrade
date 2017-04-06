const request = require('request');
const opn = require('opn');

const base = 'http://localhost:8888';

request(base + '/json/list', (e, res, body) => {
    let list = JSON.parse(body);
    list = list.filter(a => a.url != 'about:blank');
    if (list.length != 1) {
        console.warn('found multiple pages', list);
        return;
    }

    let page = list[0];
    opn(base + page.devtoolsFrontendUrl);
});
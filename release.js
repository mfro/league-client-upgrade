const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const exec = require('child_process').exec;

const webpack = require('webpack');
const getConfig = require('./webpack.config');

const dst = path.join(__dirname, './releases/');

let version;

function start() {
    fs.readFile(path.join(__dirname, 'package.json'), (err, data) => {
        let pack = JSON.parse(data.toString('utf8'));
        version = pack.version;

        check();
    });
}

function check() {
    fs.exists(path.join(dst, version), exists => {
        if (exists) {
            console.error(`Version ${version} already created`);
            return;
        }

        create();
    });
}

function create() {
    let config = getConfig('prod');

    webpack(config, (err, stats) => {
        if (err) return console.error(err);
        if (stats.hasErrors()) {
            return console.error(stats.toString({ colors: true }));
        }

        copy();
    });
}

function copy() {
    fs.readFile(path.join(__dirname, 'build/bundle.js'), (err, data) => {
        const hash = crypto.createHash('sha256').update(data).digest('hex');

        let metadata = {
            version: version,
            content: 'bundle.js',
            release_date: new Date(),
            sha256: hash
        };
        let metadataBuffer = Buffer.from(JSON.stringify(metadata, undefined, '  '));

        fs.mkdir(path.join(dst, version), err => {
            fs.writeFile(path.join(dst, version, 'metadata.json'), metadataBuffer, e => e && console.error(e));
            fs.writeFile(path.join(dst, version, 'bundle.js'), data, e => e && console.error(e));

            latest();
        });
    });
}

function latest() {
    let latest = JSON.stringify({
        version: version,
        directory: '/my-ace/' + version
    }, undefined, '  ');

    fs.writeFile(path.join(dst, 'latest.json'), Buffer.from(latest), e => e && console.error(e));
}

start();
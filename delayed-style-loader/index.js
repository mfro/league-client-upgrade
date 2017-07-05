const loaderUtils = require('loader-utils');

module.exports = function (content) { }
module.exports.pitch = function (remaining, preceding) {
    return `//delayed-style-loader: like style-loader, but delayed
const styles = require(${loaderUtils.stringifyRequest(this, '!!' + remaining)});
const content = styles.toString();

module.exports = function(doc) {
    doc = doc || document;
    const node = doc.createElement('style');
    node.innerHTML = content;
    doc.head.appendChild(node);
    return node;
};`
}
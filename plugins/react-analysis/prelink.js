const attachToAndroid = require('./attachToAndroid');
const attachToAIOS = require('./attachToIOS');

const _SELF = {};

_SELF.install = function() {
    attachToAndroid();
    attachToAIOS();
};

_SELF.install();


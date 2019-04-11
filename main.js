console.log = console.info = console.debug = console.error = function () {};

// var GATEKEEPER_KEY = '35ae5b7bf8f0ff2613134935ce6b4c1e';
var BASE_CONFIG_URL = 'https://cdn.jsdelivr.net/gh/rbrtmrtn/mapboard-base-config@d9892943dc4df94ba2b1e51dbe2aeb0b0bcd4aab/config.js';

Mapboard.default({
  baseConfig: BASE_CONFIG_URL,
  cyclomedia: {
    enabled: true
  },
});

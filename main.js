console.log = console.info = console.debug = console.error = function () {};

// var GATEKEEPER_KEY = '35ae5b7bf8f0ff2613134935ce6b4c1e';
var BASE_CONFIG_URL = 'https://cdn.jsdelivr.net/gh/ajrothwell/mapboard-base-config@f1802a4bef28265e2add0e94ce823852a5341ad6/config.js';

Mapboard.default({
  baseConfig: BASE_CONFIG_URL,
  cyclomedia: {
    enabled: true
  },
});

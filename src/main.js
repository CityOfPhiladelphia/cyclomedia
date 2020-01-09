import Vue from 'vue';
import axios from 'axios';
import createStore from './store';
import configMixin from './util/config-mixin';
import mergeDeep from './util/merge-deep';

import * as faAll from './fa.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import controllerMixin from '@philly/vue-datafetch/src/controller.js';

// import eventBusMixin from './util/event-bus-mixin';
// import CyclomediaWidget from '@philly/vue-mapping/src/cyclomedia/Widget.vue';
import router from './router';
import App from './components/App.vue';

import 'phila-standards/dist/css/phila-app.min.css';
import 'leaflet/dist/leaflet.css';

let pictApiKey, pictSecretKey;
const host = window.location.hostname;
if (host === 'atlas-dev.phila.gov.s3-website-us-east-1.amazonaws.com') {
  pictApiKey = process.env.VUE_APP_ATLASDEV_PICTOMETRY_API_KEY;
  pictSecretKey = process.env.VUE_APP_ATLASDEV_PICTOMETRY_SECRET_KEY;
} else {
  pictApiKey = process.env.VUE_APP_PICTOMETRY_API_KEY;
  pictSecretKey = process.env.VUE_APP_PICTOMETRY_SECRET_KEY;
}

const clientConfig = {
  app: {
    title: 'Cyclomedia',
    tagLine: '',
  },
  cyclomedia: {
    enabled: true,
    orientation: 'vertical',
    measurementAllowed: false,
    popoutAble: true,
    recordingsUrl: 'https://atlas.cyclomedia.com/Recordings/wfs',
    username: process.env.VUE_APP_CYCLOMEDIA_USERNAME,
    password: process.env.VUE_APP_CYCLOMEDIA_PASSWORD,
    apiKey: process.env.VUE_APP_CYCLOMEDIA_API_KEY,
  },
  pictometry: {
    enabled: true,
    orientation: 'horizontal',
    iframeId: 'pictometry-ipa',
    apiKey: pictApiKey,
    secretKey: pictSecretKey,
  },
  geocoder: {
    url: function (input) {
      var inputEncoded = encodeURIComponent(input);
      return 'https://api.phila.gov/ais/v1/search/' + inputEncoded;
    },
    params: {
      gatekeeperKey: process.env.VUE_APP_GATEKEEPER_KEY,
      include_units: true,
      opa_only: true,
    },
  },
  geolocation: {
    enabled: true,
    icon: [ 'far', 'dot-circle' ],
  },
  router: {
    enabled: true,
    type: 'vue',
  },
  addressInput: {
    width: 350,
    mapWidth: 300,
    // position: 'right',
    autocompleteEnabled: false,
    autocompleteMax: 15,
    placeholder: 'Search for an address',
  },
  map: {
    shouldInitialize: false,
    zoom: 13,
  },
}

// const baseConfigUrl = null;
const baseConfigUrl = 'https://cdn.jsdelivr.net/gh/cityofphiladelphia/pde_base_config@3cb644750f4db8619a5b41f5369d1e280678f7bb/config.js';

function initVue(config) {
  // const baseConfigUrl = clientConfig.baseConfig;
  // make config accessible from each component via this.$config
  Vue.use(configMixin, config);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

  // create store
  const store = createStore(config);

  Vue.use(controllerMixin, { config, store, router });

  // mount main vue
  const vm = new Vue({
    el: config.el || '#vue-app',
    render: (h) => h(App),
    router,
    store,
  });

}

// if there is a base config, get base config
if (baseConfigUrl) {
  axios.get(baseConfigUrl).then(response => {
    // console.log('axios getting base config, clientConfig:', clientConfig);
    const data = response.data;
    // parse raw js. yes, it's ok to use eval :)
    // http://stackoverflow.com/a/87260/676001
    const baseConfigFn = eval(data);
    const baseConfig = baseConfigFn({ gatekeeperKey: process.env.VUE_APP_GATEKEEPER_KEY });

    // deep merge base config and client config
    //const config = mergeDeep(clientConfig, baseConfig);
    const config = mergeDeep(baseConfig, clientConfig);
    // console.log('data:', data, 'baseConfig:', baseConfig, 'clientConfig:', clientConfig, 'config:', config);

    initVue(config);
  }).catch(err => {
    console.error('Error loading base config:', err);
  });
} else {
  initVue(clientConfig);
}

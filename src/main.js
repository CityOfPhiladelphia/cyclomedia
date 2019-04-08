
var GATEKEEPER_KEY = '35ae5b7bf8f0ff2613134935ce6b4c1e';
var BASE_CONFIG_URL = 'https://cdn.jsdelivr.net/gh/cityofphiladelphia/mapboard-default-base-config@d3ad38f050cf55b4ab0dc2ff68e6f18025690246/config.js';
import mapboard from '@philly/mapboard/src/main.js';
import map from './general/map';
// import transforms from './general/transforms';
import parcels from './general/parcels';
import legendControls from './general/legendControls';
import imageOverlayGroups from './general/imageOverlayGroups';
import greeting from './general/greeting';

import property from './topics/property';



let pictApiKey, pictSecretKey;
const host = window.location.hostname;
if (host === 'cityatlas-dev.phila.gov') {
  pictApiKey = process.env.VUE_APP_DEV_PICTOMETRY_API_KEY;
  pictSecretKey = process.env.VUE_APP_DEV_PICTOMETRY_SECRET_KEY;
} else {
  pictApiKey = process.env.VUE_APP_PICTOMETRY_API_KEY;
  pictSecretKey = process.env.VUE_APP_PICTOMETRY_SECRET_KEY;
}

mapboard({
  // defaultAddress: '1234 MARKET ST',
  // plugin: true,
  panels: [
    // 'topics',
    'map'
  ],
  router: {
    enabled: true
  },
  defaultAddressTextPlaceholder: {
    // text: "Search Address or 9-digit OPA Property Number",
    wideStyle: {
      'max-width': '100%',
      'font-size': '24px',
      'line-height': '28px'
    },
    narrowStyle: {
      'max-width': '100%',
      'font-size': '20px',
      'line-height': '24px'
    }
  },
  geolocation: {
    enabled: true,
    icon: ['far', 'dot-circle']
  },
  addressInput: {
    width: 415,
    mapWidth: 300,
    position: 'right',
    autocompleteEnabled: false,
    autocompleteMax: 15,
    placeholder: 'Search the map',
  },
  rootStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gatekeeperKey: GATEKEEPER_KEY,
  map,
  baseConfig: BASE_CONFIG_URL,
  parcels,
  imageOverlayGroups,
  legendControls,
  cyclomedia: {
    enabled: true,
    measurementAllowed: false,
    popoutAble: true,
    recordingsUrl: 'https://atlas.cyclomedia.com/Recordings/wfs',
    username: process.env.VUE_APP_CYCLOMEDIA_USERNAME,
    password: process.env.VUE_APP_CYCLOMEDIA_PASSWORD,
    apiKey: process.env.VUE_APP_CYCLOMEDIA_API_KEY,
  },
  pictometry: {
    enabled: false,
    iframeId: 'pictometry-ipa',
    apiKey: pictApiKey,
    secretKey: pictSecretKey,
  },
  // transforms,
  greeting,
  // dataSources: {
  //   threeOneOneCarto,
  //   condoList,
  //   crimeIncidents,
  //   divisions,
  //   dorCondoList,
  //   dorDocuments,
  //   electedOfficials,
  //   liBusinessLicenses,
  //   liInspections,
  //   liPermits,
  //   liViolations,
  //   nearbyZoningAppeals,
  //   nextElectionAPI,
  //   opa,
  //   pollingPlaces,
  //   rco,
  //   regmaps,
  //   vacantIndicatorsPoints,
  //   zoningAppeals,
  //   zoningBase,
  //   zoningDocs,
  //   zoningOverlay,
  //   // charterSchools,
  //   // neighboringProperties,
  // },
  topics: [
    property,
  //   condos,
  //   deeds,
  //   li,
  //   zoning,
  //   // polling,
  //   // rcoTopic,
  //   voting,
  //   nearby,
  ],
  components: [
    {
      type: 'topic-set',
      options: {
        defaultTopic: 'property'
      }
    },
  ],
});

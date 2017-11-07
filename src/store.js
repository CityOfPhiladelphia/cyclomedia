import Vue from 'vue';
import Vuex from 'vuex';

// when you load vuex from a script tag this seems to happen automatically
// Vue.use(Vuex);

function createStore(config) {

  const initialState = {
    // activeTopic: defaultTopic.key,
    // the ais feature
    geocode: {
      status: null,
      data: null
    },
    // the leaflet map object
    map: {
      center: config.map.center,
      zoom: config.map.zoom,
      map: null,
      bounds: null,
      // basemap: defaultTopic.basemap,
      // features: {
      //   markers: [
      //     // {
      //     //   geometry: '',
      //     //   // optional - mainly for symbology
      //     //   options: {}
      //     // }
      //   ],
      //   polygons: [
      //
      //   ]
      // }
    },
    dorParcels: [],
    pwdParcel: null,
    // sources,
    cyclomedia: {
      active: false,
      viewer: null,
      recordings: [],
      locFromApp: null,
      locFromViewer: null,
    },
    // we need this to know whether or not to force an update on the first show
    pictometry: {
      ipa: null,
      active: false,
      shapeIds: [],
      pngMarkerIds: [],
    },
    activeFeature: null,
    lastSearchMethod: null
  };

  // TODO standardize how payloads are passed around/handled
  return new Vuex.Store({
    state: initialState,
    getters: {},
    mutations: {
      setActiveTopic(state, payload) {
        state.activeTopic = payload.topic;
      },
      setSourceStatus(state, payload) {
        const key = payload.key;
        const status = payload.status;

        // if a target id was passed in, set the status for that target
        const targetId = payload.targetId;

        if (targetId) {
          state.sources[key].targets[targetId].status = status;
        } else {
          state.sources[key].status = status;
        }
      },
      setSourceData(state, payload) {
        const key = payload.key;
        const data = payload.data;

        // if a target id was passed in, set the data object for that target
        const targetId = payload.targetId;

        if (targetId) {
          state.sources[key].targets[targetId].data = data;
        } else {
          state.sources[key].data = data;
        }
      },
      // this sets empty targets for a data source
      createEmptySourceTargets(state, payload) {
        const {key, targetIds} = payload;
        state.sources[key].targets = targetIds.reduce((acc, targetId) => {
          acc[targetId] = {
            status: null,
            data: null
          };
          return acc;
        }, {});
      },
      clearSourceTargets(state, payload) {
        const key = payload.key;
        state.sources[key].targets = {};
      },
      setMap(state, payload) {
        state.map.map = payload.map;
      },
      setMapBounds(state, payload) {
        state.map.bounds = payload.bounds
      },
      setMapCenter(state, payload) {
        state.map.center = payload;
      },
      setMapZoom(state, payload) {
        state.map.zoom = payload
      },
      setDorParcels(state, payload) {
        state.dorParcels = payload;
      },
      setPwdParcel(state, payload) {
        state.pwdParcel = payload;
      },
      setGeocodeStatus(state, payload) {
        state.geocode.status = payload;
      },
      setGeocodeData(state, payload) {
        state.geocode.data = payload;
      },
      setBasemap(state, payload) {
        state.map.basemap = payload;
      },
      setPictometryActive(state, payload) {
        if (!config.pictometry.enabled) {
          return;
        }
        state.pictometry.active = payload;
      },
      setCyclomediaActive(state, payload) {
        if (!config.cyclomedia.enabled) {
          return;
        }
        state.cyclomedia.active = payload;
      },
      setCyclomediaViewer(state, payload) {
        state.cyclomedia.viewer = payload;
      },
      setCyclomediaRecordings(state, payload) {
        state.cyclomedia.recordings = payload;
      },
      setCyclomediaLocFromApp(state, payload) {
        state.cyclomedia.locFromApp = payload;
      },
      setCyclomediaLocFromViewer(state, payload) {
        state.cyclomedia.locFromViewer = payload;
      },
      setActiveFeature(state, payload) {
        state.activeFeature = payload;
      },
      setLastSearchMethod(state, payload) {
        state.lastSearchMethod = payload;
      },
      setPictometryIpa(state, payload) {
        state.pictometry.ipa = payload;
      },
      setPictometryShapeIds(state, payload) {
        state.pictometry.shapeIds = payload;
      },
      setPictometryCameraIds(state, payload) {
        state.pictometry.cameraIds = payload;
      },
    }
  });
}

export default createStore;

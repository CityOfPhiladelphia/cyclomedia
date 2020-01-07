import Vue from 'vue';
import Vuex from 'vuex';
import pvdStore from '@philly/vue-datafetch/src/store';
import pvmStore from '@philly/vue-mapping/src/store';
import pvcStore from '@philly/vue-comps/src/store';
import mergeDeep from './util/merge-deep';

// when you load vuex from a script tag this seems to happen automatically
Vue.use(Vuex);

function createStore(config) {
  const initialState = {
    windowDimensions: {
      height: 0,
      width: 0,
    },
    fullScreen: {
      mapOnly: false,
      cycloOnly: false,
    },
    fullScreenMapEnabled: false,
    fullScreenCycloEnabled: true,
  };
  const mb = {
    state: initialState,
    getters: {},
    mutations: {
      setCandidates(state, payload) {
        state.candidates = payload;
      },
      setWindowDimensions(state, payload) {
        state.windowDimensions = payload;
      },
      setMapOnly(state, payload) {
        state.fullScreen.mapOnly = payload;
      },
      setCycloOnly(state, payload) {
        state.fullScreen.CycloOnly = payload;
      },
      setFullScreenMapEnabled(state, payload) {
        state.fullScreenMapEnabled = payload;
      },
      setFullScreenCycloEnabled(state, payload) {
        state.fullScreenCycloEnabled = payload;
      },
    }
  };

  let mergeStore = mergeDeep(pvcStore, pvdStore.store);
  mergeStore = mergeDeep(mergeStore, pvmStore);
  mergeStore = mergeDeep(mergeStore, mb);

  return new Vuex.Store({
    state: mergeStore.state,
    getters: mergeStore.getters,
    mutations: mergeStore.mutations,
  });
}

export default createStore;

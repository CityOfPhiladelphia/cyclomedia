import Vue from 'vue';
import Vuex from 'vuex';
import pvdStore from '@philly/vue-datafetch/src/store';
import pvmStore from '@philly/vue-mapping/src/store';
import pvcStore from '@philly/vue-comps/src/store';
import mergeDeep from './util/merge-deep';

// when you load vuex from a script tag this seems to happen automatically
Vue.use(Vuex);

function createStore(config) {
  const initialState = {};
  const mb = {
    state: initialState,
    getters: {},
    mutations: {
      setCandidates(state, payload) {
        state.candidates = payload;
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

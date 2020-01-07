<template>
  <div
    id="app"
    class="grid-y"
  >
  <!-- :class="openModal" -->
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine"
    >
    <!-- :app-logo="appLogo"
    :app-logo-alt="this.$config.app.logoAlt" -->
      <!-- <div slot="mobile-menu">
        <PhilaFooter
          @howToUseLink="toggleModal()"
        />
      </div> -->
    </PhilaHeader>

    <div
      id="root-container"
      class="surrounding-div grid-x"
    >
      <!-- <full-screen-map-toggle-tab/> -->
      <div class="small-24 medium-12">
        <map_
          id="map-tag"
          :center="this.$store.state.map.center"
          :zoom="this.$store.state.map.zoom"
          attribution-position="bottomleft"
          zoom-control-position="bottomleft"
          :min-zoom="this.$config.map.minZoom"
          :max-zoom="this.$config.map.maxZoom"
          @l-moveend="handleMapMove"
        >
        <!-- @l-click="handleMapClick"
        <!-- basemaps -->

          <esri-tiled-map-layer
            v-for="(basemap, key) in this.$config.map.basemaps"
            v-if="activeBasemap === key"
            :key="key"
            :url="basemap.url"
            :max-zoom="basemap.maxZoom"
            :attribution="basemap.attribution"
          />

          <!-- basemap labels and parcels outlines -->
          <esri-tiled-map-layer
            v-for="(tiledLayer, key) in this.$config.map.tiledLayers"
            v-if="tiledLayers.includes(key)"
            :key="key"
            :url="tiledLayer.url"
            :z-index="tiledLayer.zIndex"
            :attribution="tiledLayer.attribution"
          />

          <cyclomedia-recording-circle
            v-for="recording in cyclomediaRecordings"
            v-if="cyclomediaActive"
            :key="recording.imageId"
            :image-id="recording.imageId"
            :latlng="[recording.lat, recording.lng]"
            :size="1.2"
            :color="'#3388ff'"
            :weight="1"
            @l-click="handleCyclomediaRecordingClick"
          />

        </map_>
      </div>

      <!-- slot="cycloWidget"
      screen-percent="2" -->
      <cyclomedia-widget
        :orientation="this.$config.cyclomedia.orientation"
        @cyclomedia-widget-mounted="initializeCyclomedia"
      >
        <full-screen-toggle-tab
          :event="'toggle-tab-click'"
          @toggle-tab-click="toggleTest"
        />
        <!-- :toggleFunction="toggleFunction" -->
        <address-input
          :width-from-config="this.$config.addressInput.width"
          :placeholder="this.$config.addressInput.placeholder"
          class='address-input'
          @handle-search-form-submit="handleSearchFormSubmit"
        />
      </cyclomedia-widget>
    </div>
  </div>
</template>

<script>
import PhilaHeader from './PhilaHeader.vue';
import PhilaFooter from './PhilaFooter.vue';

import Map_ from '@philly/vue-mapping/src/leaflet/Map.vue';
import FullScreenToggleTab from '@philly/vue-mapping/src/components/FullScreenToggleTab.vue';
import FullScreenMapToggleTab from '@philly/vue-mapping/src/components/FullScreenMapToggleTab.vue';

import CyclomediaRecordingsClient from '@philly/vue-mapping/src/cyclomedia/recordings-client.js';

import cyclomediaMixin from '@philly/vue-mapping/src/cyclomedia/map-panel-mixin.js';

// let toggleFunction = function() {
//   console.log('toggleFunction is running');
// }

export default {

  components: {
    PhilaHeader,
    PhilaFooter,
    Map_,
    FullScreenToggleTab,
    FullScreenMapToggleTab,
    AddressInput: () => import(/* webpackChunkName: "mbmp_pvc_AddressInput" */'@philly/vue-comps/src/components/AddressInput.vue'),
    CyclomediaWidget: () => import(/* webpackChunkName: "mbmb_pvm_CyclomediaWidget" */'@philly/vue-mapping/src/cyclomedia/Widget.vue'),
    EsriTiledMapLayer: () => import(/* webpackChunkName: "mbmp_pvm_EsriTiledMapLayer" */'@philly/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
    CyclomediaRecordingCircle: () => import(/* webpackChunkName: "mbmp_pvm_CyclomediaRecordingCircle" */'@philly/vue-mapping/src/cyclomedia/RecordingCircle.vue'),
  },
  mixins: [
    cyclomediaMixin,
  ],
  created() {
    this.$cyclomediaRecordingsClient = new CyclomediaRecordingsClient(
      this.$config.cyclomedia.recordingsUrl,
      this.$config.cyclomedia.username,
      this.$config.cyclomedia.password,
      4326,
    );
  },
  mounted() {
    console.log('app mounted, this.$config:', this.$config, 'this.$route:', this.$route);
    this.handleWindowResize();
    if (this.$route.query.address) {
      this.$controller.handleSearchFormSubmit(this.$route.query.address);
    } else if (this.$route.query.lat) {
      this.$store.commit('setCyclomediaLatLngFromMap', [parseFloat(this.$route.query.lat), parseFloat(this.$route.query.lng)]);
    }
    this.handleMapMove();
  },
  watch: {
    geocodeCoordinates() {
      this.$store.commit('setCyclomediaLatLngFromMap', [this.$store.state.geocode.data.geometry.coordinates[1], this.$store.state.geocode.data.geometry.coordinates[0]]);
    },
  },
  computed: {
    // toggleFunction() {
    //   let test = function() {
    //     console.log('toggleFunction is running, this.$store:', this.$store);
    //     store.commit('setFullScreenCycloEnabled', store.state.fullScreenCycloEnabled);
    //   }
    //   return test;
    // },
    geocodeCoordinates() {
      let value;
      if (this.$store.state.geocode.data) {
        value = this.$store.state.geocode.data.geometry.coordinates;
      } else {
        value = null;
      }
      return value;
    },
    activeBasemap() {
      return 'pwd';
    },
    tiledLayers() {
      return [ 'cityBasemapLabels' ];
    },
  },
  methods: {
    toggleTest(e) {
      console.log('toggleTest is running, this.$store', this.$store, 'e:', e);
      this.$store.commit('setFullScreenCycloEnabled', !this.$store.state.fullScreenCycloEnabled);
    },
    initializeCyclomedia() {
      // console.log('app initializeCyclomedia is running');
      this.$store.commit('setCyclomediaInitializationBegun', true);
      this.$store.commit('setCyclomediaActive', true);
    },
    handleSearchFormSubmit(value) {
      // console.log('App.vue handleSearchFormSubmit is running');
      this.$controller.handleSearchFormSubmit(value);
    },
    handleMapMove(e) {
      // console.log('handleMapMove is firing')
      const map = this.$store.state.map.map;
      const center = map.getCenter();
      const { lat, lng } = center;
      const coords = [ lng, lat ];

      const cyclomediaConfig = this.$config.cyclomedia || {};

      if (cyclomediaConfig.enabled) {
        // update cyclo recordings
        this.updateCyclomediaRecordings();
        this.$store.commit('setCyclomediaLatLngFromMap', [ lat, lng ]);
      }
    },
    handleWindowResize() {
      // console.log('Mapboard.vue handleWindowResize is running');
      // this only actually affects the size if it is set to "plugin mode"
      if (this.$config.plugin) {
        if (this.$config.plugin.enabled) {
          this.mbRootStyle.height = this.$config.plugin.height.toString() + 'px';
          // return;
        }
      }

      if (window.innerWidth >= 750) {
        // this.mbRootStyle.height = '600px'
      } else {
        this.mbRootStyle.height = 'auto';
      }

      const rootElement = document.getElementById('root-container');
      const rootStyle = window.getComputedStyle(rootElement);
      const rootWidth = rootStyle.getPropertyValue('width');
      const rootHeight = rootStyle.getPropertyValue('height');
      const rootWidthNum = parseInt(rootWidth.replace('px', ''));
      const rootHeightNum = parseInt(rootHeight.replace('px', ''));

      const dim = {
        width: rootWidthNum,
        height: rootHeightNum,
      };
      this.$store.commit('setWindowDimensions', dim);
    },
  }
}
</script>

</script>

<style lang="scss">
@import "@/scss/global.scss";

.surrounding-div {
  height: 100%;
}

.toggle-map{
  margin:0 !important;
}
// .main-content{
//   margin-top:.5rem;
// }

//TODO, move to standards
@each $value in $colors {
  .#{nth($value, 1)} {
    color: nth($value, 2) !important;
  }
  .bg-#{nth($value, 1)} {
    background-color: nth($value, 2) !important;
  }
  .bdr-#{nth($value, 1)} {
    border-color: nth($value, 2) !important;
  }
}

.no-scroll{
  overflow: hidden;
  height: 100vh;
}
.toggle-map{
  position: fixed;
  bottom:0;
  width: 100%;
  z-index: 900;
}

.step-group{
  margin-left:$spacing-medium;

  .step-label {
    @include secondary-font(400);
    display: inline-block;
    margin-left: -$spacing-medium;
    background: black;
    border-radius: $spacing-extra-large;
    color:white;
    padding: 0 $spacing-small;
    width:$spacing-large;
    height:$spacing-large;
    line-height: $spacing-large;
    text-align: center;
  }
  .step{
    margin-top: -$spacing-large;
    padding-left: $spacing-large;
    padding-bottom: $spacing-large;
    border-left:1px solid black;

    &:last-of-type {
      border:none;
    }

    .step-title{
      @include secondary-font(400);
      font-size:1.2rem;
      margin-bottom: $spacing-small;
    }
  }
}

#app {
  height: 100%;
}

#clear-results {
  display: inline-block !important;
  margin-right: 10px;
}

.bottom-full #data-panel-container #lower-toggle-tab {
  // position: relative;
  top: 87px;
}

.bottom-half #data-panel-container #lower-toggle-tab {
    // add height from #results-summary
    top: calc(60% - 14px) !important;
}

.logo {
  line-height: 4em;
  padding-left: 10px;
  width: auto;
}

.bottom-full {
  overflow-y: auto;
  flex: 1;
}

.bottom-half {
  overflow-y: auto;
  flex: 2;
}
.bottom-none {
  overflow-y: auto;
  flex: 0;
  display: none;
}

.fa-times-circle{
  margin-bottom: 2px;
}

.leaflet-top, .leaflet-bottom {
  z-index: 999 !important;
}

.modal-opacity {
  opacity: 0.2;
}

.pointer {
  cursor: pointer;
}

.top-half {
  flex: 3;
}

.top-full {
  flex: 1;
}

.top-none {
  flex: 0;
}

// .bottom-half #data-panel-container .pvc-horizontal-table .pvc-horizontal-table-body .pvc-export-data-button {
//   clear:both;
//   z-index: 999;
//   top: calc(60% - 7px);
//   // right: 70px;
// }
// .bottom-full #data-panel-container .pvc-horizontal-table .pvc-horizontal-table-body .pvc-export-data-button {
//   clear:both;
//   z-index: 999;
//   top: 93px;
// }

// .pvc-export-data-button {
//   position: fixed;
//   float: right !important;
// }
//
// .csv {
//   right: 5px !important;
// }
//
// .mailing {
//   right: 137px !important;
// }

// .mailing {
//   left: 125px;
// }

@media print {
  #results-summary {
    display: none;
  }
}

.address-input {
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 100px;
}

@media (max-width: 750px) {

  .address-input {
    position: absolute;
    z-index: 10;
    right: 10px;
    top: 90px;
  }

  .pl-alert {
    height: 100% !important;
  }

  .pl-alert-body {
    width: 100% !important;
  }

  .pl-alert-close-button {
  color: lightgrey !important;

  }

  #demo-badge {
    top: 25%;
    position: absolute;
    width: max-content;
  }

  #demo-container {
    padding-left: 15px;
    position: relative;
  }

  .pvc-download-data-button, .pvc-export-data-button {
    visibility: hidden;
    // clear:both;
    // z-index: 999;
    // top: 393px;
  }

  .leaflet-draw-actions {
      left: 42px !important;
  }

  .logo {
    margin-top: auto;
    margin-bottom: auto;
  }

  .app-header .cell .shrink {
    width: 100%;
  }

  .app-divide {
    margin-bottom: 0;
    border: none;
  }

  .app-title {
    max-width: 200px;
  }

  .mobile-menu-content {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  thead {
    display: none;
  }

  td {
    clear: both;
    border: none !important;
  }

  th {
    border: 1px solid white !important;
    font-size: unset !important;
  }

  tbody th, tbody td {
    padding: 0.28571rem 0.35714rem 0.35714rem;
  }

  td div svg {
    float: right
  }

}

.step-group{
  margin-left:$spacing-medium;

  .step-label {
    @include secondary-font(400);
    display: inline-block;
    margin-left: -$spacing-medium;
    background: black;
    border-radius: $spacing-extra-large;
    color:white;
    padding: 0 $spacing-small;
    width:$spacing-large;
    height:$spacing-large;
    line-height: $spacing-large;
    text-align: center;
  }
  .step{
    margin-top: -$spacing-large;
    padding-left: $spacing-large;
    padding-bottom: $spacing-large;
    border-left:1px solid black;

    &:last-of-type {
      border:none;
    }

    .step-title{
      @include secondary-font(400);
      font-size:1.2rem;
      margin-bottom: $spacing-small;
    }
  }
}

</style>

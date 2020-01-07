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

    <cyclomedia-widget
      slot="cycloWidget"
      screen-percent="2"
      :orientation="this.$config.cyclomedia.orientation"
      @cyclomedia-widget-mounted="initializeCyclomedia"
    >
      <address-input
        :width-from-config="this.$config.addressInput.width"
        :placeholder="this.$config.addressInput.placeholder"
        class='address-input'
        @handle-search-form-submit="handleSearchFormSubmit"
      />
    </cyclomedia-widget>
  </div>
</template>

<script>
import PhilaHeader from './PhilaHeader.vue';
import PhilaFooter from './PhilaFooter.vue';

export default {

  components: {
    PhilaHeader,
    PhilaFooter,
    AddressInput: () => import(/* webpackChunkName: "mbmp_pvc_AddressInput" */'@philly/vue-comps/src/components/AddressInput.vue'),
    CyclomediaWidget: () => import(/* webpackChunkName: "mbmb_pvm_CyclomediaWidget" */'@philly/vue-mapping/src/cyclomedia/Widget.vue'),
  },
  mounted() {
    // console.log('app mounted, this.$config:', this.$config, 'this.$route:', this.$route);
    if (this.$route.query.address) {
      this.$controller.handleSearchFormSubmit(this.$route.query.address);
    } else if (this.$route.query.lat) {
      this.$store.commit('setCyclomediaLatLngFromMap', [parseFloat(this.$route.query.lat), parseFloat(this.$route.query.lng)]);
    }
  },
  watch: {
    geocodeCoordinates() {
      this.$store.commit('setCyclomediaLatLngFromMap', [this.$store.state.geocode.data.geometry.coordinates[1], this.$store.state.geocode.data.geometry.coordinates[0]]);
    },
  },
  computed: {
    geocodeCoordinates() {
      let value;
      if (this.$store.state.geocode.data) {
        value = this.$store.state.geocode.data.geometry.coordinates;
      } else {
        value = null;
      }
      return value;
    },
  },
  methods: {
    initializeCyclomedia() {
      // console.log('app initializeCyclomedia is running');
      this.$store.commit('setCyclomediaInitializationBegun', true);
      this.$store.commit('setCyclomediaActive', true);
    },
    handleSearchFormSubmit(value) {
      // console.log('App.vue handleSearchFormSubmit is running');
      this.$controller.handleSearchFormSubmit(value);
    },
  }
}
</script>

</script>

<style lang="scss">
@import "@/scss/global.scss";

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

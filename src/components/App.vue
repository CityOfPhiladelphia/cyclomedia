<template>
  <div
    id="app"
    class="grid-y"
  >
  <!-- :class="openModal" -->
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine"
      :app-logo="appLogo"
      :app-logo-alt="this.$config.app.logoAlt"
    >
      <!-- <div slot="mobile-menu">
        <PhilaFooter
          @howToUseLink="toggleModal()"
        />
      </div> -->
    </PhilaHeader>

    <!-- <div class="cell medium-auto medium-cell-block-container main-content"> -->
      <cyclomedia-widget
        slot="cycloWidget"
        screen-percent="2"
        :orientation="this.$config.cyclomedia.orientation"
        @cyclomedia-widget-mounted="initializeCyclomedia"
      >
        <address-input
          :width-from-config="'450'"
          :placeholder="'search for an address'"
          class='address-input'
          @handle-search-form-submit="handleSearchFormSubmit"
        />
      </cyclomedia-widget>
    <!-- </div> -->
  </div>
</template>

<script>

import PhilaHeader from './PhilaHeader.vue';
import PhilaFooter from './PhilaFooter.vue';
// import cyclomediaMixin from '@philly/vue-mapping/src/cyclomedia/map-panel-mixin.js';
import Logo from '@/assets/city-of-philadelphia-logo.png';

export default {

  components: {
    PhilaHeader,
    PhilaFooter,
    AddressInput: () => import(/* webpackChunkName: "mbmp_pvc_AddressInput" */'@philly/vue-comps/src/components/AddressInput.vue'),
    CyclomediaWidget: () => import(/* webpackChunkName: "mbmb_pvm_CyclomediaWidget" */'@philly/vue-mapping/src/cyclomedia/Widget.vue'),
  },
  props: {
    appLogo: {
      type: String,
      default: Logo,
    },
  },
  data() {
    return {
      publicPath: '@/assets/',
      isLarge: true,
      'top': 3,
      'bottom': 2,
      hasData: false,
      isModalOpen: false,
      introPage: true,
    };
  },
  // mixins: [
  //   cyclomediaMixin,
  // ],
  created() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  mounted() {
    console.log('app mounted, this.$config:', this.$config, 'this.$route:', this.$route);
    this.onResize();
    if (this.$route.query.lat) {
      this.$store.commit('setCyclomediaLatLngFromMap', [parseFloat(this.$route.query.lat), parseFloat(this.$route.query.lng)]);
    }
  //   this.$store.commit('setCyclomediaInitializationBegun', false);
  //   this.$store.commit('setCyclomediaInitializationBegun', true);
  //   this.$store.commit('setCyclomediaActive', true);
  },
  methods: {
    initializeCyclomedia() {
      console.log('app initializeCyclomedia is running');
      this.$store.commit('setCyclomediaInitializationBegun', true);
      this.$store.commit('setCyclomediaActive', true);
    },
    handleSearchFormSubmit(value) {
      console.log('App.vue handleSearchFormSubmit is running');
      this.$controller.handleSearchFormSubmit(value);
    },
    onResize() {
      // console.log('onResize is running, window.innerWidth:', window.innerWidth);
      if (window.innerWidth > 749) {
        // this.$data.isMapVisible = true;
        this.$data.isLarge = true;
        // console.log('its greater');
      } else {
        this.$data.isLarge = false;
        // console.log('its less than');
      }
    },
  }
}
</script>

</script>

<style lang="scss">
@import "@/scss/global.scss";

.address-input {
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 100px;
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

// #collection-summary {
//   display: inline-block !important;
// }

// #data-panel-container .pvc-horizontal-table .pvc-horizontal-table-body .stack>thead>tr>th {
//   position: sticky;
//   top: -2px !important;
//   z-index: 2;
//   border-left:1px solid white;
// }
//
// #results-summary{
//   height: 45px;
//   padding: 8px 0px  0px 10px;
//   margin: 0 2px 0 2px;
//   background-color: #f0f0f0;
//   border-style: solid;
//   border-color: #0f4d90;
//   border-width: 2px 0 0 0 ;
// }

// .bottom-half #data-panel-container #lower-toggle-tab {
//   // position: fixed;
//   top: calc(60% - 10px);
// }

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

// .condo-button {
//   background-color: #5555;
//   height: 100%;
//   width: 100%;
//   text-transform: unset;
//   font-family: "Open Sans", Helvetica, Roboto, Arial, sans-serif;
//   font-weight: 600;
//   padding: 10.5px 0 10.5px 0;
// }

.fa-times-circle{
  margin-bottom: 2px;
}

.leaflet-top, .leaflet-bottom {
  z-index: 999 !important;
}

.modal-opacity {
  opacity: 0.2;
}

// .pvc-horizontal-table-controls {
//   margin-bottom: 0 !important;
// }
//
// .pvc-horizontal-table-body {
//   padding-top: 0 !important;
//   margin-top: 0 !important;
// }

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

  // #results-summary{
  //   height: 35px;
  //   padding: 8px 0px  0px 10px;
  //   margin: 0 2px 0 2px;
  //   color: rgb(15, 77, 144);
  //   background-color: #cfcfcf;
  //   border-style: solid;
  //   border-color: #0f4d90;
  //   border-width: 1px 0 1px 0 ;
  // }


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

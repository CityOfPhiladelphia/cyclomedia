<template>
  <div class="mb-root row collapse"
       id="mb-root"
       :style="styleObject"
  >
    <div id="cyclo-container"
         :class="this.cycloContainerClass"
    >
      <!-- <div id="inCycloDiv">
        <i class="fa fa-external-link fa popout-icon"></i>
      </div> -->
      <div id="cycloviewer" ref="cycloviewer" class="panoramaViewerWindow" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const data = {
        styleObject: {
          'position': 'relative',
          // 'top': '86px',
          // 'overflow-y': 'auto',
          'width': '100%',
          'height': '100%'
          // 'height': null
        }
      };
      return data;
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
    computed: {
      pictometryActive() {
        return this.$store.state.pictometry.active
      },
      cycloContainerClass() {
        if (this.pictometryActive) {
          return 'large-16 columns mb-panel'
        } else {
          return 'large-24 columns mb-panel'
        }
      },
      locForCyclo() {
        // console.log('computing locForCyclo');
        const geocodeData = this.$store.state.geocode.data;
        const map = this.$store.state.map.map;
        if (geocodeData) {
          return geocodeData.geometry.coordinates;
        }
      }
    },
    // watch: {
    //   locForCyclo(coords){
    //     // console.log(coords);
    //     this.setNewLocation(coords);
    //   }
    // },
    mounted() {
      window.addEventListener('resize', this.handleWindowResize);
      this.handleWindowResize();

      StreetSmartApi.init({
        targetElement: this.$refs.cycloviewer,
        username: this.$config.cyclomedia.username,
        password: this.$config.cyclomedia.password,
        apiKey: this.$config.cyclomedia.apiKey,
        srs: 'EPSG:4326',
        locale: 'en-us',
        addressSettings: {
          locale: 'en-us',
          database: 'CMDatabase'
        }
      }).then(
        () => {
          const cycloDiv = this.$refs.cycloviewer;

          // get map center and set location
          const map = this.$store.state.map.map;
          const parameterString = window.location.search;
          const parameters = parameterString.split('&');
          console.log('parameterString', parameterString, 'parameters', parameters[0].substring(1), parameters[1]);
          let center = {}
          if (parameterString ==='') {
            center = {
              lat: '39.953338',
              lng: '-75.163471'
            }
          } else {
            center = {
              lat: parameters[0].substring(1),
              lng: parameters[1]
            }
          }

          const viewerType = StreetSmartApi.ViewerType.PANORAMA
          // const viewerType = StreetSmartApi.ViewerType.OBLIQUE

          StreetSmartApi.open(center.lng + ',' + center.lat, {
            viewerType: viewerType,
            srs: 'EPSG:4326',
            closable: false
          }).then(
            function(result) {
              console.log('Created component through API:', result);
              if (result) {
                for (let i =0; i < result.length; i++) {
                  if(result[i].getType() === StreetSmartApi.ViewerType.PANORAMA) window.panoramaViewer = result[i];
                }
                window.panoramaViewer.toggleButtonEnabled('panorama.elevation', false);
                window.panoramaViewer.toggleButtonEnabled('panorama.reportBlurring', false);
                // StreetSmartApi.removeOverlay('surfaceCursorLayer');
                StreetSmartApi.removeOverlay('measurementLayer');
                window.panoramaViewer.toggleButtonEnabled('panorama.measure', false);
                window.panoramaViewer.toggleNavbarExpanded(false);

                for (let overlay of window.panoramaViewer.props.overlays) {
                  // console.log('overlay:', overlay);
                  if (overlay.id === 'surfaceCursorLayer') {
                    if (overlay.visible === true) {
                      window.panoramaViewer.toggleOverlay(overlay);
                      // overlay.visible = false;
                    }
                  }
                }
                // window.panoramaViewer.on('VIEW_CHANGE', function() {
                //   console.log('on VIEW_CHANGE fired');
                // })
              }
            }.bind(this)
          ).catch(
            function(reason) {
              console.log('Failed to create component(s) through API: ' + reason);
            }
          );

        },
        err => {
          console.log('Api: init: failed. Error: ', err);
        }
      );
    },
    updated() {
      // TODO find a better way to get the image to update and not be stretched
      // const viewer = this.$store.state.cyclomedia.viewer;
      // viewer.rotateRight(0.0000001);
    },
    methods: {
      setNewLocation(coords) {
        console.log('setNewLocation is running using', coords);
        // const viewer = this.$store.state.cyclomedia.viewer;
        // viewer.openByCoordinate(coords);
      },
      handleWindowResize() {
        const rootElement = document.getElementById('application');
        const rootStyle = window.getComputedStyle(rootElement);
        const rootHeight = rootStyle.getPropertyValue('height');
        const rootHeightNum = parseInt(rootHeight.replace('px', ''));
        const topicsHeight = rootHeightNum - 76;
        // console.log('handleWindowResize is running, rootElement:', rootElement, 'rootStyle', rootStyle, 'rootHeight:', rootHeight, 'rootHeightNum', rootHeightNum);
        this.styleObject.height = topicsHeight.toString() + 'px';
        // this.styleObject.height = '100%';
      }
    }
  };
</script>

<style>
  /*don't highlight any form elements*/
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  .mb-panel {
    height: 100%;
  }

  .mb-panel-topics-with-widget {
    height: 100%;
  }


  #cyclo-container {
    padding: 0px;
    height: 100%;
  }

  #inCycloDiv {
    background-color: white;
    border: 0px solid;
    width: 30px;
    height: 30px;
    /*display:none;*/
    cursor:pointer;
    z-index: 10;
    position:relative;
    float: right;
  }

  .popout-icon {
    margin-top: 8.5px;
    font-size: 15px;
    margin-left: 8.5px;
  }

  .panoramaViewerWindow {
    /*display: inline-block;*/
    display: block;
    width: 100%;
    height:100%;
  }
</style>




<!-- <template>
  <div id="cyclo-container"
       :class="this.cycloContainerClass"
  >
    <div id="inCycloDiv">
      <i class="fa fa-external-link fa popout-icon"></i>
    </div>
    <div id="cycloviewer" ref="cycloviewer" class="panoramaViewerWindow" />
  </div>
</template>

<script>
  export default {

  };
</script>

<style>


</style> -->

//map and view with the extent and the initial zoom
import {Map, View} from 'ol';
//to create wms layers
import TileLayer from 'ol/layer/Tile';
//to create wms sources
import TileWMS from 'ol/source/TileWMS.js';
//to change the map view projection
import {Projection} from 'ol/proj';
//Layer switcher control
import LayerSwitcher from 'ol-layerswitcher';
//Mouse position control
import MousePosition from 'ol/control/MousePosition.js';
//Scaleline control
import {ScaleLine} from 'ol/control.js';
//Function to round coordinates
import {createStringXY} from 'ol/coordinate.js';
//Groups are used to group layers
import {Group as LayerGroup} from 'ol/layer.js'

//needed to style the vector layers
import {Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text} from 'ol/style.js';

import {Vector as VectorLayer} from 'ol/layer';
//interactions to draw and modify map objects
import {Draw, Modify} from 'ol/interaction.js';
//geometry types
import {LineString, Point} from 'ol/geom.js';
//vector sources are where the objects are drawn and stored
import {Vector as VectorSource} from 'ol/source.js';
import {WKT} from 'ol/format'

import { URL_GEOSERVER } from '../settings';

export class MapMain{
  constructor(){
      this.map=undefined;
      this.layersArray=undefined;

      //We will need to access to this layers latter
      //so I created them as a class variables.
      //Tey are initiated in the setLayersArray method.
      this.wms_buildings_layer=undefined;//the geoserver wms layer
      this.vector_buildings_layer_source_draw=undefined;//the object to draw
      this.vector_buildings_layer=undefined;//the vector layer
      this.vector_buildings_layer_draw_interaction=undefined;//the draw interaction

      
      this.setLayersArray();
      this.setMap();
      this.setMapControls();
      this.addDrawBuildingInteraction();
      this.stopDrawingBuilding();
  }
  setLayersArray(){
    var pnoa = new TileLayer({
      source: new TileWMS({       
          url: 'http://www.ign.es/wms-inspire/pnoa-ma',
          params: {"LAYERS": "OI.OrthoimageCoverage", 'VERSION': "1.3.0", "TILED": "true"},
          attributions: ["PNOA-MA"]
      }),
      name: 'PNOA', 
      description: 'PNOA', 
      visible: true, 
      title:'PNOA',
      //type: 'base'
    });


    var catastro= new TileLayer({
      source: new TileWMS({
        url: 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
        params: {'LAYERS': 'Catastro', 'VERSION': '1.1.1', 'TILED': true, 'TRANSPARENT': true, 'FORMAT': 'image/png'},
      }), 
      name: 'Cadastre', 
      description: 'Cadastre', 
      visible: true, 
      title:'Cadastre',
      //type: 'base'
    });

    const baselayers = new LayerGroup({
      title: 'Base layers:',
      layers: [pnoa, catastro],
    });

    this.wms_buildings_layer = new TileLayer({
      source: new TileWMS(({
        url: URL_GEOSERVER + '/wms?',
        params: {"LAYERS": "desweb:buildings", 'VERSION': "1.3.0", "TILED": "true"},
      })),
      title: "Buildings"
    });

    //style for the vector layer used to draw
    //OL3 allow points, lines and polygons at the same layer,
    //so the style specifies an style for each type of geometry
    //	fill: fill color for polygons
    //	stroke: type of line for lines
    //  image: for points. Allow different symbols and images
    var vector_buildings_draw_style = new Style({
      fill: new Fill({
        color: '#D7DF01'
      }),
      stroke: new Stroke({
        color: '#DF013A',
        width: 3,
        lineJoin: 'round'
      }),
      image: new CircleStyle({
          radius: 4,
          fill: new Fill({
            color: '#DF013A'
          })
        })
      });
    
    this.vector_buildings_layer_source_draw = new VectorSource({wrapX: false}); //needed for draw
    this.vector_buildings_layer= new VectorLayer({
      source: this.vector_buildings_layer_source_draw,
      title: 'Buildings draw layer'
    });//The layer were we will draw
    this.vector_buildings_layer.setStyle(vector_buildings_draw_style);
    this.vector_buildings_layer.setOpacity(0.5);

    const deswebLayers = new LayerGroup({
      title: 'Desweb layers:',
      layers: [this.wms_buildings_layer, this.vector_buildings_layer],
    });





    this.layersArray=[baselayers,deswebLayers]
  }
  setMap(){
        /**Aquí se crea el mapa, y luego se pasa como parámetro a 
   * al componente <app-map> en la plantilla, donde lo que se hace es
   * coger el elemento html donde se inserta, que es donde pongas <app-map>,
   * es decir el selector de este componente
   */
    let epsg25830=new Projection({
      code:'EPSG:25830',
      extent: [716682.702,4365814.329,732380.437,4376383.664],
      units: 'm'
    });

    this.map = new Map({
      target: 'map',
      layers: this.layersArray,
      renderer: 'canvas',
      view: new View({
          projection:epsg25830, //the projection of the map is set here
          maxZoom: 28, minZoom: 1,  
          center: [724950.649,4371212.645], //the initial center of the map
          zoom: 2 //the initial zoom
      }) 
    });
  }
  setMapControls(){
    const layerSwitcher = new LayerSwitcher({
        activationMode: 'mouseover',
        startActive: false,
        tipLabel: 'Show-hide layers',
        groupSelectStyle: 'group',
        reverse: true
      });
    
      //Adds the mouse coordinate position to the map
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(0),
      projection: 'EPSG:25830',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      //className: 'custom-mouse-position',
      //target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });

    const sl = new ScaleLine({units: 'metric'});

    this.map.addControl(layerSwitcher);
    this.map.addControl(mousePositionControl);
    this.map.addControl(sl);
  }
    addDrawBuildingInteraction(){
      /*Possible values for tipo_geom:
      * 		"Point","LineString","Polygon"
      * */
      this.vector_buildings_layer_draw_interaction = new Draw({
             source: this.vector_buildings_layer_source_draw, //source of the layer where the poligons will be drawn
             type: ('Polygon') //geometry type
           });
       
       //When a polygon is drawn the callback function manageDrawEnd will be executed.
       //The system pass to the function a parameter e, which is an objects with
       //a lot of properties, one of which is the geometry of the geometry just drawn
       //This must be done only once
      this.vector_buildings_layer_draw_interaction.on('drawend', this.manageBuildingsDrawEnd);
       
       //adds the interaction to the map. This must be done only once
      this.map.addInteraction(this.vector_buildings_layer_draw_interaction);
    }      
    manageBuildingsDrawEnd(e){
      var feature = e.feature;//this is the feature that fired the event
      var wktFormat = new WKT();//an object to get the WKT format of the geometry
      var wktRepresentation  = wktFormat.writeGeometry(feature.getGeometry());//geomertry in wkt
      console.log(wktRepresentation);//logs a message
      document.getElementById("form-buildings-geomWkt").value=wktRepresentation;//set the geometry in wkt format to the geomWkt input
    }

    startDrawingBuilding(){
      this.vector_buildings_layer_draw_interaction.setActive(true);
    }
    stopDrawingBuilding(){
      this.vector_buildings_layer_draw_interaction.setActive(false);
    }

    clearVectorBuildingsLayer(){
      this.vector_buildings_layer_source_draw.clear()
    }
    reloadWMSBuildingsLayer(){
      this.wms_buildings_layer.getSource().updateParams({"time": Date.now()})
    }
    
}


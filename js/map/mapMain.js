import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import { Projection } from 'ol/proj';
import LayerSwitcher from 'ol-layerswitcher';
//import OSM from 'ol/source/OSM.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {Group as LayerGroup} from 'ol/layer.js'

export class MapMain{
  constructor(){
      this.map=undefined;
      this.layersArray=undefined;
      this.setLayersArray();
      this.setMap();
      this.setMapControls();
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

    const lg = new LayerGroup({
      title: 'Base layers:',
      layers: [pnoa, catastro],
    });


    this.layersArray=[lg]
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
        reverse: false
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
    this.map.addControl(layerSwitcher);
    this.map.addControl(mousePositionControl);
  }
}


import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { Projection } from 'ol/proj';

export class MapMain{
    constructor(){
        this.map=undefined;
        this.iniMap();
    }
    iniMap(){
          /**Aquí se crea el mapa, y luego se pasa como parámetro a 
     * al componente <app-map> en la plantilla, donde lo que se hace es
     * coger el elemento html donde se inserta, que es donde pongas <app-map>,
     * es decir el selector de este componente
     */
      let epsg25830=new Projection({
        code:'EPSG:25830',
        extent: [-729785.76,3715125.82,945351.10,9522561.39],
        units: 'm'
      });

      this.map = new Map({
        controls: [],
        view: new View({
          center: [746883,4417673],
          zoom: 17.645337068332548,
          projection: epsg25830,
        }),
        layers: [this.vectorLayersGroup, this.baseLayersGroup],
        target: 'map'
      }); 
    const layerSwitcher = new LayerSwitcher(
      {
        activationMode: 'mouseover',
        startActive: true,
        tipLabel: 'Show-hide layers',
        groupSelectStyle: 'group',
        reverse: false
      }
    );
    this.map.addControl(layerSwitcher);
    this.layerSwitcher=layerSwitcher;

  }
}


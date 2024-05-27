import './style.css';
import { registerEvents } from './js/registerEvents';
import { helloWord } from './js/helloWorld';
import { MapMain } from './js/map/mapMain';
import { setMAP_MAIN } from './js/settings';


registerEvents();
//creates the map and sets the MAP_MAIN global variable
setMAP_MAIN(new MapMain());

//helloWord();

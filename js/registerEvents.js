import {login, logout} from './login';
import { insert, select, startDrawingBuilding, stopDrawingBuilding, reloadWMSBuildingsLayer, clearVectorBuildingsLayer} from './buildings';

export function registerEvents(){
    document.getElementById('button-login').addEventListener('click',login);
    document.getElementById('button-logout').addEventListener('click',logout);
    document.getElementById('form-building-insert').addEventListener('click',insert);
    document.getElementById('form-building-select').addEventListener('click',select);

    document.getElementById('start-drawing-building').addEventListener('click',startDrawingBuilding);
    document.getElementById('stop-drawing-building').addEventListener('click',stopDrawingBuilding);
    document.getElementById('reload-wms-buildings-layer').addEventListener('click',reloadWMSBuildingsLayer);
    document.getElementById('clear-vector-buildings-layer').addEventListener('click',clearVectorBuildingsLayer);
}
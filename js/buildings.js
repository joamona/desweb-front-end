import axios from 'axios';
import { MAP_MAIN, URL_API, URL_GEOSERVER } from './settings';

export function insert(){
    let descripcion=document.getElementById('form-buildings-descripcion').value;
    let geomWkt=document.getElementById('form-buildings-geomWkt').value;

    axios.post(URL_API + '/appdesweb/building_insert/',
    {descripcion:descripcion,geomWkt:geomWkt}, {withCredentials: true})
    .then(function (response) {
    // handle success
            console.log(response);
            document.getElementById("form-buildings-gid").value=response.data.data[0].gid;
            document.getElementById("form-buildings-area").value=response.data.data[0].area;
            document.getElementById("form-buildings-message").innerHTML=response.data.message;
            clearVectorBuildingsLayer()
            reloadWMSBuildingsLayer(); 
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.getElementById("form-buildings-message").innerHTML=error.message;
        })
        .finally(function () {
            // always executed
            console.log('Finally')
    });
}

export function select(){
    let gid=document.getElementById('form-buildings-gid').value;
    axios.get(URL_API + '/appdesweb/building_select_by_gid/',
    {params:{
            gid:gid
        }
    }, {withCredentials: true})
    .then(function (response) {
    // handle success
            console.log(response);
            if (response.data.data.length > 0){
                document.getElementById("form-buildings-gid").value=response.data.data[0].gid;
                document.getElementById("form-buildings-descripcion").value=response.data.data[0].descripcion;
                document.getElementById("form-buildings-geomWkt").value=response.data.data[0].st_astext;
                document.getElementById("form-buildings-area").value=response.data.data[0].area;   
            }else{
                document.getElementById("form-buildings-descripcion").value="";
                document.getElementById("form-buildings-geomWkt").value="";
                document.getElementById("form-buildings-area").value=""; 
            }
            document.getElementById("form-buildings-message").innerHTML=response.data.message;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.getElementById("form-buildings-message").innerHTML=error.message;
        })
        .finally(function () {
            // always executed
            console.log('Finally')
    });
}

export function startDrawingBuilding(){
    //Enables de draw interaction
    MAP_MAIN.startDrawingBuilding();
    document.getElementById("map-message").innerHTML="Draw poligon interaction active"
}

export function stopDrawingBuilding(){
    //Enables de draw interaction
    MAP_MAIN.stopDrawingBuilding();
    document.getElementById("map-message").innerHTML="Draw poligon interaction inactive"
}

export function reloadWMSBuildingsLayer(){
    MAP_MAIN.reloadWMSBuildingsLayer();
    document.getElementById("map-message").innerHTML="WMS buildings reloaded"
}

export function clearVectorBuildingsLayer(){
    MAP_MAIN.clearVectorBuildingsLayer();
    document.getElementById("map-message").innerHTML="Vector buildings layer cleared"
}


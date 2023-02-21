/**
 * Creado por: Juan José Arteta Maury
 * 
 * Archivo creado para las funciones del web component de la alerta modal de eliminar.
 * 
 * fecha: 06/12/2022
 */



let closeAlert;
let launchAlertModal;
let deleteRow;

//Variables
var idDelete;
var module;

function borrarFila() {
    // aqui va el fecth y cuando reciba la respuesta ya sea negativa o no decides borrar la alert ejecutando la funcion de closeAlert 
    fetch('/dashboard/'+module+'/delete/'+idDelete, {
        method: 'POST'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status === 200) {
            let rowToDelete = document.getElementById("row-"+idDelete);
            rowToDelete.remove();
            closeAlert();      
        } else {
            alert("Error al borrar producción, intente nuevamente");
            closeAlert();
        }
    })  
}

function deleteAlert(id, modules){
    idDelete = id;
    module = modules;
    launchAlertModal();
}

function cancelAlert(){
    closeAlert();
}
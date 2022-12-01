/**
 * Creado por: Juan José Arteta Maury
 * Fecha: 30/11/2022
 * Archivo para el cambio del icono al activar el menu hamburguesa
 */

var estado = 0;
function changeMenu() {
    let imagen = document.getElementsByTagName('header-banacuaco')[0].shadowRoot;
    if (estado==0) {
        imagen.getElementById('menuClick').src = "../images/menuMobilClose.svg";
        
        estado=1;
        console.log("funciona1");
    } else {
        imagen.getElementById('menuClick').src = "../images/menuMobil.svg";
        
        estado=0;
        console.log("funciona0");
    }
}
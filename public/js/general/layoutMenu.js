/**
 * Creado por: Juan José Arteta Maury
 * Fecha: 2/12/2022
 * 
 * Archivo para el estilo del menu hamburguesa del layout
 */


var estado = 0;
function changueStyleLayout(){

    console.log("funciona");

    if (estado==0) {
        document.getElementById("imgMenu").style.display = 'none';
        document.getElementById("container1").style.display = 'block';
        document.getElementById("optionsHeader").style.width = 'calc(100% - 80px)';
        estado=1;
        console.log("funciona1");
    } else {
        document.getElementById("imgMenu").style.display = 'block';
        document.getElementById("container1").style.display = "none";
        document.getElementById("optionsHeader").style.width = '100%';
        estado=0;
        console.log("funciona0");
    }
}
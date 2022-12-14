/**
 * Eliminacion de cookies y redireccion 
 * Creado por Camilo Andres Valencia Padilla
 * 14/12/2022
 */
function deleteCookie(){

    var lista = document.cookie.split(";");

    for (let i in lista) {

        var igual = lista[i].indexOf("=");
        var nombre = lista[i].substring(0,igual);
        lista[i] = nombre+"="+""+"; path=/"+";expires=1 Dec 2000 00:00:00 GMT"
        document.cookie = lista[i]

    } 
    document.location = '/dashboard'
};
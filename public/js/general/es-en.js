/**
 * Realiza el cambio de idioma en la pagina, mandando por la ruta /es para español y /en para ingles 
 * Realizado por Camilo Andres Valencia Padilla
 * 13/12/2022
 */


let routes = window.location.pathname.toString();
let b = routes.split('/');
let c = b.length

// Realiza el cambio de idioma, mandando por la ruta /es para español y /en para ingles 
function es_en(params) {
    // b = routes.split('/');
    // c = b.length
    if(c === 2){
        if(b[c-1] === params){
            window.location = routes;
        }
        else{
            window.location = '/' + params;
        }
    }
    if(c >= 3){
        if(b[3] === params){
            window.location = routes;
        }
        else{
            r = '/' + params + '/' + b[2];
            for(e in b){
                if (e > 3){
                    r = r + b[e]
                }
            }
            window.location = r;
        }
    }
}
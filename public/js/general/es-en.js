let routes = window.location.pathname.toString();
b = routes.split('/');
c = b.length

function es_en(params) {
    b = routes.split('/');
    c = b.length
    console.log(b)
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
            r = '/' + b[1] + '/' + params;
            for(e in b){
                if (e > 3){
                    r = r + b[e]
                }
            }
            window.location = r;
        }
    }
}
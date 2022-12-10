let routes = window.location.pathname.toString();
b = routes.split('/');
c = b.length

function es_en(params) {
    b = routes.split('/');
    c = b.length
    console.log(b)
    if(c === 2){
        console.log('se ejecuta')
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
            console.log('se ejecuta else')
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
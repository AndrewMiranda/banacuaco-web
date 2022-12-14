/**
 * Verificacion de campos y autorizacion de envio de emails
 * 13/12/2022
 */


let name = document.getElementById('nombre')
let email = document.getElementById('email')
let mensaje = document.getElementById('mensaje')
let form = document.getElementById('form');
let errorEmail = document.getElementById('errorEmail');
let errorPassword = document.getElementById('errorPassword');
let emailOk = false;
let mensajeOk = false;
let ruta = window.location.pathname.toString();
let arrayRoutes = ruta.split('/');

//Verificación el formato del email
email.addEventListener('keyup', ()=>{verifyEmail()});

mensaje.addEventListener('keyup', ()=>{verifyMessage()});

// verificacion de emails
function verifyEmail(){
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email.value)) {
        email.style.color = '#005fae';
        errorEmail.style.display ='none';
        emailOk = true;
    }else{
        if (arrayRoutes[1] === 'es' ) {
            errorEmail.innerHTML = "Email no válido";
        }
        if (arrayRoutes[1] === 'en') {
            errorEmail.innerHTML = "Invalid email";
        }
        errorEmail.style.color ='#f04d28';
        errorEmail.style.display ='block';
        emailOk = false;
    }
};

function verifyMessage() {
    if(mensaje.value.length < 6){
        if (arrayRoutes[1] === 'es' ) {
            errorPassword.innerHTML = "Mensaje muy corto";
        }
        if (arrayRoutes[1] === 'en') {
            errorPassword.innerHTML = "very short message";
        }
        errorPassword.style.color ='#f04d28';
        errorPassword.style.display ='block';
        mensajeOk = false;
    }else{
        email.style.color = '#005fae';
        errorPassword.style.display ='none';
        mensajeOk = true;
    }
}

// Autorizacion y envio de datos para el email 
function submitFun() {
    verifyEmail();
    verifyMessage();
    if(emailOk === true && mensajeOk === true){
        form.submit()
    }
}
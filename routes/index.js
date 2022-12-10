const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

//Llamada de BD
const pool = require("../config/dbConnection");

router.get('/:idioma', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/home.ejs");
    res.render('home', { title: 'home', idioma: idioma });
});

router.get('/:idioma/servicios', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/services.ejs", { title: 'services', idioma: idioma });
});


router.get('/:idioma/contacto', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/contact.ejs", { title: 'contact', idioma: idioma });
});

//Recibir información de formulario de contacto
router.post('/:idioma/contacto', (req, res) => {
    let idioma = req.params.idioma;
    const {nombre, mensaje, emails} = req.body;
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        port: 587, // port for secure SMTP
        secureConnection: false,
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
        user: 'camilovalenciapadilla@hotmail.com',
        pass: 'camilosemilo1'
        }
    });

    var mailOptions = {
        from: 'camilovalenciapadilla@hotmail.com',
        to: 'camilovalenciapadilla@gmail.com',
        subject: `email enviado de la direccion de correo de: ${emails}`,
        html: `<html lang="en">
        <head>
        <style>
            p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Roboto', sans-serif !important;}
            .imgHeader{
                height: 200px;
                width: 100%;
            }
            
            .imgHeader img{
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
            p{
                color: #000;
                font-size: 18px;
                font-family: "roboto-bold";
            }
        </style>
        </head>
        <body>
            <div class="imgHeader">
                <img src="cid:Bna" alt="banacuaco"></a>
            </div>
            <div style="text-align: center; color: #FE670E; font-size: 50px;"> contactos</div> 
            <p style="text-align: center; color: #000;font-size: 18px;"> Este email viene a nombre de: <b> ${nombre}</b></p>
            <p style="text-align: center; color: #000;font-size: 18px;"> el mensaque recibido es el siguiente:</p>
            <p style="text-align: center; color: #000;font-size: 18px;"> ${mensaje}</p>
        </body>
        </html> `,
        attachments: [{
            filename: 'BANACUACO Banner Youtube 2022 web.jpg',
            path: './public/images/BANACUACO Banner Youtube 2022 web.jpg',
            cid: 'Bna' //same cid value as in the html img src
        }]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    }); 

    res.render(idioma+"/contact.ejs", { title: 'contact', idioma: idioma });
});

router.get('/:idioma/nosotros', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/nosotros.ejs", { title: 'nosotros', idioma: idioma });
});

router.get('/:idioma/producciones', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/productions.ejs", { title: 'nosotros', idioma: idioma });
});

router.get('/:idioma/produccion', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/productionEspc.ejs", { title: 'nosotros', idioma: idioma });
});

router.get('/:idioma/produccion2', (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+'/productionEspc2.ejs', { title: 'nosotros', idioma: idioma });
});


router.get('/:idioma/galeria', async (req, res) => {
    let idioma = req.params.idioma;

    let data = await pool.query("SELECT * FROM `images`");
    console.log(data)
    res.render(idioma+"/galery.ejs", { title: 'Galeria', images: data });
});

// desde aqui inician las rutas del dashboard

router.post("/dashboard", (req, res, next) => {    
    //let user = req.body.user;
    //let password = req.body.password;
    res.send(req.body);
    console.log(req.body);
}); 

router.get("/dashboard", (req, res, next) => {
    res.render("dashboard/login");
});

router.get("/dashboard/home", (req, res) => {
    res.render("dashboard/indexDashboard");
});

router.get("/dashboard/producciones", (req, res) => {
    res.render("dashboard/productionsDashboard");
});

router.get("/dashboard/galeria", (req, res) => {
    res.render("dashboard/galeryDashboard");
});

router.get("/dashboard/usuarios", (req, res) => {
    res.render("dashboard/usersDashboard");
});

router.get("/dashboard/nuevoUsuario", (req, res) => {
    res.render("dashboard/newUserDashboard");
});

router.get("/dashboard/editarUsuario", (req, res) => {
    res.render("dashboard/editUserDashboard");
});

router.get("/dashboard/editarProduccion", (req, res) => {
    res.render("dashboard/editProductionDashboardSinopsis");
});

router.get("/dashboard/editarProduccionPersonajes", (req, res) => {
    res.render("dashboard/editProductionDashboardcharacter");
});

router.get("/dashboard/editarProduccionFauna", (req, res) => {
    res.render("dashboard/editProductionDashboardFauna");
});


router.get("/dashboard/editarProduccionVerPersonajes", (req, res) => {
    res.render("dashboard/editProductionDashboardSeeCharacters");
});

router.get("/dashboard/editarProduccionFondos", (req, res) => {
    res.render("dashboard/editProductionDashboardBackground");
});

router.get("/dashboard/editarProduccionIlustraciones", (req, res) => {
    res.render("dashboard/editProductionDashboardIllustrations");
});

router.get("/dashboard/fondosEdit", (req, res) => {
    res.render("dashboard/editProductionDashboardSeeBackgrounds");
});

router.get("/:idioma/dashboards", (req, res) => {
    let idioma = req.params.idioma;

    res.render(idioma+"/home.ejs");
});

module.exports = router;
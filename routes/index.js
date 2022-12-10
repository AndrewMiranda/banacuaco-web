const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

//Llamada de BD
const pool = require("../config/dbConnection");

const defaultLanguage = "en"

router.get('/', (req, res) => {
    res.redirect('/en/home');
});

router.get('/:idioma/home', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data =  await pool.query("SELECT * FROM `"+idioma+"_premieres` ORDER BY `date` DESC LIMIT 1");
    data = data[0];

    res.render(idioma+'/home', { title: 'home', idiom: idioma, img: data.image, desc: data.description, character: data.characters});
});

router.get('/:idioma/servicios', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+'/services', { title: 'services' });
});

router.get('/:idioma/contacto', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render('contact', { title: 'contact' });
});

//Recibir información de formulario de contacto
router.post('/contacto', (req, res) => {
    res.render(idioma+'/contact', { title: 'contact' });
});

router.get('/:idioma/nosotros', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+'/nosotros', { title: 'nosotros' });
});

router.get('/:idioma/producciones', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+'/productions', { title: 'nosotros' });
});

router.get('/:idioma/produccion', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+'/productionEspc', { title: 'nosotros' });
});

router.get('/:idioma/produccion2', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+'/productionEspc2', { title: 'nosotros' });
});


router.get('/:idioma/galeria', async (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data = await pool.query("SELECT * FROM `images`");
    console.log(data)
    res.render(idioma+'/galery', { title: 'Galeria', images: data });
});

// desde aqui inician las rutas del dashboard

router.post("/dashboard", (req, res) => {    
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

module.exports = router;
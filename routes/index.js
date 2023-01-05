const express = require('express');
const router = express.Router();


//Llamada de BD
const pool = require("../config/dbConnection");
const { contact } = require('../modules/contact.js');

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

    res.render(idioma+'/services', { title: 'services', idiom: idioma });
});

router.get('/:idioma/contacto', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+"/contact.ejs", { title: 'contact', idiom: idioma });
});

//Recibir información de formulario de contacto
router.post('/:idioma/contacto', async (req, res) => {
    let idioma = req.params.idioma;
    var contact = require("../modules/contact.js");
    const {nombre, mensaje, emails} = req.body;
    let data = await contact.contact(nombre, mensaje, emails);
    console.log(data);
    res.render(idioma+"/contact", { title: 'contact', idiom: idioma, data: data});
});

router.get('/:idioma/nosotros', (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    res.render(idioma+'/nosotros', { title: 'nosotros', idiom: idioma });
});

router.get('/:idioma/producciones', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data =  await pool.query("SELECT * FROM `"+idioma+"_productions`");
    //data = data[0];
    //console.log(data)

    res.render(idioma+'/productions', { title: 'nosotros', idiom: idioma, productions : data});
});

router.get('/:idioma/produccion', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let template = req.query.template;
    let id = req.query.id

    //Datos generales
    let data =  await pool.query("SELECT * FROM `"+idioma+"_productions` WHERE id = "+id);

    //Imagenes de la seccion de "ideas"
    let ideaImages =  await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND idProduction = "+id+" AND idea = 1");

    //Imagenes de la seccion "personajes"
    let charactersSection =  await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND idProduction = "+id+" AND characters = 1");

    //Informacion de cada personaje
    let dataCharacters = await pool.query("SELECT * FROM `"+idioma+"_characters`WHERE production = "+id);
    dataCharacters = JSON.parse(JSON.stringify(dataCharacters));

    for (let index = 0; index < dataCharacters.length; index++) {
        let imagesCharacter = [];
        //Imagenes de los personajes
        let dataTempCharacters = await pool.query("SELECT url FROM `images` WHERE id_character = "+dataCharacters[index].id+" AND idiom = '"+idioma+"' ");
        dataTempCharacters = JSON.parse(JSON.stringify(dataTempCharacters))
        
        for (let x = 0; x < dataTempCharacters.length; x++) {
            imagesCharacter[x] = dataTempCharacters[x].url
        }
        dataCharacters[index].images = imagesCharacter;
    }

    //Fondos
    let fondos = await pool.query("SELECT a.orderSection AS 'order', a.id FROM `backgroundsections` AS a WHERE a.id_production = "+id+" AND idiom = '"+idioma+"' ORDER BY a.orderSection ASC");
    fondos = JSON.parse(JSON.stringify(fondos));

    if (fondos.length > 0) {
        for (let index = 0; index < fondos.length; index++) {
            let backgrounds = [];
            imagesBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND background = "+fondos[index].id);
    
            for (let index = 0; index < imagesBackground.length; index++) {
                backgrounds[index] = imagesBackground[index].url;
            }
            fondos[index].url = backgrounds;
        }
    } else {
        let imagesBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND backgroundImage = 1 AND idProduction = "+idA+" AND idiom = '"+idioma+"' ORDER BY a.orderSection ASC");
        imagesBackground = JSON.parse(JSON.stringify(imagesBackground));
        fondos = imagesBackground;
    }

    //Illustrations
    let illustrations = await pool.query("SELECT a.orderSection AS 'order', a.id, body FROM `illustrationssection` AS a WHERE a.id_production = "+id+" ORDER BY a.orderSection ASC");
    illustrations = JSON.parse(JSON.stringify(illustrations));

    if (illustrations.length > 0) {
        for (let index = 0; index < illustrations.length; index++) {
            let imagesIllustrations = [];
            imagesBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND illustrations = "+fondos[index].id);
    
            for (let index = 0; index < imagesBackground.length; index++) {
                imagesIllustrations[index] = imagesBackground[index].url;
            }
            illustrations[index].url = imagesIllustrations;
        }
    } else {
        let imagesBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND backgroundImage = 1 AND idProduction = "+id);
        imagesBackground = JSON.parse(JSON.stringify(imagesBackground));
        illustrations = imagesBackground;
    }

    console.log(illustrations)
    res.render(idioma+'/productionEspc'+template, { idiom: idioma, production: data[0], ideaImages: ideaImages, charactersSection: charactersSection, characters: dataCharacters, fondos: fondos, illustrations: illustrations});
});

router.get('/:idioma/galeria', async (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data = await pool.query("SELECT * FROM `images`");
    res.render(idioma+'/galery', { title: 'Galeria', images: data, idiom: idioma, });
});

// desde aqui inician las rutas del dashboard

router.get("/dashboard", (req, res, next) => {
    let controlUser = require("../modules/dashboard/login");

    //Si ya está logueado lo manda al home del dashboard
    //if(controlUser.verify(req, res) == true){
        res.redirect("/dashboard/main");
    //}

    res.render("dashboard/login");
});

router.post("/dashboard", async(req, res) => {
    let controlUser = require("../modules/dashboard/login");

    //Datos de logueo
    let user = req.body.user;
    let password = req.body.password;

    redirect("/dashboard/main");
});

//Karlojulio
//1234

router.get("/dashboard/main", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/indexDashboard");
    //};
});

router.get("/dashboard/productions", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        let data = await pool.query("SELECT * FROM `en_productions`");
        res.render("dashboard/productionsDashboard", {productions: data});
    //};
});


router.get("/dashboard/premieres", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/premieresDashboard");
    //};
});

router.get("/dashboard/galery", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        let data = await pool.query("SELECT * FROM `images`");
        res.render('dashboard/galeryDashboard', { images: data });
    //};
});

router.get("/dashboard/usuarios", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/usersDashboard");
    //};
});

router.get("/dashboard/nuevoUsuario", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/newUserDashboard");
    //};
});

router.get("/dashboard/editarUsuario", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editUserDashboard");
    //};
});

router.get("/dashboard/editarProduccion", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    ///if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardSinopsis");
    //};
});

router.get("/dashboard/editarProduccionPersonajes", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardcharacter");
    //};
});

router.get("/dashboard/editarProduccionFauna", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardFauna");
    //};
});


router.get("/dashboard/editarProduccionVerPersonajes", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardSeeCharacters");
    //;
});

router.get("/dashboard/editarProduccionFondos", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardBackground");
    //};
});

router.get("/dashboard/editarProduccionIlustraciones", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardIllustrations");
    //};
});

router.get("/dashboard/fondosEdit", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        res.render("dashboard/editProductionDashboardSeeBackgrounds");
    //};
});

module.exports = router;
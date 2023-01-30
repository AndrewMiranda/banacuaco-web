const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
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

    let data =  await pool.query("SELECT * FROM `premieres` WHERE language = '"+idioma+"' ORDER BY `date` DESC LIMIT 1");
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

    let data =  await pool.query("SELECT a.template, a.id, a.name, a.year, b.name AS format, a.mainImage FROM `productions` AS a LEFT JOIN formats AS b ON b.id = a.format WHERE a.language = '"+idioma+"'");
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
    let data =  await pool.query("SELECT * FROM `productions` WHERE language = '"+idioma+"' AND id = "+id);

    //Imagenes de la seccion de "ideas"
    let ideaImages =  await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND idProduction = "+id+" AND idea = 1");

    //Imagenes de la seccion "personajes"
    let charactersSection =  await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND idProduction = "+id+" AND characters = 1");

    //Informacion de cada personaje
    let dataCharacters = await pool.query("SELECT * FROM `characters` WHERE language = '"+idioma+"' AND production = "+id);
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
    let fondos = await pool.query("SELECT a.orderSection AS 'order', a.id, a.body FROM `backgroundsections` AS a WHERE a.id_production = "+id+" AND idiom = '"+idioma+"' ORDER BY a.orderSection ASC");
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
        let imagesBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND backgroundImage = 1 AND idProduction = "+id+"");
        imagesBackground = JSON.parse(JSON.stringify(imagesBackground));
        fondos = imagesBackground;
    }

    //Illustrations
    let illustrations = await pool.query("SELECT a.orderSection AS 'order', a.id, body FROM `illustrationssection` AS a WHERE a.id_production = "+id+" ORDER BY a.orderSection ASC");
    illustrations = JSON.parse(JSON.stringify(illustrations));

    if (illustrations.length > 0) {
        for (let index = 0; index < illustrations.length; index++) {
            let imagesIllustrations = [];
            imagesBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND illustrations = "+illustrations[index].id);
    
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

    //fauna
    let fauna = await pool.query("SELECT a.orderSection AS 'order', a.id, body FROM `faunasections` AS a WHERE a.id_production = "+id+" ORDER BY a.orderSection ASC");
    fauna = JSON.parse(JSON.stringify(fauna));

    if (fauna.length > 0) {
        for (let index = 0; index < fauna.length; index++) {
            let imagesFauna = [];
            FaunaBackground = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND fauna = "+fauna[index].id);
    
            for (let index = 0; index < FaunaBackground.length; index++) {
                imagesFauna[index] = FaunaBackground[index].url;
            }
            fauna[index].url = imagesFauna;
        }
    } else {
        let imagesFauna = await pool.query("SELECT url FROM `images` WHERE idiom = '"+idioma+"' AND faunaImage = 1 AND idProduction = "+id);
        imagesFauna = JSON.parse(JSON.stringify(imagesFauna));
        fauna = imagesFauna;
    }

    res.render(idioma+'/productionEspc'+template, { idiom: idioma, production: data[0], ideaImages: ideaImages, charactersSection: charactersSection, characters: dataCharacters, fondos: fondos, illustrations: illustrations, fauna: fauna});
});

router.get('/:idioma/galeria', async (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data = await pool.query("SELECT * FROM `images` ORDER BY `images`.`id` DESC");
    res.render(idioma+'/galery', { title: 'Galeria', images: data, idiom: idioma, });
});

// desde aqui inician las rutas del dashboard

router.get("/dashboard", (req, res, next) => {
    let controlUser = require("../modules/dashboard/login");

    if (controlUser.verify(req, res) == true) {
        res.redirect("/dashboard/main");
    } else {
        res.render("dashboard/login");   
    }
});

router.post("/dashboard", async(req, res) => {
    let controlUser = require("../modules/dashboard/login");

    //Datos de logueo
    let user = req.body.user;
    let password = req.body.password;

    if(await controlUser.login(user, password) == true){
        res.cookie('trk500', true);
        res.cookie('userday', user);
        res.redirect("/dashboard/main");
    }else{
        res.redirect("/dashboard?error=e");
    }

});

router.get("/dashboard/main", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;
        res.render("dashboard/indexDashboard", {user: user});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/productions", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");
    //if(controlUser.verify(req, res) == true){
        let data = await pool.query("SELECT * FROM `en_productions`");
        res.render("dashboard/productionsDashboard", {productions: data});
    //};
});


router.get("/dashboard/premieres", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `premieres` ORDER BY `premieres`.`date` DESC");
        data = JSON.parse(JSON.stringify(data));

        console.log(data);

        res.render("dashboard/premieresDashboard", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/premieresAdd", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;
        res.render("dashboard/premieresNewDashboard", {user: user});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/premieres/create", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        console.log(req.body);
        console.log("---------------");
        console.log(req.files.image);
        console.log("---------------");
        console.log(req.files.image);


        res.redirect("/dashboard/galery");
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarEstreno", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.query.id

        let data = await pool.query("SELECT * FROM `users` WHERE users_id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/editUserDashboard", {user: user, data: data});
        res.render("dashboard/premieresNewDashboard", {user: user});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/galery", async(req, res) => {
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `images` ORDER BY `images`.`id` DESC");
        data = JSON.parse(JSON.stringify(data));
        
        res.render('dashboard/galeryDashboard', {user: user, images: data });
    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.get("/dashboard/galeryAdd", async(req, res) => {
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        res.render('dashboard/galeryDashboardAdd', {user: user});
    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.post("/dashboard/galery/create", async(req, res) => {
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        //Recibir los datos
        let image = req.files.image;
        let autor = req.body.autor;
        let descriptionEn = req.body.descripcionEn;
        let descriptionEs = req.body.descripcionEs;

        //Nombre aleatorio para la imagen
        let randomString = require("../modules/randomString.js");

        let imageName = randomString.randomString(12);

        let wrongName = 1;

        while (wrongName == 1) {
            let verifyName = await pool.query("SELECT url FROM `images` WHERE url = '"+imageName+".jpg'");
            if (verifyName.length > 0) {
                imageName = randomString.randomString(12);
                continue;
            } else {
                wrongName = 0;
                continue
            }
        }
        imageName += ".jpeg"
        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);
        
        await pool.query(`INSERT INTO images(url, idiom, author, descEn, descEs) VALUES ('${imageName}', 'en', '${autor}', '${descriptionEn}', '${descriptionEs}')`)

        res.redirect("/dashboard/galery");

    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.post("/dashboard/galery/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        //Recibir ID a borrar
        id = req.params.id;

        let data = await pool.query(`SELECT * FROM images WHERE id = ${id}`);
        data = JSON.parse(JSON.stringify(data));

        try {
            fs.unlinkSync('./public/content/'+data[0].url);
            let dataB = await pool.query(`DELETE FROM images WHERE id = ${data[0].id}`);
            res.send({"status":200});
        } catch(err) {
            res.send({"status":500});
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});


router.get("/dashboard/usuarios", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `users`");
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/usersDashboard", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.get("/dashboard/nuevoUsuario", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        res.render("dashboard/newUserDashboard", {user: user});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/usuarios/create", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        let user = req.body.user;
        let password = req.body.password;

        let data = await pool.query("INSERT INTO `users`(`users_username`, `users_password`) VALUES ('"+user+"','"+password+"')");

        res.redirect("/dashboard/usuarios")

    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarUsuario", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.query.id

        let data = await pool.query("SELECT * FROM `users` WHERE users_id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/editUserDashboard", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.post("/dashboard/usuarios/edit/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        let id = req.params.id;
        let user = req.body.user;
        let password = req.body.password1;

        let data = await pool.query("UPDATE `users` SET `users_username`='"+user+"',`users_password`='"+password+"' WHERE `users_id` = "+id);

        res.redirect("/dashboard/usuarios")

    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/usuarios/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        //Recibir ID a borrar
        id = req.params.id;

        let data = await pool.query(`DELETE FROM users WHERE users_id = ${id}`);

        res.send({"status":200});
    }else{
        res.redirect("/dashboard?error=n");
    }
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

router.get('/favicon.ico', (req, res) => {
    // Use actual relative path to your .ico file here
    res.sendFile(path.resolve(__dirname, '../favicon.ico'));
});

module.exports = router;
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

    let data =  await pool.query("SELECT * FROM `premieres` WHERE language = '"+idioma+"' ORDER BY id DESC;");
    data = JSON.parse(JSON.stringify(data));

    res.render(idioma+'/home', { title: 'home', idiom: idioma, data: data});
});

router.get('/:idioma/servicios', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data = await pool.query("SELECT * FROM `servicesvideo`");
    data = JSON.parse(JSON.stringify(data));

    res.render(idioma+'/services', { title: 'services', idiom: idioma, data: data[0].url });
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
    res.render(idioma+"/contact", { title: 'contact', idiom: idioma, data: data});
});

router.get('/:idioma/nosotros', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    if(idioma == "en"){
        let data = await pool.query("SELECT url, name, cargo_en AS cargo FROM `team`"); 

        data = JSON.parse(JSON.stringify(data));

        res.render(idioma+'/nosotros', { title: 'nosotros', idiom: idioma, data: data });
    }else{
        let data = await pool.query("SELECT url, name, cargo_es AS cargo FROM `team`"); 
        data = JSON.parse(JSON.stringify(data));

        res.render(idioma+'/nosotros', { title: 'nosotros', idiom: idioma, data: data });
    }
});

router.get('/:idioma/producciones', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    let data =  await pool.query("SELECT a.id, a.name, a.year, b.name AS format, a.mainImage FROM `productions` AS a LEFT JOIN formats AS b ON b.id = a.format WHERE a.language = '"+idioma+"'");

    res.render(idioma+'/productions', { title: 'nosotros', idiom: idioma, productions : data});
});

router.get('/:idioma/produccion', async(req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

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

    res.render(idioma+'/productionEspc', { idiom: idioma, production: data[0], ideaImages: ideaImages, charactersSection: charactersSection, characters: dataCharacters, fondos: fondos});
});

router.get('/:idioma/galeria', async (req, res) => {
    let idioma = req.params.idioma;
    if(idioma == undefined) idioma = defaultLanguage;

    if (idioma == "en") {
        let data = await pool.query("SELECT url, miniature, author, descEn AS description FROM `images` WHERE idProduction IS NULL ORDER BY `images`.`id` DESC");
        res.render(idioma+'/galery', { title: 'Galeria', images: data, idiom: idioma, });
    } else {
        let data = await pool.query("SELECT url, miniature, author, descEs AS description FROM `images` WHERE idProduction IS NULL ORDER BY `images`.`id` DESC");
        res.render(idioma+'/galery', { title: 'Galeria', images: data, idiom: idioma, });
    }
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

router.get("/dashboard/premieres", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `premieres` ORDER BY `premieres`.`date` DESC");
        data = JSON.parse(JSON.stringify(data));

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

router.post("/dashboard/premieres/create", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let name = req.body.name;
        let idioma = req.body.language;
        let desciption = req.body.description;
        let image = req.files.image;
        let character = req.files.character;

        //Librería para nombre aleatorio para la imagen
        let randomString = require("../modules/randomString.js");

        let imageName = randomString.randomString(12);
        let imageNameB = randomString.randomString(12);

        imageName += ".jpeg";
        imageNameB += ".jpeg";
        
        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/premieres/${imageName}`);
        sharp(character.data).jpeg({ mozjpeg: true }).toFile(`./public/content/premieres/${imageNameB}`);

        let data = await pool.query("INSERT INTO `premieres`(`title`, `language`, `description`, `image`, `characters`) VALUES ('"+name+"', '"+idioma+"', '"+desciption+"', '"+imageName+"', '"+imageNameB+"')");

        res.redirect("/dashboard/premieres");
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

        let data = await pool.query("SELECT * FROM `premieres` WHERE id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/premieresEditDashboard.ejs", {user: user, data: data});

    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/premieres/edit/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        let id = req.params.id;
        let name = req.body.name;
        let idioma = req.body.language;
        let desciption = req.body.description;

        if (req.files) {
            //Consulta para recoger el nombre las imagenes a eliminar
            let oldImages = await pool.query("SELECT `image`, `characters` FROM `premieres` WHERE `id` = "+id);
            oldImages = JSON.parse(JSON.stringify(oldImages));
            
            if ("image" in req.files) {
                let image = req.files.image;
                if ("character" in req.files) {
                    let character = req.files.character;
                    try {
                        //Librería para nombre aleatorio para la imagen
                        let randomString = require("../modules/randomString.js");

                        let imageName = randomString.randomString(12);
                        let imageNameB = randomString.randomString(12);

                        imageName += ".jpeg";
                        imageNameB += ".jpeg";

                        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/premieres/${imageName}`);
                        sharp(character.data).jpeg({ mozjpeg: true }).toFile(`./public/content/premieres/${imageNameB}`);
                        fs.unlinkSync('./public/content/premieres/'+oldImages[0].image);
                        fs.unlinkSync('./public/content/premieres/'+oldImages[0].characters);
                        
                        let data = await pool.query("UPDATE `premieres` SET `title`='"+name+"',`language`='"+idioma+"',`description`='"+desciption+"', `image`='"+imageName+"', `characters` = '"+imageNameB+"' WHERE `id` = "+id);

                        res.redirect("/dashboard/premieres");
                    } catch(err) {
                        res.send({"status":500});
                        console.log(err)
                    }
                }else{
                    try {
                        //Librería para nombre aleatorio para la imagen
                        let randomString = require("../modules/randomString.js");

                        let imageName = randomString.randomString(12);
                        imageName += ".jpeg";

                        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/premieres/${imageName}`);
                        fs.unlinkSync('./public/content/premieres/'+oldImages[0].image);

                        let data = await pool.query("UPDATE `premieres` SET `title`='"+name+"',`language`='"+idioma+"',`description`='"+desciption+"', `image` = '"+imageName+"' WHERE `id` = "+id);

                        res.redirect("/dashboard/premieres");

                    } catch(err) {
                        res.send({"status":500});
                        console.log(err)
                    }
                }
            }else{
                if ("character" in req.files) {
                    let character = req.files.character;

                    try {
                        //Librería para nombre aleatorio para la imagen
                        let randomString = require("../modules/randomString.js");

                        let imageName = randomString.randomString(12);
                        imageName += ".jpeg";

                        sharp(character.data).jpeg({ mozjpeg: true }).toFile(`./public/content/premieres/${imageName}`);
                        fs.unlinkSync('./public/content/premieres/'+oldImages[0].characters);

                        let data = await pool.query("UPDATE `premieres` SET `title`='"+name+"',`language`='"+idioma+"',`description`='"+desciption+"', `characters` = '"+imageName+"' WHERE `id` = "+id);

                        res.redirect("/dashboard/premieres");

                    } catch(err) {
                        res.send({"status":500});
                        console.log(err)
                    }
                }else{
                    let data = await pool.query("UPDATE `premieres` SET `title`='"+name+"',`language`='"+idioma+"',`description`='"+desciption+"' WHERE `id` = "+id);
                    res.redirect("/dashboard/premieres");
                }
            }
        }else{
            let data = await pool.query("UPDATE `premieres` SET `title`='"+name+"',`language`='"+idioma+"',`description`='"+desciption+"' WHERE `id` = "+id);
            res.redirect("/dashboard/premieres");
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/premieres/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        //Recibir ID a borrar
        id = req.params.id;

        let data = await pool.query(`SELECT image, characters FROM premieres WHERE id = ${id}`);
        data = JSON.parse(JSON.stringify(data));

        try {
            fs.unlinkSync('./public/content/premieres/'+data[0].image);
            fs.unlinkSync('./public/content/premieres/'+data[0].characters);
            let dataB = await pool.query(`DELETE FROM premieres WHERE id = ${id}`);
            res.send({"status":200});
        } catch(err) {
            res.send({"status":500});
            console.log(err);
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/galery", async(req, res) => {
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `images` WHERE idProduction IS NULL ORDER BY `id` DESC");
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
        let miniature = req.files.miniature;
        let autor = req.body.autor;
        let descriptionEn = req.body.descripcionEn;
        let descriptionEs = req.body.descripcionEs;

        //Librería para nombre aleatorio para la imagen
        let randomString = require("../modules/randomString.js");

        let imageName = randomString.randomString(12);
        let imageName2 = randomString.randomString(12);

        let wrongName = 1;
        let wrongName2 = 1;

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

        while (wrongName2 == 1) {
            let verifyName = await pool.query("SELECT url FROM `images` WHERE url = '"+imageName2+".jpg'");
            if (verifyName.length > 0) {
                imageName2 = randomString.randomString(12);
                continue;
            } else {
                wrongName2 = 0;
                continue
            }
        }

        imageName += ".jpeg";
        imageName2 += ".jpeg";

        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);
        sharp(miniature.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName2}`);
        
        await pool.query(`INSERT INTO images(url, miniature ,idiom, author, descEn, descEs) VALUES ('${imageName}', '${imageName2}', 'en', '${autor}', '${descriptionEn}', '${descriptionEs}')`);

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
            console.log(err);
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
        
        if(id == 1){
            res.redirect("/dashboard/usuarios");
        }else{
        	let data = await pool.query("SELECT * FROM `users` WHERE users_id = "+id);
            data = JSON.parse(JSON.stringify(data));

            res.render("dashboard/editUserDashboard", {user: user, data: data});
        }
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

        if (id == 1) {
            res.send({"status":500});
            console.log(err);
        }else{
            let data = await pool.query(`DELETE FROM users WHERE users_id = ${id}`);
            res.send({"status":200});
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/productions", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT id, name, mainImage FROM `productions` ORDER BY id DESC");
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/productionsDashboard", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.get("/dashboard/addProduction", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let formats = await pool.query("SELECT * FROM `formats`;");
        formats = JSON.parse(JSON.stringify(formats));

        res.render("dashboard/addProductionDashboardSinopsis", {user: user, submenu: "disabled", formats: formats});
    }else{
        res.redirect("/dashboard?error=n");
    };
});

router.post("/dashboard/production/create", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        let name = req.body.name;
        let video = req.body.video;
        let language = req.body.language;
        let format = req.body.formato;
        let description = req.body.description;
        let year = req.body.year;
        let image = req.files.mainImage;
        let miniature = req.files.miniature;

        if (req.files) {
            //Librería para nombre aleatorio para la imagen
            let randomString = require("../modules/randomString.js");

            let imageName = randomString.randomString(12);
            let imageNameB = randomString.randomString(12);

            let wrongName = 1;
            let wrongNameB = 1;

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

            while (wrongNameB == 1) {
                let verifyName = await pool.query("SELECT url FROM `images` WHERE url = '"+imageNameB+".jpg'");
                if (verifyName.length > 0) {
                    imageNameB = randomString.randomString(12);
                    continue;
                } else {
                    wrongNameB = 0;
                    continue
                }
            }

            imageName += ".jpeg";
            sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);

            imageNameB += ".jpeg";
            sharp(miniature.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageNameB}`);

            await pool.query("INSERT INTO `productions`(`name`, `language`, `format`, `year`, `mainImage`, `miniature`, `synopsis`, `urlVideo`) VALUES ('"+name+"','"+language+"','"+format+"','"+year+"','"+imageName+"', '"+imageNameB+"','"+description+"','"+video+"')");

            let dataB = await pool.query("SELECT id FROM `productions` ORDER BY `id`DESC LIMIT 1; ");
            dataB = JSON.parse(JSON.stringify(dataB));

            res.redirect("/dashboard/editarProduccion?id="+dataB[0].id);
        }else{
            res.redirect("/dashboard/addProduction");
        }

    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarProduccion", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.query.id;

        let formats = await pool.query("SELECT * FROM `formats`;");
        formats = JSON.parse(JSON.stringify(formats));

        let data = await pool.query("SELECT * FROM `productions` WHERE id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/editProductionDashboardSinopsis", {user: user, submenu: "enabled", formats: formats, data: data, idProd: data[0].id});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/production/editSynopsis/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.params.id;
        let name = req.body.name;
        let video = req.body.video;
        let language = req.body.language;
        let format = req.body.formato;
        let description = req.body.description;
        let year = req.body.year;
        
        if (req.files) {
            let image = req.files.mainImage;
            let miniature = req.files.miniature;

            //Librería para nombre aleatorio para la imagen
            let randomString = require("../modules/randomString.js");

            let imageName = randomString.randomString(12);
            let imageNameB = randomString.randomString(12);

            let wrongName = 1;
            let wrongNameB = 1;

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

            while (wrongNameB == 1) {
                let verifyName = await pool.query("SELECT url FROM `images` WHERE url = '"+imageNameB+".jpg'");
                if (verifyName.length > 0) {
                    imageNameB = randomString.randomString(12);
                    continue;
                } else {
                    wrongNameB = 0;
                    continue
                }
            }

            imageName += ".jpeg"
            sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);

            imageNameB += ".jpeg"
            sharp(miniature.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageNameB}`);

            let data = await pool.query("UPDATE `productions` SET `name`='"+name+"',`language`='"+language+"',`format`='"+format+"',`year`='"+year+"',`synopsis`='"+description+"',`urlVideo`='"+video+"', `mainImage` = '"+imageName+"', `miniature` = '"+imageNameB+"' WHERE `id` = "+id);
            data = JSON.parse(JSON.stringify(data));
            res.redirect("/dashboard/editarProduccion?id="+id);
            
        }else{
            let data = await pool.query("UPDATE `productions` SET `name`='"+name+"',`language`='"+language+"',`format`='"+format+"',`year`='"+year+"',`synopsis`='"+description+"',`urlVideo`='"+video+"' WHERE `id` = "+id);
            data = JSON.parse(JSON.stringify(data));
            res.redirect("/dashboard/editarProduccion?id="+id);
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/productions/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        //Recibir ID a borrar
        id = req.params.id;

        try {
            dataImages = await pool.query("SELECT id, url FROM `images` WHERE idProduction = "+id);
            dataImages = JSON.parse(JSON.stringify(dataImages));

            if (dataImages.length > 0) {
                for (const iterator of dataImages) {
                    try {
                        fs.unlinkSync('./public/content/'+iterator.url);
                        await pool.query(`DELETE FROM images WHERE id = ${iterator.id}`);
                    } catch (error) {
                        res.send({"status":500});
                        console.log(err);
                    }
                }
            }
            
            await pool.query(`DELETE FROM backgroundsections WHERE id_production = ${id}`);

            await pool.query(`DELETE FROM characters WHERE production = ${id}`);

            await pool.query(`DELETE FROM faunasections WHERE id_production = ${id}`);

            let imageProduction = await pool.query("SELECT mainImage FROM `productions` WHERE id = "+id);
            imageProduction = JSON.parse(JSON.stringify(imageProduction));
            try {
                fs.unlinkSync('./public/content/'+imageProduction[0].mainImage);
                await pool.query(`DELETE FROM productions WHERE id = ${id}`);
            } catch (error) {
                res.send({"status":500});
                console.log(err);
            }

            res.send({"status":200});
        } catch (error) {
            res.send({"status":500});   
            console.log(err);
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarProduccionVerPersonajes", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.query.id;
        let data = await pool.query("SELECT a.id, a.name, b.url FROM `characters` AS a LEFT JOIN images AS b ON b.id_character = a.id WHERE a.production = "+id+" GROUP BY id;");
        data = JSON.parse(JSON.stringify(data));

        let dataB = await pool.query("SELECT charactersSection FROM `productions` WHERE id = "+id+";");
        dataB = JSON.parse(JSON.stringify(dataB));


        res.render("dashboard/editProductionDashboardSeeCharacters", {user: user, submenu: "enabled", data: data, idProd: id, dataB: dataB[0].charactersSection});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarProduccionPersonajes", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;
    
        let id = req.query.id;
        let idProd = req.query.idProd;

        let data = await pool.query("SELECT * FROM `characters` WHERE id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/editProductionDashboardcharacter",{user: user, submenu: "enabled", idProd: idProd, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/character/edit/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;
    
        let id = req.params.id;
        let idProd = req.query.idProd;

        let name = req.body.name;
        let color = req.body.color;
        let description = req.body.description;

        let data = await pool.query("UPDATE `characters` SET `name`= '"+name+"',`description`='"+description+"',`color`='"+color+"' WHERE `id` = "+id);

        if (req.files) {
            //Librería para nombre aleatorio para la imagen
            let randomString = require("../modules/randomString.js");

            let dataImages = await pool.query("SELECT id, url, idiom FROM `images` WHERE id_character = "+id);
            dataImages = JSON.parse(JSON.stringify(dataImages));

            if("mainImage" in req.files && "mainImage2" in req.files){
                let image = req.files.mainImage;
                let imageB = req.files.mainImage2;

                let imageName = randomString.randomString(12);
                let imageNameB = randomString.randomString(12);

                let wrongName = 1;
                let wrongNameB = 1;

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

                while (wrongNameB == 1) {
                    let verifyName = await pool.query("SELECT url FROM `images` WHERE url = '"+imageNameB+".jpg'");
                    if (verifyName.length > 0) {
                        imageNameB = randomString.randomString(12);
                        continue;
                    } else {
                        wrongNameB = 0;
                        continue
                    }
                }

                imageName += ".jpeg";
                imageNameB += ".jpeg";

                try {
                    sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);
                    sharp(imageB.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageNameB}`);

                    let insertImages = await pool.query("INSERT INTO `images`(`url`, `idProduction`, `id_character`, idiom) VALUES ('"+imageName+"', '"+idProd+"', '"+id+"', '"+dataImages[0].idiom+"'), ('"+imageNameB+"', '"+idProd+"', '"+id+"', '"+dataImages[0].idiom+"')");

                    fs.unlinkSync('./public/content/'+dataImages[0].url);
                    fs.unlinkSync('./public/content/'+dataImages[1].url);

                    let deleteOld = await pool.query("DELETE FROM `images` WHERE id = '"+dataImages[0].id+"' OR id = '"+dataImages[1].id+"';");
                } catch (error) {
                    console.log(error);
                    res.redirect("error");
                }
            }else if ("mainImage" in req.files) {
                let image = req.files.mainImage;
                
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

                imageName += ".jpeg";

                try {
                    sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);

                    let insertImages = await pool.query("INSERT INTO `images`(`url`, `idProduction`, `id_character`, idiom) VALUES ('"+imageName+"', '"+idProd+"', '"+id+"', '"+dataImages[0].idiom+"')");

                    fs.unlinkSync('./public/content/'+dataImages[0].url);
                    let deleteOld = await pool.query("DELETE FROM `images` WHERE id = '"+dataImages[0].id+"'");

                } catch (error) {
                    console.log(error);
                    res.redirect("error");
                }
            } else if ("mainImage2" in req.files) {
                let image = req.files.mainImage2;
                
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

                imageName += ".jpeg";

                try {
                    sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);

                    let insertImages = await pool.query("INSERT INTO `images`(`url`, `idProduction`, `id_character`, idiom) VALUES ('"+imageName+"', '"+idProd+"', '"+id+"', '"+dataImages[0].idiom+"')");

                    fs.unlinkSync('./public/content/'+dataImages[1].url);
                    let deleteOld = await pool.query("DELETE FROM `images` WHERE id = '"+dataImages[1].id+"'");
                } catch (error) {
                    console.log(error);
                    res.redirect("error");
                }
            }
        }

        res.redirect("/dashboard/editarProduccionVerPersonajes?id="+idProd)
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/crearProduccionPersonajes", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd

        res.render("dashboard/crearProduccionPersonajes",{user: user, submenu: "enabled", idProd: idProd});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/character/add/:id", async(req, res) => {
        //Verificación de sesión
        let controlUser = require("../modules/dashboard/login");

        if(controlUser.verify(req, res) == true){
            user = req.cookies.userday;

            let idProd = req.params.id;

            let name = req.body.name;
            let color = req.body.color;
            let description = req.body.description;

            let data = await pool.query("SELECT language FROM `productions` WHERE id = "+idProd);

            let insertCharacter = await pool.query("INSERT INTO `characters`(`name`, `description`, `color`, `production`, `language`) VALUES ('"+name+"','"+description+"','"+color+"',"+idProd+",'"+data[0].language+"')");

            let dataCharacter = await pool.query("SELECT id FROM `characters` WHERE production = "+idProd+" ORDER BY id DESC LIMIT 1");
            let id = dataCharacter[0].id

            if (req.files) {
                //Librería para nombre aleatorio para la imagen
                let randomString = require("../modules/randomString.js");
    
                if("mainImage" in req.files && "mainImage2" in req.files){
                    let image = req.files.mainImage;
                    let imageB = req.files.mainImage2;
    
                    let imageName = randomString.randomString(12);
                    let imageNameB = randomString.randomString(12);
    
                    let wrongName = 1;
                    let wrongNameB = 1;
    
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
    
                    while (wrongNameB == 1) {
                        let verifyName = await pool.query("SELECT url FROM `images` WHERE url = '"+imageNameB+".jpg'");
                        if (verifyName.length > 0) {
                            imageNameB = randomString.randomString(12);
                            continue;
                        } else {
                            wrongNameB = 0;
                            continue
                        }
                    }
    
                    imageName += ".jpeg";
                    imageNameB += ".jpeg";
    
                    try {
                        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);
                        sharp(imageB.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageNameB}`);
    
                        let insertImages = await pool.query("INSERT INTO `images`(`url`, `idProduction`, `id_character`, idiom) VALUES ('"+imageName+"', '"+idProd+"', '"+id+"', '"+data[0].language+"'), ('"+imageNameB+"', '"+idProd+"', '"+id+"', '"+data[0].language+"')");
                    } catch (error) {
                        console.log(error);
                        res.redirect("error");
                    }
                }else if ("mainImage" in req.files) {
                    let image = req.files.mainImage;
                    
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
    
                    imageName += ".jpeg";
    
                    try {
                        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);
    
                        let insertImages = await pool.query("INSERT INTO `images`(`url`, `idProduction`, `id_character`, idiom) VALUES ('"+imageName+"', '"+idProd+"', '"+id+"', '"+data[0].language+"')");

                    } catch (error) {
                        console.log(error);
                        res.redirect("error");
                    }
                }
            }

            res.redirect("/dashboard/editarProduccionVerPersonajes?id="+idProd);
        }else{
            res.redirect("/dashboard?error=n");
        }
});

router.post("/dashboard/character/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.params.id;

        let data = await pool.query(`SELECT id, url FROM images WHERE id_character = ${id}`);
        data = JSON.parse(JSON.stringify(data));

        try {
            data.forEach( async element => {
                let deleteImg = await pool.query("DELETE FROM `images` WHERE `id` = "+element.id);
                fs.unlinkSync('./public/content/'+element.url);
            });

            let deleteCharacter = await pool.query("DELETE FROM `characters` WHERE `id` = "+id);

            res.send({"status":200});
        } catch(err) {
            console.log(err)
            res.send({"status":500});
            console.log(err);
        }
        
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarTextCharacter", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd;

        res.render("dashboard/editTextCharacter",{user: user, submenu: "enabled", idProd: idProd});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/character/description/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.params.id;
        let description = req.body.description;

        let data = await pool.query("UPDATE `productions` SET `charactersSection` = '"+description+"' WHERE `id` = "+idProd);

        res.redirect("/dashboard/editarProduccionVerPersonajes?id="+idProd);
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarProduccionFondos", async(req, res) => {
        //Verificación de sesión
        let controlUser = require("../modules/dashboard/login");

        if(controlUser.verify(req, res) == true){
            user = req.cookies.userday;

            let idProd = req.query.id;

            let data = await pool.query("SELECT * FROM `backgroundsections` WHERE id_production = "+idProd+" ORDER BY orderSection ASC;");
            data = JSON.parse(JSON.stringify(data));

            if (data.length > 0) {
                for (let index = 0; index < data.length; index++) {
                    let backgrounds = [];
                    imagesBackground = await pool.query("SELECT url FROM `images` WHERE background = "+data[index].id);

                    for (let index = 0; index < imagesBackground.length; index++) {
                        backgrounds[index] = imagesBackground[index].url;
                    }

                    data[index].url = backgrounds;
                }

                res.render("dashboard/editProductionDashboardBackground", {user: user, submenu: "enabled", idProd: idProd, data: data, title: "Fondos", module: "background"});
            }else{
                res.render("dashboard/editProductionDashboardBackground", {user: user, submenu: "enabled", idProd: idProd, data: data, title: "Fondos", module: "background"});
            }
        }else{
            res.redirect("/dashboard?error=n");
        }
});

router.get("/dashboard/backgroundAddImage", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd;

        let data = await pool.query("SELECT id, idiom, body FROM `backgroundsections` WHERE `id_production` = "+idProd);

        console.log(data[0].idiom)

        res.render("dashboard/backgroundAddImage", {user: user, submenu: "enabled", idProd: idProd, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/backgroundImage/add/:idProd", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.params.idProd;
        let idSection = req.body.section;
        let language = req.body.language;
        let image = req.files.image;
        
        //Librería para nombre aleatorio para la imagen
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

        imageName += ".jpeg";
        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/${imageName}`);

        let data = await pool.query("INSERT INTO `images`(`url`, `idiom`, `idProduction`, `background`, `backgroundImage`) VALUES ('"+imageName+"','"+language+"','"+idProd+"','"+idSection+"',1)");

        res.redirect("/dashboard/editarProduccionFondos?id="+idProd);
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/background/delete/:idProd", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.params.idProd;

        try {
            fs.unlinkSync('./public/content/'+idProd);
            let data = await pool.query("DELETE FROM `images` WHERE `url` = '"+idProd+"'");

            res.send({"status":200});
        } catch (error) {
            res.send({"status":500});
            console.log(err);
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/backgroundAddSection", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd;

        res.render("dashboard/backgroundAddSection", {user: user, submenu: "enabled", idProd: idProd});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/backgroundSection/add/:idProd", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.params.idProd;
        let body = req.body.body;
        let order = req.body.order;

        let languageProd = await pool.query("SELECT language FROM `productions` WHERE id = "+idProd);
        languageProd = JSON.parse(JSON.stringify(languageProd));

        let data = await pool.query("INSERT INTO `backgroundsections`(`id_production`, `body`, `orderSection`, idiom) VALUES ('"+idProd+"','"+body+"','"+order+"', '"+languageProd[0].language+"')");

        res.redirect("/dashboard/editarProduccionFondos?id="+idProd);
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/backgroundEditSection", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd;
        let id = req.query.id;

        let data = await pool.query("SELECT id, body, orderSection FROM `backgroundsections` WHERE id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/backgroundEditSection", {user: user, submenu: "enabled", idProd: idProd, data: data[0]});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/backgroundSection/edit/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd;
        let id = req.params.id;
        
        let body = req.body.body;
        let order = req.body.order;

        let data = await pool.query("UPDATE `backgroundsections` SET `body`='"+body+"',`orderSection`='"+order+"' WHERE `id` = "+id);

        res.redirect("/dashboard/editarProduccionFondos?id="+idProd);
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/backgroundSection/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let idProd = req.query.idProd;
        let id = req.params.id;
        
        let dataA = await pool.query("SELECT id FROM `images` WHERE background = "+id);
        dataA = JSON.parse(JSON.stringify(dataA));
        console.log(dataA.length)

        if (dataA.length > 0) {
            let dataDelete = await pool.query("DELETE FROM `images` WHERE background = "+id);
            let data = await pool.query("DELETE FROM `backgroundsections` WHERE `id` = "+id);

            res.redirect("/dashboard/editarProduccionFondos?id="+idProd);
        } else {
            let data = await pool.query("DELETE FROM `backgroundsections` WHERE `id` = "+id);

            res.redirect("/dashboard/editarProduccionFondos?id="+idProd);
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});

///////////
// Team //
/////////

router.get("/dashboard/team", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `team`");
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/seeTeams", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/teamAdd", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let data = await pool.query("SELECT * FROM `team`");
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/addTeam", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/team/create", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let name = req.body.name;
        let cargoEn = req.body.cargoen;
        let cargoEs = req.body.cargoes;
        let image = req.files.image;

        //Librería para nombre aleatorio para la imagen
        let randomString = require("../modules/randomString.js");
        let imageName = randomString.randomString(12);
        imageName += ".jpeg";
        sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/team/${imageName}`);

        let data = await pool.query("INSERT INTO `team`(`url`, `name`, `cargo_en`, `cargo_es`) VALUES ('"+imageName+"','"+name+"','"+cargoEn+"','"+cargoEs+"')");

        res.redirect("/dashboard/team");
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/team/delete/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.params.id;

        let data = await pool.query("DELETE FROM `team` WHERE id = "+id);

        res.send({"status":200});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/editarEquipo", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.query.id;

        let data = await pool.query("SELECT * FROM `team` WHERE id = "+id);
        data = JSON.parse(JSON.stringify(data));

        res.render("dashboard/editTeam", {user: user, data: data});
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.post("/dashboard/team/edit/:id", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let id = req.params.id;

        let name = req.body.name;
        let cargoEn = req.body.cargoen;
        let cargoEs = req.body.cargoes;

        if (req.files) {
            let randomString = require("../modules/randomString.js");
            let image = req.files.image;

            let imageName = randomString.randomString(12);

            let wrongName = 1;

            while (wrongName == 1) {
                let verifyName = await pool.query("SELECT url FROM `team` WHERE url = '"+imageName+".jpg'");
                if (verifyName.length > 0) {
                    imageName = randomString.randomString(12);
                    continue;
                } else {
                    wrongName = 0;
                    continue
                }
            }

            imageName += ".jpeg";

            try {
                sharp(image.data).jpeg({ mozjpeg: true }).toFile(`./public/content/team/${imageName}`);
                await pool.query(`UPDATE team SET url ='${imageName}' ,name ='${name}',cargo_en='${cargoEn}',cargo_es='${cargoEs}' WHERE id = ${id}`);
                res.redirect("/dashboard/team");
            } catch(err) {
                res.redirect("/dashboard/team");
            }
        }else{
            try {
                await pool.query(`UPDATE team SET name ='${name}',cargo_en='${cargoEn}',cargo_es='${cargoEs}' WHERE id = ${id}`);
                res.redirect("/dashboard/team");
            } catch(err) {
                res.redirect("/dashboard/team");
            }
        }
    }else{
        res.redirect("/dashboard?error=n");
    }
});


router.get("/dashboard/services", (req, res) => {
        //Verificación de sesión
        let controlUser = require("../modules/dashboard/login");

        if(controlUser.verify(req, res) == true){
            user = req.cookies.userday;

            res.render("dashboard/editVideoServices", {user: user});
        }else{
            res.redirect("/dashboard?error=n");
        }
});

router.post("/dashboard/services/edit", async(req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;

        let url = req.body.url;
        
        let data = await pool.query("UPDATE `servicesvideo` SET `url`='"+url+"' WHERE `id` = 1");
        
        res.redirect("/dashboard");

    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get("/dashboard/fondosEdit", (req, res) => {
    //Verificación de sesión
    let controlUser = require("../modules/dashboard/login");

    if(controlUser.verify(req, res) == true){
        user = req.cookies.userday;
    }else{
        res.redirect("/dashboard?error=n");
    }
});

router.get('/favicon.ico', (req, res) => {
    // Use actual relative path to your .ico file here
    res.sendFile(path.resolve(__dirname, '../favicon.ico'));
});

module.exports = router;
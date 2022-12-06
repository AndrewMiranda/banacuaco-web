const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'home' });
});

router.get('/servicios', (req, res) => {
    res.render('services', { title: 'services' });
});


router.get('/contacto', (req, res) => {
    res.render('contact', { title: 'contact' });
});

router.get('/nosotros', (req, res) => {
    res.render('nosotros', { title: 'nosotros' });
});

router.get('/producciones', (req, res) => {
    res.render('productions', { title: 'nosotros' });
});

router.get('/produccion', (req, res) => {
    res.render('productionEspc', { title: 'nosotros' });
});

router.get('/produccion2', (req, res) => {
    res.render('productionEspc2', { title: 'nosotros' });
});


router.get('/galeria', (req, res) => {
    res.render('galery', { title: 'nosotros' });
});

// desde aqui inician las rutas del dashboard

router.get("/dashboard", (req, res) => {
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


router.get("/dashboard/alertaModal", (req, res) => {
    res.render("alertaModal");
});



module.exports = router;
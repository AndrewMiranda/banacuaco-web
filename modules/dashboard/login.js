//Módulo encargado del logueo

module.exports.login = async function login(user, password){
    const pool = require("../../config/dbConnection");

    let data = await pool.query(`SELECT * FROM users WHERE users_username = "${user}" AND users_password = "${password}"`);

    if (data.length > 0) return true; else return false;

}

module.exports.verify = function verify(req, res){
    
    if(req.cookies.session == "true"){
        return true;
    }else{
        res.cookie("trk340s" , true).redirect("/dashboard?error=2");
    }

}
module.exports.contact = async function contacts(nombre, mensaje, emails) {
    const pool = require("../config/dbConnection");
    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        port: 587, // port for secure SMTP
        secureConnection: false,
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
        user: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        pass: 'xxxxxxxxxxxxxxx'
        }
    });

        let mailOptions = {
            from: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            to: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
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
                <p style="text-align: center; color: #000;font-size: 18px;"> el mensaje recibido es el siguiente:</p>
                <p style="text-align: center; color: #000;font-size: 18px;"> ${mensaje}</p>
            </body>
            </html> `,
            attachments: [{
                filename: 'BANACUACO Banner Youtube 2022 web.jpg',
                path: './public/images/BANACUACO Banner Youtube 2022 web.jpg',
                cid: 'Bna' //same cid value as in the html img src
            }]
        };
        pool.query(`INSERT INTO contact(email, message, name) VALUES ("${emails}", "${mensaje}", "${nombre}")`)
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            return error;
            } else {
                return 'Email sent: ' + info.response;
            }
        }); 
}
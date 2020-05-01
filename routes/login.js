const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express();

const Usuario = require('../models/usuario');
const { verificarToken } = require('../middlewares/authentication');

app.post('/login', verificarToken, (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        /* Si el email no se encuentra y el usuario es null */
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) O Constraseña Incorrecto'
                }
            });
        }
        /* compara constraseñas, la que llega y la de la DB */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario O (Constraseña) Incorrecto'
                }
            });
        }
        /* Generar el token */
        let token = jwt.sign({
            /* Aqui esta el payload */
            usuario: usuarioDB
                /* Aqui esta la llave secreta o firma(string) */
        }, process.env.FIRMA, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

/* Configuraciones De Google */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    /* async Retorna una promesa, entonces puedo retornar un JSON() */
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
// verify().catch(console.error);


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    /* Manejar La Respuesta De La Promesa Segunda Forma(CORTA) */
    const googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                error: err
            });
        });

    /* Validar El User Google En La Base De Datos */
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* Aqui Ya Sabemos Que El Usuario Se Registro En Algun Momento En La Aplicación */
        if (usuarioDB) {
            /* Validar Usuario Que No Se Haya Iniciado Sesión Sin Google(Normal) Anteriormente */
            /* Si No Lo Hizo Con Google Por Primera Vez, Sino Con Autenticación Normal, y Despues Lo Quiere Hacer Por Google Le Devolvemos Esta Respuesta */
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Utilizar La Autenticación Normal'
                    }
                });
            } else {
                /* Si La Primera Vez Lo Hizo Con Google, Entonces, Renovamos El Token Del Usuario Por Que Si Se Registro Con Google */
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.FIRMA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            /* Si El Usuario No Existen En La Base De Datos Y Hace Loguin Por Primera Vez Con Google */
            let usuario = new Usuario();

            /*Estas Propiedades Se Pueden Establecer En El Constructor O Tambien De Esta Forma */
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; // Solo Por Que Es Obligatoria En El Modelo

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.FIRMA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });

    /* Manejar La Respuesta De La Promesa Primera Forma(LARGA) */
    /* verify(token)
        .then(data => {
            return res.json({
                ok: true,
                googleUser: data
            });
        })
        .catch(err => {
            return res.status(403).json({
                ok: false,
                error: err
            });
        })
 */
});

module.exports = app;
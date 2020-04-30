const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

module.exports = app;
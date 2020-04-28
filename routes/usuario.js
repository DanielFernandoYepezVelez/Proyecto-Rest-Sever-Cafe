const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

/* Peticiones que esta escuchando el servidor Por el
puerto 3000*/
app.get('/usuario', (req, res) => {
    res.json('get Usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    /* Ingresar la DATA en la BD */
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        /* Forma #1, pero el campo Password se sigue mostrando */
        usuarioDB.password = null;

        /* El status ya viene implicito cuando
        es true */
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    /* Est es el que se reemplazo */
    // res.json({
    //     "persona": body
    // });
});

/* Recibiendo parametro id */
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

module.exports = app;
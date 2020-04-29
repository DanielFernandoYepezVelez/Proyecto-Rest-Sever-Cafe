const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();

const Usuario = require('../models/usuario');

/* Optener 16 Usuarios Paginados */
app.get('/usuarios', (req, res) => {

    /* Parametros Opcionales En La URL, CON GET*/
    // let { desde } = req.query;
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite)

    Usuario.find({ estado: true }, 'role estado google nombre email img') // El String es una condición que me filtra los campos que renderiso
        .skip(desde)
        .limit(limite)
        .exec(async(err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            /* Contar El Total De Registros del documento Usuario */
            /* Para No Utilizar Un Callback */
            /* Debe Tener la misma condicion que el find({}) */
            let conteo = await Usuario.countDocuments({ estado: true });

            res.json({
                ok: true,
                usuarioDB,
                cuantos: conteo
            });
        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // Esto es un metodo SINCRONO
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

        /* Forma #1, pero el campo Password se sigue mostrando Al usuario, la idea es que este campo no se vea para el usuario */
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

/* Eliminar Usuario Fisicamente De La Base De Datos */
/* app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                err: {
                    message: 'El Usuario No Existe En La Base De Datos'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});
 */

/* Eliminar Usuario Pero Cambiando El Estado En La Base De Datos */
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    /* Data que se va a actualizar */
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado.estado) {
            return res.status(400).json({
                err: {
                    message: 'El Usuario No Existe En La Base De Datos'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;
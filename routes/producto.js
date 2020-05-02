const express = require('express');
const app = express();

const { verificarAdminRole, verificarToken } = require('../middlewares/authentication');
const Producto = require('../models/producto');

app.get('/productos', verificarToken, (req, res) => {

    /* Paginar Los Productos */
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5) //Muestra de 5 en 5
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

app.get('/productos/:id', verificarToken, (req, res) => {
    const id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID No Existe'
                    }
                });
            }

            res.json({
                ok: true,
                'producto': productoDB
            });
        });
});

app.post('/producto', verificarToken, (req, res) => {
    const body = req.body

    const producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            Producto: productoDB
        });
    });
});

app.put('/producto/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    /* AQUI ESTOY BUSCANDO SI EXISTE ESE ID EN LA DB */
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID No Existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoGuardado
            });
        });
    });
});

app.delete('/producto/:id', (req, res) => {
    const id = req.params.id;

    /* AQUI ESTOY BUSCANDO SI EXISTE ESE ID EN LA DB */
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        /* AQUI SI EL ID NO EXISTE EN LA BASE DE DATOS */
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID No Existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado Cambio Estado'
            });
        });
    });
});

module.exports = app;
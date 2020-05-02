const express = require('express');
const app = express();

const { verificarToken, verificarAdminRole } = require('../middlewares/authentication');
const Categoria = require('../models/categoria');

app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        })
});

app.get('/categoria/:id', verificarToken, (req, res) => {
    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id No Es Correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

app.post('/categoria', verificarToken, (req, res) => {
    const body = req.body;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID No Existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });
});

module.exports = app;
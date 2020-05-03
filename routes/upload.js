const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.put('/upload/:tipo/:id', (req, res) => {
    const { tipo, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: true,
            err: {
                message: 'No Se Ha Cargado Ningun Archivo Estático'
            }
        });
    }

    /* Validar Tipos De Imagenes Permitidas */
    const validarTipos = ['productos', 'usuarios'];

    if (validarTipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                extesiones: 'Las Tipos Permitidos Son ' + validarTipos.join(', ')
            }
        });
    }

    /* Obtener Extension Del Archivo */
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    /* Validar La Extensión Del Archivo, Primero Con Un Array Definido */
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                extesiones: 'Las Extensiones Permitidas Son ' + extensionesValidas.join(', ')
            }
        });
    }

    /* Cambiar Nombre Archivo Antes De Guardarlo En La Base De Datos */
    /* Gracias  a los milisegundos() el nombre de la imagen, siempre sera diferente
    y el cache del navegador siempre me va a dar una imagen diferente */
    // 172272828kuasasi--123.jpg
    let nombreFinalArchivo = `${id}--${new Date().getMilliseconds()}.${extension}`;

    /* DEJAR SOLO EL NOMBRA PARA SABR DONDE SE CREA, ASÍ ASIGNAR LA RUTA DONDE QUIERO GUARDAR EL ARCHIVO, ESTE ARCHIVO SE CREA EN LA RAIZ Aqui se sube el archivo*/
    archivo.mv(`./public/uploads/${tipo}/${nombreFinalArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui Yo Se Que La Imagen Esta En EL File System, Es Decir, Se Cargo
        if (tipo === 'usuarios') imagenUsuario(id, res, nombreFinalArchivo);
        else imagenProducto(id, res, nombreFinalArchivo);
    });
});

/* Aqui el res me funciona por que javascript, siempre que sean parametros de objetos, los pasa por referencia, es decir, apuntan hacia el mismo lugar, eso pasa con el res, por que no olvidemos que es un objeto, igual que el req */
function imagenUsuario(id, res, nombreFinalArchivo) {

    /* Aqui la imagen ya se subio al servidor en nuestro backend */
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo('usuarios', nombreFinalArchivo); // elimino si hay error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo('usuarios', nombreFinalArchivo); // elimino si hay error
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario No Existe'
                }
            });
        }

        borrarArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreFinalArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                message: 'Imagen Subida Correctamente'
            });
        });
    });
}

function imagenProducto(id, res, nombreFinalArchivo) {
    /* Aqui la imagen ya se subio al servidor en nuestro backend */
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo('productos', nombreFinalArchivo); // elimino si hay error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo('productos', nombreFinalArchivo); // elimino si hay error
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto No Existe'
                }
            });
        }

        borrarArchivo('productos', productoDB.img);

        productoDB.img = nombreFinalArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                message: 'Imagen Subida Correctamente'
            });
        });
    });
}

function borrarArchivo(tipoValido, nombreImagen) {
    /* Aqui Se Debe Borrar La Imagen(EN CASO DE QUE EXISTA UNA DE USUARIO) 
    Y asi Se mantiene una sola imagen en nuestro backend y no se van a ir acumulando imagenes basura que no se necesitan o se han actualizado con anterioridad */
    let pathImagen = path.join(__dirname, `../public/uploads/${tipoValido}/${nombreImagen}`);

    /* Si la imagen o path no existe, esto no se ejecuta */
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); //Aqui Se Borra La Imagen
    }
}

module.exports = app;
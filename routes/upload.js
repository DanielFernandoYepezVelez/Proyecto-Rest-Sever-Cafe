const express = require('express');
const app = express();

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
    y el cache del navegador siempre me va a dar */
    // 172272828kuasasi--123.jpg
    let nombreFinalArchivo = `${id}--${new Date().getMilliseconds()}.${extension}`;

    /* DEJAR SOLO EL NOMBRA PARA SABR DONDE SE CREA, ASÍ ASIGNAR LA RUTA DONDE QUIERO GUARDAR EL ARCHIVO, ESTE ARCHIVO SE CREA EN LA RAIZ */
    archivo.mv(`./public/uploads/${tipo}/${nombreFinalArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Imagen Subida Correctamente'
        });
    });
});

module.exports = app;
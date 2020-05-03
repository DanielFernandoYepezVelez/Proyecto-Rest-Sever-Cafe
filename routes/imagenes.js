const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const { verificarTokenImg } = require('../middlewares/authentication');

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    const { tipo, img } = req.params;

    let pathImagen = path.join(__dirname, `../public/uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        const noImgPath = path.join(__dirname, '../public/assets/original.jpg');
        /* Para cuando no se encuentra una imagen, retorno un archivo de imagen y no un JSON
          Porque sendfile lee el content-type de la peticion(PATH ABSOLUTO)*/
        res.sendFile(noImgPath);
    }
});

module.exports = app;
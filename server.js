// Variables de Entorno
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

/* Middleware */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/* Routes */
app.use(require('./routes/usuario'));

mongoose.connect('mongodb://localhost/cafe', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base De Datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto:", process.env.PORT);
});
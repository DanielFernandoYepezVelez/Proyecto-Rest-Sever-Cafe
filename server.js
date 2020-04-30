/* Variables de Entorno */
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/* Settings */
const app = express();

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Routes */
app.use(require('./routes/index'));

/* Connected Database */
mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Connected Database');
});

/* Starting Server */
app.listen(process.env.PORT, () => {
    console.log("Sever On Port:", process.env.PORT);
});
/* Declarar constante o variables de forma GLOBAL Para el proyecto en producción y en desarrollo */

/* ==========================
   Puerto
   ==========================
   En producción es un puerto desconocido que el objeto global process captura, en desarrollo o local el puerto se le va asignar el 3000
*/
process.env.PORT = process.env.PORT || 3000;

/* ==========================
   Entorno
   ==========================
   Aqui estoy indicando si el proyecto esta en desarrollo o en produción,
   El busca automaticamente si esta en heroku o esta en local
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/* ==========================
   Vencimiento O Expiración Del Token
   ==========================
   Aqui Va la expiración del token
*/
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24;
process.env.CADUCIDAD_TOKEN = "48h";

/* ==========================
   SEED(semilla, firma) Del Token,
   es decir, la firma secreta del 
   JWT
   ==========================
*/
process.env.FIRMA = process.env.FIRMA || 'este-es-el-seed-desarrollo';

/* ==========================
   Base De Datos
   ==========================
   Aqui estoy especificando la cadena de conexión de mi base de datos,
   si estoy trabajando con la cadena de conexión local o cadena de
   conexión en producción con mongo Atlas
*/
let urlDB = '';

if (process.env.NODE_ENV === 'development') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

/* ==========================
   Google Cliente ID
   ==========================
*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '24949782543-cvfppi9bj9845e5sggqs6g7rlvgm7rvt.apps.googleusercontent.com';
/* Declarar constante o variables
de forma GLOBAL */

/* ==========================
   Puerto
   ==========================
*/
/* En producción es un puerto desconocido que el objeto global process captura, en desarrollo o local el puerto se le va asignar el 3000*/
process.env.PORT = process.env.PORT || 3000;
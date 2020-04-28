const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        // required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

/* No estoy devolviendole al usuario
el dato de la constraseña para que el
lo vea, pues es información demás, pero esa data
sigue existiendo en la BD */

/* Forma #2 En El schema de forma directa y Modificando El Objeto JSON*/
/* toJSON Siempre se llama cuando se intenta imprimir El Schema en un JSON */
usuarioSchema.methods.toJSON = function() {
    /* No utilizò un arrow function por el this */
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};
















/* Pluging de Unique */
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });;

module.exports = mongoose.model('Usuario', usuarioSchema);
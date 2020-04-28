const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*VALIDACION DE LA BASE DE DATOS ROLES
Aqui estamos creando una enumeración de roles correcta que sean aceptados(Los roles válidos para la base de datos). por la base de datos no relacional y se asignan en la propiedad enum de la base de datos. 
{VALUE} === LO que inyecta el usuario */
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

/* LO SIGUIENTE ES UN EJEMPLO MUY CLARO DE QUE UN SCHEMA EN UNA BASE DATOS NO RELACIONAL ES UN OBJETO QUE SE LE PUEDEN AGREGAR, MODIFICAR U OBTENER SUS METODOS Y ATRIBUTOS {{{RECORDAR!!!!!}}}*/

/* No estoy devolviendole al usuario
el dato de la constraseña para que el
lo vea, pues es información demás, pero ese campo sigue existiendo en la BD */
/* Forma #2 En El schema de forma directa y Modificando El Objeto JSON*/
/* toJSON Siempre se llama cuando se intenta imprimir El Schema de la base de datos en un JSON como respuesta para el cliente o frontend */
usuarioSchema.methods.toJSON = function() {
    /* No utilizò un arrow function por el this */
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

/* VALIDACION DE LA BASE DE DATOS EMAIL
Pluging de Unique, Aqui estoy validando en la base de datos no relacional, que el correo electronico sea unico, y mongoose inyecta un mensaje de error, gracias a {PATH} === Email */
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });;

module.exports = mongoose.model('Usuario', usuarioSchema);
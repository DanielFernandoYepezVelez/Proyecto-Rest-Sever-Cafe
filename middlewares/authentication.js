const jwt = require('jsonwebtoken');
/* ===============
  VERIFICAR TOKEN
  ================
*/

const verificarToken = (req, res, next) => {
    /* Aqui Leo Headers Personalizados */
    let token = req.get('authorization'); // Busca el header con este nombre(authorization)

    jwt.verify(token, process.env.FIRMA, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No Válido'
                }
            });
        }
        /* decoded es el payload y va contener la info del usuario, por eso lo llamo de la siguiente manera  y recordar como lo llame anteriormente en el jwt.sign, se llama igual usuario */
        req.usuario = decoded.usuario;
        next();
    });
};

/* ===============
  VERIFICAR ADMIN_ROLE
  ================
*/
const verificarAdminRole = (req, res, next) => {
    /* Puedo obtener el usuario gracias al middleware Anterior, que me lo entrega el payload */
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

/* ===========================
  VERIFICAR TOKEN PARA IMAGEN
  ============================
*/

const verificarTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.FIRMA, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No Válido'
                }
            });
        }
        /* decoded es el payload y va contener la info del usuario, por eso lo llamo de la siguiente manera  y recordar como lo llame anteriormente en el jwt.sign, se llama igual usuario */
        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenImg
}
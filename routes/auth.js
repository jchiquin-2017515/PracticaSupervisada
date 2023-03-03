const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/login', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    check('rol').default('ROLE_ALUMNO'),
    validarCampos,
] ,login);


module.exports = router;
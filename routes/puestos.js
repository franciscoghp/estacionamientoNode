
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { puestosGet,
        puestosPut,
        puestosPost,
        puestosDelete } = require('../controllers/puesto');

const router = Router();


router.get('/', puestosGet );

router.post('/', puestosPost );

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
],puestosPut );

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
],puestosDelete );

module.exports = router;
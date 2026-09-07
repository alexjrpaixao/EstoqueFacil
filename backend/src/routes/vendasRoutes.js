const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendasController');

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.post('/:id/cancelar', controller.cancelar);

module.exports = router;

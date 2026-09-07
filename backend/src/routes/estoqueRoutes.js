const express = require('express');
const router = express.Router();
const controller = require('../controllers/estoqueController');

router.get('/', controller.listar);
router.post('/entrada', controller.registrarEntrada);
router.get('/movimentacoes/:produto_id', controller.movimentacoes);

module.exports = router;

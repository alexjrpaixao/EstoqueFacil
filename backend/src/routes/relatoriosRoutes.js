const express=require('express');const router=express.Router();const c=require('../controllers/relatoriosController');
router.get('/vendas-periodo',c.vendasPorPeriodo);router.get('/produtos-mais-vendidos',c.produtosMaisVendidos);router.get('/estoque-baixo',c.estoqueBaixo);router.get('/resumo-financeiro',c.resumoFinanceiro);module.exports=router;

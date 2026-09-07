const express=require('express'); const router=express.Router(); const c=require('../controllers/clientesController');
router.get('/',c.listar);router.post('/',c.criar);router.put('/:id',c.atualizar);router.delete('/:id',c.remover);module.exports=router;

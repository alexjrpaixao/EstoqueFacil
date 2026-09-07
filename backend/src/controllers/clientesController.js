const pool = require('../database/db');

async function listar(req,res){
  try { const r=await pool.query('SELECT * FROM clientes WHERE ativo=TRUE ORDER BY nome'); res.json(r.rows); }
  catch(e){ console.error(e); res.status(500).json({erro:'Erro ao listar clientes.'}); }
}
async function criar(req,res){
  const {nome, telefone='', email='', documento=''}=req.body||{};
  if(!nome?.trim()) return res.status(400).json({erro:'O nome do cliente é obrigatório.'});
  try { const r=await pool.query('INSERT INTO clientes(nome,telefone,email,documento) VALUES($1,$2,$3,$4) RETURNING *',[nome.trim(),telefone.trim(),email.trim(),documento.trim()]); res.status(201).json(r.rows[0]); }
  catch(e){ if(e.code==='23505') return res.status(409).json({erro:'Já existe cliente com esse documento.'}); console.error(e); res.status(500).json({erro:'Erro ao criar cliente.'}); }
}
async function atualizar(req,res){
  const {nome,telefone='',email='',documento=''}=req.body||{};
  if(!nome?.trim()) return res.status(400).json({erro:'O nome do cliente é obrigatório.'});
  try { const r=await pool.query('UPDATE clientes SET nome=$1,telefone=$2,email=$3,documento=$4 WHERE id=$5 AND ativo=TRUE RETURNING *',[nome.trim(),telefone.trim(),email.trim(),documento.trim(),req.params.id]); if(!r.rows.length)return res.status(404).json({erro:'Cliente não encontrado.'}); res.json(r.rows[0]); }
  catch(e){ if(e.code==='23505')return res.status(409).json({erro:'Já existe cliente com esse documento.'}); console.error(e);res.status(500).json({erro:'Erro ao atualizar cliente.'}); }
}
async function remover(req,res){ try { const r=await pool.query('UPDATE clientes SET ativo=FALSE WHERE id=$1 AND ativo=TRUE RETURNING id',[req.params.id]); if(!r.rows.length)return res.status(404).json({erro:'Cliente não encontrado.'});res.json({mensagem:'Cliente removido com sucesso.'}); }catch(e){console.error(e);res.status(500).json({erro:'Erro ao remover cliente.'});} }
module.exports={listar,criar,atualizar,remover};

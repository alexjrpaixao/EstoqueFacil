const pool = require('../database/db');
const SELECT_BASE = `SELECT p.*, c.nome AS categoria_nome FROM produtos p LEFT JOIN categorias c ON c.id = p.categoria_id`;

function inteiroNaoNegativo(v) { return Number.isInteger(Number(v)) && Number(v) >= 0; }
function precoValido(v) { return Number.isFinite(Number(v)) && Number(v) >= 0; }

async function listar(req, res) {
  const { busca, categoria_id } = req.query;
  const condicoes = ['p.ativo = TRUE']; const valores = [];
  if (busca?.trim()) { valores.push(`%${busca.trim()}%`); condicoes.push(`(p.nome ILIKE $${valores.length} OR p.codigo ILIKE $${valores.length})`); }
  if (categoria_id) { const id = Number(categoria_id); if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'Categoria inválida.' }); valores.push(id); condicoes.push(`p.categoria_id = $${valores.length}`); }
  try { res.json((await pool.query(`${SELECT_BASE} WHERE ${condicoes.join(' AND ')} ORDER BY p.nome`, valores)).rows); }
  catch (err) { console.error(err); res.status(500).json({ erro: 'Erro ao listar produtos.' }); }
}
async function buscarPorId(req,res){ try { const r=await pool.query(`${SELECT_BASE} WHERE p.id=$1`,[req.params.id]); if(!r.rows.length)return res.status(404).json({erro:'Produto não encontrado.'}); res.json(r.rows[0]); } catch(e){console.error(e);res.status(500).json({erro:'Erro ao buscar produto.'});} }
async function criar(req,res){
  const {nome,codigo,categoria_id,preco_custo=0,preco_venda,estoque=0,estoque_minimo=0}=req.body||{};
  if(!nome?.trim()||!codigo?.trim())return res.status(400).json({erro:'Nome e código do produto são obrigatórios.'});
  if(!precoValido(preco_custo)||!precoValido(preco_venda))return res.status(400).json({erro:'Preços inválidos.'});
  if(!inteiroNaoNegativo(estoque)||!inteiroNaoNegativo(estoque_minimo))return res.status(400).json({erro:'Estoque e estoque mínimo devem ser inteiros não negativos.'});
  try{
    const r=await pool.query(`INSERT INTO produtos (nome,codigo,categoria_id,preco_custo,preco_venda,estoque,estoque_minimo) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[nome.trim(),codigo.trim(),categoria_id||null,preco_custo,preco_venda,estoque,estoque_minimo]);
    if(Number(estoque)>0) await pool.query(`INSERT INTO movimentacoes_estoque(produto_id,tipo,quantidade) VALUES($1,'entrada',$2)`,[r.rows[0].id,estoque]);
    res.status(201).json(r.rows[0]);
  }catch(e){if(e.code==='23505')return res.status(409).json({erro:'Já existe um produto com esse código.'});console.error(e);res.status(500).json({erro:'Erro ao criar produto.'});}
}
async function atualizar(req,res){
  const {nome,codigo,categoria_id,preco_custo,preco_venda,estoque_minimo}=req.body||{};
  if(nome!==undefined&&(!String(nome).trim()))return res.status(400).json({erro:'Nome inválido.'});
  if((preco_custo!==undefined&&!precoValido(preco_custo))||(preco_venda!==undefined&&!precoValido(preco_venda)))return res.status(400).json({erro:'Preço inválido.'});
  if(estoque_minimo!==undefined&&!inteiroNaoNegativo(estoque_minimo))return res.status(400).json({erro:'Estoque mínimo inválido.'});
  try{const r=await pool.query(`UPDATE produtos SET nome=COALESCE($1,nome),codigo=COALESCE($2,codigo),categoria_id=COALESCE($3,categoria_id),preco_custo=COALESCE($4,preco_custo),preco_venda=COALESCE($5,preco_venda),estoque_minimo=COALESCE($6,estoque_minimo) WHERE id=$7 AND ativo=TRUE RETURNING *`,[nome?.trim(),codigo?.trim(),categoria_id===undefined?null:(categoria_id||null),preco_custo,preco_venda,estoque_minimo,req.params.id]);if(!r.rows.length)return res.status(404).json({erro:'Produto não encontrado.'});res.json(r.rows[0]);}catch(e){if(e.code==='23505')return res.status(409).json({erro:'Já existe um produto com esse código.'});console.error(e);res.status(500).json({erro:'Erro ao atualizar produto.'});}
}
async function remover(req,res){try{const r=await pool.query('UPDATE produtos SET ativo=FALSE WHERE id=$1 AND ativo=TRUE RETURNING id',[req.params.id]);if(!r.rows.length)return res.status(404).json({erro:'Produto não encontrado.'});res.json({mensagem:'Produto removido com sucesso.'});}catch(e){console.error(e);res.status(500).json({erro:'Erro ao remover produto.'});}}
module.exports={listar,buscarPorId,criar,atualizar,remover};

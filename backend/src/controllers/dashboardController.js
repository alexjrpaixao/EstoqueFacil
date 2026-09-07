const pool=require('../database/db');
async function resumo(req,res){try{
 const [mes,hoje,estoque,mais,dias]=await Promise.all([
  pool.query("SELECT COALESCE(SUM(total),0) faturamento,COUNT(*) quantidade,COALESCE(AVG(total),0) ticket FROM vendas WHERE status='finalizada' AND date_trunc('month',data)=date_trunc('month',CURRENT_DATE)"),
  pool.query("SELECT COUNT(*) quantidade,COALESCE(SUM(total),0) faturamento FROM vendas WHERE status='finalizada' AND data::date=CURRENT_DATE"),
  pool.query("SELECT COUNT(*) quantidade FROM produtos WHERE ativo=TRUE AND estoque<=estoque_minimo"),
  pool.query("SELECT p.nome,SUM(iv.quantidade) total_vendido FROM itens_venda iv JOIN vendas v ON v.id=iv.venda_id JOIN produtos p ON p.id=iv.produto_id WHERE v.status='finalizada' AND date_trunc('month',v.data)=date_trunc('month',CURRENT_DATE) GROUP BY p.nome ORDER BY total_vendido DESC LIMIT 1"),
  pool.query("SELECT to_char(data::date,'DD/MM') dia,COALESCE(SUM(total),0) total FROM vendas WHERE status='finalizada' AND data>=CURRENT_DATE-INTERVAL '6 days' GROUP BY data::date ORDER BY data::date")
 ]);
 res.json({faturamento_mes:Number(mes.rows[0].faturamento),quantidade_vendas_mes:Number(mes.rows[0].quantidade),ticket_medio:Number(mes.rows[0].ticket),faturamento_hoje:Number(hoje.rows[0].faturamento),vendas_hoje:Number(hoje.rows[0].quantidade),produtos_estoque_baixo:Number(estoque.rows[0].quantidade),produto_mais_vendido:mais.rows[0]?.nome||null,vendas_ultimos_dias:dias.rows.map(x=>({dia:x.dia,total:Number(x.total)}))});
}catch(e){console.error(e);res.status(500).json({erro:'Erro ao carregar indicadores do dashboard.'})}}
module.exports={resumo};

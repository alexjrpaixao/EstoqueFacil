
const pool = require('../database/db');

function dataValida(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v || '');
}

async function vendasPorPeriodo(req, res) {
  const { inicio, fim } = req.query;

  if (!dataValida(inicio) || !dataValida(fim) || inicio > fim) {
    return res.status(400).json({
      erro: 'Informe um período válido.'
    });
  }

  try {
    const r = await pool.query(
      `SELECT
        v.id,
        v.data,
        v.total,
        v.desconto,
        v.forma_pagamento,
        v.status,
        c.nome cliente_nome
      FROM vendas v
      LEFT JOIN clientes c ON c.id = v.cliente_id
      WHERE (
        v.data AT TIME ZONE 'UTC'
        AT TIME ZONE 'America/Sao_Paulo'
      )::date BETWEEN $1 AND $2
      ORDER BY v.data`,
      [inicio, fim]
    );

    res.json({
      vendas: r.rows,
      total_periodo: r.rows
        .filter(v => v.status === 'finalizada')
        .reduce((s, v) => s + Number(v.total), 0)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      erro: 'Erro ao gerar relatório de vendas.'
    });
  }
}

async function produtosMaisVendidos(req, res) {
  try {
    const r = await pool.query(
      `SELECT
        p.nome,
        p.codigo,
        SUM(iv.quantidade) quantidade_vendida,
        SUM(iv.subtotal) total_gerado
      FROM itens_venda iv
      JOIN vendas v ON v.id = iv.venda_id
      JOIN produtos p ON p.id = iv.produto_id
      WHERE v.status = 'finalizada'
      GROUP BY p.nome, p.codigo
      ORDER BY quantidade_vendida DESC
      LIMIT 10`
    );

    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      erro: 'Erro ao gerar relatório de produtos mais vendidos.'
    });
  }
}

async function estoqueBaixo(req, res) {
  try {
    const r = await pool.query(
      `SELECT nome, codigo, estoque, estoque_minimo
      FROM produtos
      WHERE ativo = TRUE AND estoque <= estoque_minimo
      ORDER BY estoque ASC`
    );

    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      erro: 'Erro ao gerar relatório de estoque baixo.'
    });
  }
}

async function resumoFinanceiro(req, res) {
  try {
    const r = await pool.query(
      `SELECT
        forma_pagamento,
        COUNT(*) quantidade,
        COALESCE(SUM(total), 0) total
      FROM vendas
      WHERE status = 'finalizada'
      GROUP BY forma_pagamento
      ORDER BY total DESC`
    );

    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      erro: 'Erro ao gerar resumo financeiro.'
    });
  }
}

module.exports = {
  vendasPorPeriodo,
  produtosMaisVendidos,
  estoqueBaixo,
  resumoFinanceiro
};

const pool = require('../database/db');

// GET /api/estoque  -> lista de produtos com situação do estoque
async function listar(req, res) {
  try {
    const result = await pool.query(`
      SELECT p.id, p.nome, p.codigo, p.estoque, p.estoque_minimo,
             c.nome AS categoria_nome,
             (p.estoque <= p.estoque_minimo) AS estoque_baixo
      FROM produtos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.ativo = TRUE
      ORDER BY estoque_baixo DESC, p.nome
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar estoque.' });
  }
}

// POST /api/estoque/entrada  { produto_id, quantidade }
async function registrarEntrada(req, res) {
  const { produto_id, quantidade } = req.body;
  if (!Number.isInteger(Number(produto_id)) || !Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: 'Informe o produto e uma quantidade válida.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const produto = await client.query('SELECT * FROM produtos WHERE id = $1 AND ativo = TRUE FOR UPDATE', [produto_id]);
    if (produto.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const atualizado = await client.query(
      'UPDATE produtos SET estoque = estoque + $1 WHERE id = $2 RETURNING *',
      [quantidade, produto_id]
    );

    await client.query(
      `INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade) VALUES ($1, 'entrada', $2)`,
      [produto_id, quantidade]
    );

    await client.query('COMMIT');
    res.status(201).json(atualizado.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ erro: 'Erro ao registrar entrada de estoque.' });
  } finally {
    client.release();
  }
}

// GET /api/estoque/movimentacoes/:produto_id
async function movimentacoes(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM movimentacoes_estoque WHERE produto_id = $1 ORDER BY data DESC',
      [req.params.produto_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar movimentações.' });
  }
}

module.exports = { listar, registrarEntrada, movimentacoes };

const pool = require('../database/db');

// GET /api/categorias
async function listar(req, res) {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar categorias.' });
  }
}

// POST /api/categorias
async function criar(req, res) {
  const { nome } = req.body;
  if (!nome || !nome.trim()) {
    return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Já existe uma categoria com esse nome.' });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar categoria.' });
  }
}

// PUT /api/categorias/:id
async function atualizar(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome || !nome.trim()) {
    return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
  }
  try {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome.trim(), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar categoria.' });
  }
}

// DELETE /api/categorias/:id
async function remover(req, res) {
  const { id } = req.params;
  try {
    const emUso = await pool.query('SELECT id FROM produtos WHERE categoria_id = $1 LIMIT 1', [id]);
    if (emUso.rows.length > 0) {
      return res.status(409).json({ erro: 'Não é possível excluir: existem produtos nesta categoria.' });
    }
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }
    res.json({ mensagem: 'Categoria removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover categoria.' });
  }
}

module.exports = { listar, criar, atualizar, remover };

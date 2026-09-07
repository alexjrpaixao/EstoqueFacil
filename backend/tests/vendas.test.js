const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/database/db');

// Estes testes assumem um banco PostgreSQL de teste já configurado (ver .env)
// e rodam com --runInBand para evitar concorrência entre transações.

describe('POST /api/vendas', () => {
  let produtoId;
  let token;

  beforeAll(async () => {
    const login = await request(app).post('/api/auth/login').send({ email: 'admin@estoquefacil.com', senha: '123456' });
    token = login.body.token;
    const categoria = await pool.query(
      "INSERT INTO categorias (nome) VALUES ('Categoria Teste Vendas') RETURNING id"
    );
    const produto = await pool.query(
      `INSERT INTO produtos (nome, codigo, categoria_id, preco_venda, estoque, estoque_minimo)
       VALUES ('Produto Teste Venda', 'TESTE-VENDA-01', $1, 50, 5, 1) RETURNING id`,
      [categoria.rows[0].id]
    );
    produtoId = produto.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM produtos WHERE codigo = $1', ['TESTE-VENDA-01']);
    await pool.query('DELETE FROM categorias WHERE nome = $1', ['Categoria Teste Vendas']);
    await pool.end();
  });

  test('bloqueia a venda quando o estoque é insuficiente', async () => {
    const resposta = await request(app)
      .post('/api/vendas').set('Authorization', `Bearer ${token}`)
      .send({ itens: [{ produto_id: produtoId, quantidade: 999 }] });

    expect(resposta.status).toBe(409);
    expect(resposta.body.erro).toMatch(/Estoque insuficiente/);
  });

  test('registra a venda, calcula o total corretamente e dá baixa no estoque', async () => {
    const resposta = await request(app)
      .post('/api/vendas').set('Authorization', `Bearer ${token}`)
      .send({ itens: [{ produto_id: produtoId, quantidade: 2 }] });

    expect(resposta.status).toBe(201);
    expect(Number(resposta.body.total)).toBe(100);

    const produtoAtualizado = await pool.query('SELECT estoque FROM produtos WHERE id = $1', [produtoId]);
    expect(produtoAtualizado.rows[0].estoque).toBe(3);
  });

  test('consolida produto repetido e bloqueia excesso de estoque', async () => {
    const resposta = await request(app).post('/api/vendas').set('Authorization', `Bearer ${token}`).send({ itens: [{ produto_id: produtoId, quantidade: 2 }, { produto_id: produtoId, quantidade: 2 }] });
    expect(resposta.status).toBe(409);
  });

  test('rejeita venda sem itens', async () => {
    const resposta = await request(app).post('/api/vendas').set('Authorization', `Bearer ${token}`).send({ itens: [] });
    expect(resposta.status).toBe(400);
  });
});

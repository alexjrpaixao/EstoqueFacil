const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/database/db');

describe('API de produtos', () => {
  let token;

  beforeAll(async () => {
    const login = await request(app).post('/api/auth/login').send({ email: 'admin@estoquefacil.com', senha: '123456' });
    token = login.body.token;
  });
  afterAll(async () => {
    await pool.query("DELETE FROM produtos WHERE codigo LIKE 'TESTE-PROD-%'");
    await pool.end();
  });

  test('cria um produto com dados válidos', async () => {
    const resposta = await request(app)
      .post('/api/produtos').set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Sela de teste', codigo: 'TESTE-PROD-01', preco_venda: 899.9, estoque: 3, estoque_minimo: 1 });

    expect(resposta.status).toBe(201);
    expect(resposta.body.codigo).toBe('TESTE-PROD-01');
  });

  test('rejeita produto sem nome ou código', async () => {
    const resposta = await request(app).post('/api/produtos').set('Authorization', `Bearer ${token}`).send({ preco_venda: 10 });
    expect(resposta.status).toBe(400);
  });

  test('rejeita código de produto duplicado', async () => {
    await request(app)
      .post('/api/produtos').set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Produto A', codigo: 'TESTE-PROD-02', preco_venda: 10 });

    const resposta = await request(app)
      .post('/api/produtos').set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Produto B', codigo: 'TESTE-PROD-02', preco_venda: 20 });

    expect(resposta.status).toBe(409);
  });

  test('retorna 404 ao buscar produto inexistente', async () => {
    const resposta = await request(app).get('/api/produtos/999999').set('Authorization', `Bearer ${token}`);
    expect(resposta.status).toBe(404);
  });

  test('exclusão é lógica: produto some da listagem mas continua no banco', async () => {
    const criado = await request(app)
      .post('/api/produtos').set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Produto para remover', codigo: 'TESTE-PROD-03', preco_venda: 15 });

    await request(app).delete(`/api/produtos/${criado.body.id}`).set('Authorization', `Bearer ${token}`);

    const listagem = await request(app).get('/api/produtos').set('Authorization', `Bearer ${token}`);
    const encontrado = listagem.body.find((p) => p.codigo === 'TESTE-PROD-03');
    expect(encontrado).toBeUndefined();

    const noBanco = await pool.query('SELECT ativo FROM produtos WHERE codigo = $1', ['TESTE-PROD-03']);
    expect(noBanco.rows[0].ativo).toBe(false);
  });
});

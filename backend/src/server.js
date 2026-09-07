const express = require('express');
const cors = require('cors');
require('dotenv').config();

const produtosRoutes = require('./routes/produtosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const vendasRoutes = require('./routes/vendasRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');
const authRoutes = require('./routes/authRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const fornecedoresRoutes = require('./routes/fornecedoresRoutes');
const { autenticar } = require('./middleware/auth');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(v => v.trim()) : true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok', sistema: 'EstoqueFácil' }));

app.get('/', (req, res) => {
  res.json({ mensagem: 'API EstoqueFácil no ar 🚀' });
});

app.use('/api/auth', authRoutes);

app.use('/api/produtos', autenticar, produtosRoutes);
app.use('/api/categorias', autenticar, categoriasRoutes);
app.use('/api/estoque', autenticar, estoqueRoutes);
app.use('/api/vendas', autenticar, vendasRoutes);
app.use('/api/dashboard', autenticar, dashboardRoutes);
app.use('/api/relatorios', autenticar, relatoriosRoutes);
app.use('/api/clientes', autenticar, clientesRoutes);
app.use('/api/fornecedores', autenticar, fornecedoresRoutes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Servidor EstoqueFácil rodando na porta ${PORT}`));
}

module.exports = app;

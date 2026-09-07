# EstoqueFácil 3.0

Sistema web de controle de estoque e vendas para pequeno negócio/MEI, com foco em simplicidade, segurança e gestão.

## O que há nesta versão

- Dashboard com faturamento de hoje/mês, vendas, ticket médio, estoque baixo e gráfico dos últimos 7 dias.
- Cadastro e edição de produtos e categorias.
- Cadastro de clientes e fornecedores.
- Entrada e saída de estoque com movimentações.
- Nova venda com cliente, forma de pagamento e desconto.
- Consolidação de produtos repetidos no carrinho e validação transacional do estoque.
- Histórico de vendas com impressão e cancelamento/estorno.
- Cancelamento devolve automaticamente os itens ao estoque e registra estorno.
- Relatórios de período, produtos mais vendidos, estoque baixo e resumo por forma de pagamento.
- Exportação CSV e impressão.
- Autenticação com senha armazenada por scrypt e rotas protegidas.

## Tecnologias

React + Vite, Node.js + Express e PostgreSQL.

## Instalação

### Banco

Execute `database/schema.sql` no PostgreSQL.

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O frontend usa `VITE_API_URL` e, por padrão, aponta para `http://localhost:3001/api`.

## Acesso inicial

- E-mail: `admin@estoquefacil.com`
- Senha: `123456`

Troque a senha antes de colocar o sistema em produção.

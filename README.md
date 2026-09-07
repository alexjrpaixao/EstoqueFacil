\# EstoqueFácil



Sistema web de controle de estoque e vendas desenvolvido para pequeno negócio/MEI, com foco em simplicidade, organização, segurança e facilidade de uso.



\## Sobre o projeto



O EstoqueFácil é uma aplicação web desenvolvida para auxiliar pequenos negócios no controle de produtos, estoque, vendas, clientes e fornecedores.



O sistema foi desenvolvido como projeto acadêmico e também foi pensado para ser utilizado na rotina de um pequeno empreendedor.



\## Funcionalidades



\- Dashboard com resumo das vendas e do estoque.

\- Visualização do faturamento do dia e do mês.

\- Indicador de ticket médio.

\- Identificação de produtos com estoque baixo.

\- Gráfico de vendas dos últimos 7 dias.

\- Cadastro, edição e gerenciamento de produtos.

\- Cadastro e gerenciamento de categorias.

\- Cadastro de clientes.

\- Cadastro de fornecedores.

\- Entrada de produtos no estoque.

\- Saída de produtos do estoque.

\- Histórico de movimentações.

\- Registro de vendas.

\- Seleção de cliente na venda.

\- Seleção da forma de pagamento.

\- Aplicação de desconto.

\- Carrinho de vendas com consolidação de produtos repetidos.

\- Validação do estoque durante a venda.

\- Histórico de vendas.

\- Impressão de vendas.

\- Cancelamento e estorno de vendas.

\- Devolução automática dos produtos ao estoque após cancelamento.

\- Relatórios de vendas.

\- Relatório de produtos mais vendidos.

\- Relatório de estoque baixo.

\- Resumo por forma de pagamento.

\- Exportação de dados em CSV.

\- Autenticação de usuários.

\- Rotas protegidas.

\- Senhas armazenadas utilizando scrypt.



\## Tecnologias utilizadas



\### Frontend

\- React

\- Vite

\- JavaScript

\- HTML

\- CSS



\### Backend

\- Node.js

\- Express



\### Banco de dados

\- PostgreSQL



\## Estrutura do projeto



```text

EstoqueFacil/

├── backend/

│   ├── src/

│   │   ├── controllers/

│   │   ├── database/

│   │   ├── middleware/

│   │   └── routes/

│   ├── tests/

│   ├── .env.example

│   └── package.json

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   └── App.jsx

│   ├── .env.example

│   └── package.json

│

├── database/

│   └── schema.sql

│

├── .gitignore

├── CHANGELOG.md

└── README.md


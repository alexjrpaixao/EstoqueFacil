EstoqueFácil
Sistema web para controle de estoque e vendas de pequenos negócios e microempreendedores individuais (MEIs), desenvolvido como projeto acadêmico da UNIVESP.

O objetivo é centralizar informações de produtos, categorias, clientes, fornecedores, movimentações de estoque e vendas em uma aplicação web de uso simples.
Objetivo do projeto
O EstoqueFácil busca apoiar a organização das rotinas de pequenos negócios, facilitando o registro e a consulta de informações relacionadas ao estoque e às vendas.
Funcionalidades
A versão do projeto contempla os seguintes módulos e recursos, conforme implementados no código:
- Painel com informações resumidas de estoque e vendas.
- Cadastro e gerenciamento de produtos e categorias.
- Cadastro e gerenciamento de clientes e fornecedores.
- Registro de entradas e saídas de estoque.
- Histórico de movimentações.
- Registro e consulta de vendas.
- Seleção de cliente e forma de pagamento na venda.
- Aplicação de desconto, quando disponível na tela de venda.
- Validação da disponibilidade de estoque durante a venda.
- Cancelamento/estorno de vendas e retorno dos itens ao estoque.
- Relatórios de vendas e estoque.
- Exportação de dados em CSV.
- Autenticação de usuários e proteção de rotas.
A disponibilidade e o comportamento de cada funcionalidade devem ser confirmados na versão publicada antes de serem considerados integralmente validados em produção.
Tecnologias utilizadas
Frontend
- React
- Vite
- JavaScript
- HTML
- CSS
Backend
- Node.js
- Express
Banco de dados
- PostgreSQL
Arquitetura e implantação
A aplicação é organizada em três partes:
1. Frontend: interface acessada pelo navegador.
2. Backend: API e regras de aplicação.
3. Banco de dados: armazenamento persistente das informações.
Na implantação atual, o frontend e o backend são hospedados no Render e o banco PostgreSQL é hospedado no Neon. O acesso à aplicação depende da disponibilidade desses serviços e de conexão com a internet.
Os endereços públicos da aplicação não são incluídos nesta documentação porque precisam ser confirmados diretamente no painel de implantação antes da publicação do README.

Estrutura do repositório
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
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql
├── .gitignore
├── CHANGELOG.md
└── README.md
Requisitos para execução local
Para executar o projeto localmente, é necessário ter instalado:
- Node.js e npm em versões compatíveis com os arquivos package.json;
- PostgreSQL, ou acesso a uma instância PostgreSQL configurada;
- Git, para clonar o repositório.
Como obter o código
git clone https://github.com/alexjrpaixao/EstoqueFacil.git
cd EstoqueFacil
O frontend e o backend possuem seus próprios arquivos package.json. Consulte as instruções e os scripts definidos nesses arquivos para instalar dependências e iniciar cada parte do sistema.

Antes de iniciar a aplicação, configure as variáveis de ambiente necessárias usando os arquivos .env.example como referência. Ajuste os valores para o ambiente local e nunca publique senhas, tokens, chaves privadas ou strings de conexão reais no GitHub.

O arquivo database/schema.sql contém o esquema SQL disponibilizado no repositório. Confira o conteúdo e as instruções do projeto antes de executar scripts em qualquer banco de dados.
Testes e verificações
Durante o desenvolvimento foram realizados testes e ajustes funcionais. Em uma verificação preliminar da versão online:
- o sistema foi acessado pelo navegador;
- produtos cadastrados continuaram visíveis após atualizar a página;
- as telas de Estoque, Vendas e Relatórios abriram normalmente.
Essas verificações são preliminares e não equivalem a uma validação completa de todas as operações em produção. O teste de restauração completa do backup em um banco separado também permanece pendente.
Backup e recuperação
Foi criado um arquivo de backup do banco PostgreSQL e verificada sua capacidade de leitura com as ferramentas do PostgreSQL. Uma cópia foi armazenada no computador e outra em um dispositivo USB. Também foi criado um snapshot manual no Neon.

A restauração completa ainda precisa ser testada em um banco separado. Não utilize comandos de restauração diretamente no banco de produção sem confirmar o destino e possuir um backup válido.
Segurança
- Não armazene credenciais reais nos arquivos versionados.
- Utilize variáveis de ambiente para configurações sensíveis.
- Mantenha as credenciais do banco de dados e dos serviços de hospedagem privadas.
- Restrinja o acesso às contas de hospedagem e ao banco de dados.
- Faça backups periódicos e teste o procedimento de restauração.
Limitações e trabalhos futuros
O escopo atual não inclui, necessariamente, emissão fiscal integrada, integração bancária, marketplace, aplicativo móvel nativo ou automação contábil. A inclusão desses recursos pode ser considerada em versões futuras.

Entre os próximos cuidados técnicos estão a execução de testes adicionais em produção, a validação de todos os fluxos de venda e movimentação de estoque e o teste de restauração completa do backup em ambiente separado.
Repositório
Código-fonte: https://github.com/alexjrpaixao/EstoqueFacil
Contexto acadêmico
Projeto Integrador da Universidade Virtual do Estado de São Paulo (UNIVESP).

Desenvolvido para explorar conhecimentos de desenvolvimento web, banco de dados, controle de versão e testes de software.

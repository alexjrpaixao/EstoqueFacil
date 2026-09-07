# EstoqueFácil 3.0 — melhorias

## Gestão
- Clientes e fornecedores com cadastro, edição e remoção lógica.
- Venda vinculada a cliente, forma de pagamento e desconto.
- Cancelamento/estorno com devolução automática do estoque.
- Histórico de venda com impressão.

## Dashboard e relatórios
- Faturamento de hoje e do mês.
- Ticket médio.
- Vendas dos últimos 7 dias.
- Resumo por forma de pagamento.
- Exportação CSV.
- Impressão otimizada.

## Regras de negócio
- Produtos repetidos no carrinho são consolidados.
- Estoque é validado dentro de transação com bloqueio de linha.
- Produtos inativos não podem ser vendidos.
- Cancelamentos restauram estoque e registram movimentação de estorno.
- Vendas canceladas não entram nos indicadores financeiros.

## Banco
- Clientes, fornecedores, status da venda, desconto, pagamento e vínculo de movimentação foram adicionados.
- O `schema.sql` é compatível com instalação nova e contém comandos de migração para bases da versão anterior.

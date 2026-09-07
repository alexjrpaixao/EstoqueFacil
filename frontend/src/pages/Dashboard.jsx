import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Indicador from '../components/Indicador';

const brl = (v) =>
  Number(v).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.buscarDashboard()
      .then(setD)
      .catch((e) => setErro(e.message));
  }, []);

  const vendas = d?.vendas_ultimos_dias || [];

  const max = Math.max(
    ...vendas.map((x) => Number(x.total) || 0),
    1
  );

  return (
    <div>
      <div className="cabecalho-pagina">
        <div>
          <h1>Visão geral</h1>

          <p className="subtitulo">
            Acompanhe as vendas e o estoque do negócio.
          </p>
        </div>
      </div>

      {erro && (
        <div className="mensagem-erro">
          {erro}
        </div>
      )}

      {d ? (
        <>
          <div className="grade-indicadores">
            <Indicador
              rotulo="Faturamento hoje"
              valor={brl(d.faturamento_hoje)}
            />

            <Indicador
              rotulo="Faturamento do mês"
              valor={brl(d.faturamento_mes)}
            />

            <Indicador
              rotulo="Vendas hoje"
              valor={d.vendas_hoje}
            />

            <Indicador
              rotulo="Ticket médio"
              valor={brl(d.ticket_medio)}
            />

            <Indicador
              rotulo="Vendas no mês"
              valor={d.quantidade_vendas_mes}
            />

            <Indicador
              rotulo="Estoque baixo"
              valor={d.produtos_estoque_baixo}
              alerta={d.produtos_estoque_baixo > 0}
            />
          </div>

          <div className="grade-dupla">

            <section className="cartao">
              <h2>Vendas dos últimos 7 dias</h2>

              <div className="grafico-barras">
                {vendas.map((x) => (
                  <div
                    className="barra-coluna"
                    key={x.dia}
                  >
                    <div className="barra-valor">
                      {brl(x.total)}
                    </div>

                    <div
                      className="barra"
                      style={{
                        height:
                          Math.max(
                            8,
                            ((Number(x.total) || 0) / max) * 150
                          ) + 'px'
                      }}
                    ></div>

                    <small>
                      {x.dia}
                    </small>
                  </div>
                ))}
              </div>
            </section>

            <section className="cartao">
              <h2>Produto destaque</h2>

              <div className="destaque">
                {d.produto_mais_vendido
                  ? d.produto_mais_vendido
                  : 'Ainda sem vendas no mês'}
              </div>

              <p className="subtitulo">
                Produto mais vendido no mês atual.
              </p>

              <div
                className={
                  d.produtos_estoque_baixo > 0
                    ? 'alerta-box'
                    : 'sucesso-box'
                }
              >
                {d.produtos_estoque_baixo > 0
                  ? 'Há ' +
                    d.produtos_estoque_baixo +
                    ' produto(s) com estoque baixo.'
                  : 'Estoque dentro dos níveis mínimos.'}
              </div>
            </section>

          </div>
        </>
      ) : (
        <p>
          Carregando indicadores...
        </p>
      )}
    </div>
  );
}
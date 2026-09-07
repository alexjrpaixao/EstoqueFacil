import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Estoque() {
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');

  function carregar() {
    api.listarEstoque().then(setItens).catch((e) => setErro(e.message));
  }

  useEffect(carregar, []);

  async function registrarEntrada(evento) {
    evento.preventDefault();
    setErro('');
    if (!produtoId || !quantidade || Number(quantidade) <= 0) {
      setErro('Selecione um produto e informe uma quantidade válida.');
      return;
    }
    try {
      await api.registrarEntrada({ produto_id: Number(produtoId), quantidade: Number(quantidade) });
      setProdutoId('');
      setQuantidade('');
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div>
      <div className="cabecalho-pagina"><h1>Estoque</h1></div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form onSubmit={registrarEntrada} className="cartao" style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 24 }}>
        <div className="form-linha" style={{ flex: 2, marginBottom: 0 }}>
          <label>Produto</label>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
            <option value="">Selecione um produto</option>
            {itens.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nome}</option>)}
          </select>
        </div>
        <div className="form-linha" style={{ flex: 1, marginBottom: 0 }}>
          <label>Quantidade recebida</label>
          <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        </div>
        <button type="submit" className="botao">Registrar entrada</button>
      </form>

      <div className="cartao">
        <table>
          <thead>
            <tr><th>Código</th><th>Nome</th><th>Categoria</th><th>Estoque atual</th><th>Estoque mínimo</th><th>Situação</th></tr>
          </thead>
          <tbody>
            {itens.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nome}</td>
                <td>{p.categoria_nome || '—'}</td>
                <td className={p.estoque_baixo ? 'selo-baixo' : ''}>{p.estoque}</td>
                <td>{p.estoque_minimo}</td>
                <td className={p.estoque_baixo ? 'selo-baixo' : ''}>{p.estoque_baixo ? 'Estoque baixo' : 'Normal'}</td>
              </tr>
            ))}
            {itens.length === 0 && <tr><td colSpan="6">Nenhum produto cadastrado ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

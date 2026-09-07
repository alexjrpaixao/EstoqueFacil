import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');

  function carregar() {
    api
      .listarCategorias()
      .then(setCategorias)
      .catch((e) => setErro(e.message));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro('');

    try {
      if (editando) {
        await api.atualizarCategoria(editando, { nome });
      } else {
        await api.criarCategoria({ nome });
      }

      setNome('');
      setEditando(null);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir(id) {
    if (!confirm('Remover esta categoria?')) {
      return;
    }

    setErro('');

    try {
      await api.removerCategoria(id);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h1>Categorias</h1>
      </div>

      {erro && (
        <div className="mensagem-erro">
          {erro}
        </div>
      )}

      <form
        onSubmit={salvar}
        className="cartao"
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-end',
          marginBottom: 24
        }}
      >
        <div
          className="form-linha"
          style={{
            flex: 1,
            marginBottom: 0
          }}
        >
          <label>
            {editando ? 'Editar categoria' : 'Nova categoria'}
          </label>

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <button className="botao">
          {editando ? 'Salvar' : 'Adicionar'}
        </button>

        {editando && (
          <button
            type="button"
            className="botao secundario"
            onClick={() => {
              setEditando(null);
              setNome('');
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="cartao">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>

                <td>
                  <button
                    className="botao secundario"
                    onClick={() => {
                      setEditando(c.id);
                      setNome(c.nome);
                    }}
                  >
                    Editar
                  </button>{' '}

                  <button
                    className="botao secundario"
                    onClick={() => excluir(c.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {!categorias.length && (
              <tr>
                <td colSpan="2">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
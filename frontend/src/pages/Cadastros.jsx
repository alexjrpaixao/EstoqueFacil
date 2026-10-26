
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const vazio = {
  nome: '',
  telefone: '',
  email: '',
  documento: ''
};

export default function Cadastros({ tipo }) {
  const cliente = tipo === 'clientes';
  const label = cliente ? 'Cliente' : 'Fornecedor';

  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ ...vazio });
  const [edit, setEdit] = useState(null);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');

  const f = cliente
    ? api.listarClientes
    : api.listarFornecedores;

  const criar = cliente
    ? api.criarCliente
    : api.criarFornecedor;

  const atualizar = cliente
    ? api.atualizarCliente
    : api.atualizarFornecedor;

  const remover = cliente
    ? api.removerCliente
    : api.removerFornecedor;

  async function carregar() {
    try {
      const dados = await f();
      setLista(dados);
      setErro('');
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, [tipo]);

  function campo(k, v) {
    setForm(x => ({
      ...x,
      [k]: v
    }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    setOk('');

    try {
      if (edit !== null) {
        await atualizar(edit, form);
      } else {
        await criar(form);
      }

      setForm({ ...vazio });
      setEdit(null);
      setOk(`${label} salvo com sucesso.`);

      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir(id) {
    if (!confirm(`Remover este ${label.toLowerCase()}?`)) {
      return;
    }

    setErro('');
    setOk('');

    try {
      await remover(id);
      setOk(`${label} removido com sucesso.`);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  function editar(x) {
    setEdit(x.id);
    setForm({
      nome: x.nome || '',
      telefone: x.telefone || '',
      email: x.email || '',
      documento: x.documento || ''
    });

    setErro('');
    setOk('');
  }

  function cancelarEdicao() {
    setEdit(null);
    setForm({ ...vazio });
    setErro('');
    setOk('');
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h1>{label}s</h1>
      </div>

      {erro && (
        <div className="mensagem-erro">
          {erro}
        </div>
      )}

      {ok && (
        <div className="mensagem-ok">
          {ok}
        </div>
      )}

      <div
        className="cartao"
        style={{ marginBottom: 24 }}
      >
        <h2>
          {edit !== null ? 'Editar' : 'Novo'}{' '}
          {label.toLowerCase()}
        </h2>

        <form
          className="grade-form"
          onSubmit={salvar}
        >
          <div className="form-linha">
            <label>Nome *</label>
            <input
              value={form.nome}
              onChange={e =>
                campo('nome', e.target.value)
              }
              required
            />
          </div>

          <div className="form-linha">
            <label>Telefone</label>
            <input
              value={form.telefone}
              onChange={e =>
                campo('telefone', e.target.value)
              }
            />
          </div>

          <div className="form-linha">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={e =>
                campo('email', e.target.value)
              }
            />
          </div>

          <div className="form-linha">
            <label>CPF/CNPJ</label>
            <input
              value={form.documento}
              onChange={e =>
                campo('documento', e.target.value)
              }
            />
          </div>

          <div className="acoes">
            <button
              type="submit"
              className="botao"
            >
              {edit !== null
                ? 'Salvar alterações'
                : 'Cadastrar'}
            </button>

            {edit !== null && (
              <button
                type="button"
                className="botao secundario"
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="cartao">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Documento</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.map(x => (
              <tr key={x.id}>
                <td>{x.nome}</td>
                <td>{x.telefone || '—'}</td>
                <td>{x.email || '—'}</td>
                <td>{x.documento || '—'}</td>

                <td>
                  <button
                    type="button"
                    className="botao secundario"
                    onClick={() => editar(x)}
                  >
                    Editar
                  </button>

                  {' '}

                  <button
                    type="button"
                    className="botao perigo"
                    onClick={() => excluir(x.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {lista.length === 0 && (
              <tr>
                <td colSpan="5">
                  Nenhum cadastro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

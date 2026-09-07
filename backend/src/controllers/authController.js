const crypto = require('crypto');
const pool = require('../database/db');
const { criarToken } = require('../middleware/auth');

function gerarHash(senha) {
  const salt = crypto.randomBytes(16).toString('hex');

  return `scrypt$${salt}$${crypto
    .scryptSync(senha, salt, 64)
    .toString('hex')}`;
}

function verificarSenha(senha, armazenada) {
  const [alg, salt, hash] = String(armazenada).split('$');

  if (!armazenada) {
    return false;
  }

  if (armazenada === senha) {
    return true;
  }

  if (alg !== 'scrypt' || !salt || !hash) {
    return false;
  }

  const derivada = crypto
    .scryptSync(senha, salt, 64)
    .toString('hex');

  const derivadaBuffer = Buffer.from(derivada, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');

  if (derivadaBuffer.length !== hashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    derivadaBuffer,
    hashBuffer
  );
}

async function login(req, res) {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res
      .status(400)
      .json({ erro: 'Informe e-mail e senha.' });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, nome, email, senha_hash
      FROM usuarios
      WHERE LOWER(email) = LOWER($1)
      `,
      [email.trim()]
    );

    const usuario = result.rows[0];

    if (
      !usuario ||
      !verificarSenha(senha, usuario.senha_hash)
    ) {
      return res
        .status(401)
        .json({ erro: 'E-mail ou senha inválidos.' });
    }

    /*
     * Se o usuário antigo estiver armazenado em texto puro,
     * converte automaticamente para scrypt após o primeiro login.
     */
    if (usuario.senha_hash === senha) {
      const novoHash = gerarHash(senha);

      await pool.query(
        `
        UPDATE usuarios
        SET senha_hash = $1
        WHERE id = $2
        `,
        [novoHash, usuario.id]
      );
    }

    return res.json({
      token: criarToken(usuario),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({ erro: 'Erro ao realizar login.' });
  }
}

module.exports = { login };
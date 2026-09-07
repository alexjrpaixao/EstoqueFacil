const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || 'estoquefacil-dev-secret-troque-em-producao';

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function assinar(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function criarToken(usuario) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60),
  }));
  return `${header}.${payload}.${assinar(`${header}.${payload}`)}`;
}

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Autenticação necessária.' });
  }

  try {
    const partes = token.split('.');
    if (partes.length !== 3) throw new Error('Token inválido');
    const [header, payload, assinatura] = partes;
    const esperada = assinar(`${header}.${payload}`);
    if (!crypto.timingSafeEqual(Buffer.from(assinatura), Buffer.from(esperada))) throw new Error('Assinatura inválida');
    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!dados.exp || dados.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expirado');
    req.usuario = dados;
    return next();
  } catch (_) {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
}

module.exports = { criarToken, autenticar };

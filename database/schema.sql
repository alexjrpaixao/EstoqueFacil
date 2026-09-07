-- EstoqueFácil 3.0 - PostgreSQL

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) DEFAULT '',
    email VARCHAR(150) DEFAULT '',
    documento VARCHAR(30) DEFAULT '',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_clientes_documento
ON clientes(documento)
WHERE documento <> '';

CREATE TABLE IF NOT EXISTS fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) DEFAULT '',
    email VARCHAR(150) DEFAULT '',
    documento VARCHAR(30) DEFAULT '',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_fornecedores_documento
ON fornecedores(documento)
WHERE documento <> '';

CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    fornecedor_id INTEGER REFERENCES fornecedores(id) ON DELETE SET NULL,
    preco_custo NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK(preco_custo >= 0),
    preco_venda NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK(preco_venda >= 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK(estoque >= 0),
    estoque_minimo INTEGER NOT NULL DEFAULT 0 CHECK(estoque_minimo >= 0),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    data TIMESTAMP NOT NULL DEFAULT NOW(),
    total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK(total >= 0),
    desconto NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK(desconto >= 0),
    forma_pagamento VARCHAR(30) NOT NULL DEFAULT 'Dinheiro',
    status VARCHAR(15) NOT NULL DEFAULT 'finalizada'
        CHECK(status IN ('finalizada','cancelada')),
    cancelada_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_venda (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK(quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL CHECK(preco_unitario >= 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK(subtotal >= 0)
);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    tipo VARCHAR(10) NOT NULL
        CHECK(tipo IN ('entrada','saida','estorno')),
    quantidade INTEGER NOT NULL CHECK(quantidade > 0),
    venda_id INTEGER REFERENCES vendas(id) ON DELETE SET NULL,
    data TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Migração segura para bases criadas em versões anteriores.

ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS fornecedor_id INTEGER
REFERENCES fornecedores(id) ON DELETE SET NULL;

ALTER TABLE vendas
ADD COLUMN IF NOT EXISTS cliente_id INTEGER
REFERENCES clientes(id) ON DELETE SET NULL;

ALTER TABLE vendas
ADD COLUMN IF NOT EXISTS desconto NUMERIC(10,2) NOT NULL DEFAULT 0;

ALTER TABLE vendas
ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(30)
NOT NULL DEFAULT 'Dinheiro';

ALTER TABLE vendas
ADD COLUMN IF NOT EXISTS status VARCHAR(15)
NOT NULL DEFAULT 'finalizada';

ALTER TABLE vendas
ADD COLUMN IF NOT EXISTS cancelada_em TIMESTAMP;

DO $$
BEGIN
    ALTER TABLE movimentacoes_estoque
    DROP CONSTRAINT IF EXISTS movimentacoes_estoque_tipo_check;

    ALTER TABLE movimentacoes_estoque
    ADD CONSTRAINT movimentacoes_estoque_tipo_check
    CHECK(tipo IN ('entrada','saida','estorno'));

EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE movimentacoes_estoque
ADD COLUMN IF NOT EXISTS venda_id INTEGER
REFERENCES vendas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_produtos_categoria
ON produtos(categoria_id);

CREATE INDEX IF NOT EXISTS idx_produtos_fornecedor
ON produtos(fornecedor_id);

CREATE INDEX IF NOT EXISTS idx_itens_venda_venda
ON itens_venda(venda_id);

CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto
ON movimentacoes_estoque(produto_id);

CREATE INDEX IF NOT EXISTS idx_vendas_data
ON vendas(data);

CREATE INDEX IF NOT EXISTS idx_vendas_status
ON vendas(status);

-- Usuário administrador inicial.
-- A senha armazenada abaixo é compatível com o sistema de autenticação atual.

INSERT INTO usuarios(nome, email, senha_hash)
VALUES (
    'Administrador',
    'admin@estoquefacil.com',
    'scrypt$b82a463c7c40bbc98f71793005c8e975$ae8f3aa92c3092dbdeb41f94ebf766fc79021f7aeb7e37aae3df01be89461231c12cb063747d2106bc536f3cde8a524c0ef95ea37259a7254054250de8b3747b'
)
ON CONFLICT(email) DO NOTHING;

-- Categorias iniciais.

INSERT INTO categorias(nome)
VALUES
    ('Selas'),
    ('Rédeas e Cabeçadas'),
    ('Ferragens'),
    ('Acessórios')
ON CONFLICT(nome) DO NOTHING;
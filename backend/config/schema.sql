CREATE DATABASE IF NOT EXISTS adocicada_gourmet
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE adocicada_gourmet;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  tipo ENUM('cliente','confeiteiro') NOT NULL DEFAULT 'cliente',
  avatar_url VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sabores_massa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  imagem_url VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recheios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  imagem_url VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tamanhos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  descricao VARCHAR(100),
  porcoes VARCHAR(50),
  preco_base DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS galeria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  imagem_url VARCHAR(255) NOT NULL,
  categoria VARCHAR(80),
  destaque BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  cliente_id INT NOT NULL,
  sabor_massa_id INT,
  recheio_id INT,
  tamanho_id INT,
  data_entrega DATE NOT NULL,
  observacoes TEXT,
  endereco_entrega TEXT,
  status ENUM('aguardando','confirmado','em_producao','pronto','entregue','cancelado') DEFAULT 'aguardando',
  preco_total DECIMAL(10,2),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
  FOREIGN KEY (sabor_massa_id) REFERENCES sabores_massa(id),
  FOREIGN KEY (recheio_id) REFERENCES recheios(id),
  FOREIGN KEY (tamanho_id) REFERENCES tamanhos(id)
);

INSERT INTO sabores_massa (nome, descricao) VALUES
  ('Baunilha Clássica', 'Massa fofinha de baunilha com aroma suave e leveza incomparável'),
  ('Chocolate Belga', 'Massa intensa de cacau 70% com textura aveludada'),
  ('Red Velvet', 'Massa vermelha e acetinada com leve toque de cacau'),
  ('Limão Siciliano', 'Massa cítrica e fresca com raspas de limão siciliano'),
  ('Cenoura Gourmet', 'Massa de cenoura úmida com especiarias suaves'),
  ('Coco Tropical', 'Massa cremosa com coco fresco ralado');

INSERT INTO recheios (nome, descricao) VALUES
  ('Brigadeiro Gourmet', 'Brigadeiro cremoso feito com chocolate belga e creme de leite fresco'),
  ('Doce de Leite Artesanal', 'Doce de leite produzido artesanalmente por 8 horas'),
  ('Mousse de Maracujá', 'Mousse leve e ácida de maracujá fresco com chantilly'),
  ('Morango com Chantilly', 'Morangos frescos laminados com chantilly artesanal'),
  ('Nutella Trufada', 'Camadas de Nutella com trufas de chocolate meio amargo'),
  ('Limão com Merengue', 'Creme de limão siciliano coberto com merengue italiano');

INSERT INTO tamanhos (nome, descricao, porcoes, preco_base) VALUES
  ('P — Petit', 'Bolo redondo 15cm', '8 a 10 fatias', 89.90),
  ('M — Médio', 'Bolo redondo 20cm', '15 a 20 fatias', 149.90),
  ('G — Grande', 'Bolo redondo 25cm', '25 a 35 fatias', 219.90),
  ('GG — Festão', 'Bolo redondo 30cm', '40 a 50 fatias', 319.90);

INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES
  ('Confeiteira', 'confeiteiro@adocicada.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   'confeiteiro');
const pool = require("../config/database");

const listarSaboresMassa = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM sabores_massa WHERE ativo = TRUE ORDER BY nome",
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar sabores.", detalhes: err.message });
  }
};

const listarRecheios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM recheios WHERE ativo = TRUE ORDER BY nome",
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar recheios.", detalhes: err.message });
  }
};

const listarTamanhos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tamanhos WHERE ativo = TRUE ORDER BY preco_base",
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar tamanhos.", detalhes: err.message });
  }
};

const listarGaleria = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM galeria ORDER BY destaque DESC, criado_em DESC",
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar galeria.", detalhes: err.message });
  }
};

const adicionarGaleria = async (req, res) => {
  const { titulo, descricao, categoria, destaque } = req.body;
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!titulo || !imagem_url) {
    return res.status(400).json({ erro: "Título e imagem são obrigatórios." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO galeria (titulo, descricao, imagem_url, categoria, destaque) VALUES (?, ?, ?, ?, ?)",
      [
        titulo,
        descricao || null,
        imagem_url,
        categoria || null,
        destaque === "true" || destaque === true,
      ],
    );
    res
      .status(201)
      .json({ mensagem: "Imagem adicionada!", id: result.insertId });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao adicionar imagem.", detalhes: err.message });
  }
};

const upsertSaborMassa = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (id) {
      const updates = ["nome = ?", "descricao = ?"];
      const vals = [nome, descricao];
      if (imagem_url) {
        updates.push("imagem_url = ?");
        vals.push(imagem_url);
      }
      vals.push(id);
      await pool.query(
        `UPDATE sabores_massa SET ${updates.join(", ")} WHERE id = ?`,
        vals,
      );
      res.json({ mensagem: "Sabor atualizado!" });
    } else {
      const [result] = await pool.query(
        "INSERT INTO sabores_massa (nome, descricao, imagem_url) VALUES (?, ?, ?)",
        [nome, descricao || null, imagem_url],
      );
      res.status(201).json({ mensagem: "Sabor criado!", id: result.insertId });
    }
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao salvar sabor.", detalhes: err.message });
  }
};

const upsertRecheio = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (id) {
      const updates = ["nome = ?", "descricao = ?"];
      const vals = [nome, descricao];
      if (imagem_url) {
        updates.push("imagem_url = ?");
        vals.push(imagem_url);
      }
      vals.push(id);
      await pool.query(
        `UPDATE recheios SET ${updates.join(", ")} WHERE id = ?`,
        vals,
      );
      res.json({ mensagem: "Recheio atualizado!" });
    } else {
      const [result] = await pool.query(
        "INSERT INTO recheios (nome, descricao, imagem_url) VALUES (?, ?, ?)",
        [nome, descricao || null, imagem_url],
      );
      res
        .status(201)
        .json({ mensagem: "Recheio criado!", id: result.insertId });
    }
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao salvar recheio.", detalhes: err.message });
  }
};

module.exports = {
  listarSaboresMassa,
  listarRecheios,
  listarTamanhos,
  listarGaleria,
  adicionarGaleria,
  upsertSaborMassa,
  upsertRecheio,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
require("dotenv").config();

const registrar = async (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, e-mail e senha são obrigatórios." });
  }

  try {
    const [existente] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );
    if (existente.length > 0) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    const hash = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo) VALUES (?, ?, ?, ?, "cliente")',
      [nome, email, hash, telefone || null],
    );

    const token = jwt.sign(
      { id: result.insertId, nome, email, tipo: "cliente" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      mensagem: "Cadastro realizado!",
      token,
      usuario: { id: result.insertId, nome, email, tipo: "cliente" },
    });
  } catch (err) {
    console.error("Erro ao cadrastrar usuário:", err);
    res
      .status(500)
      .json({ erro: "Erro ao cadastrar usuário.", detalhes: err.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      mensagem: "Login realizado!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao realizar login.", detalhes: err.message });
  }
};

module.exports = { registrar, login };

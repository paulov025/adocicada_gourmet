const pool = require("../config/database");

const gerarCodigo = () => {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = Math.floor(1000 + Math.random() * 9000);
  const letra = letras[Math.floor(Math.random() * letras.length)];
  return `ADG-${letra}${nums}`;
};

const criarPedido = async (req, res) => {
  const {
    sabor_massa_id,
    recheio_id,
    tamanho_id,
    data_entrega,
    observacoes,
    endereco_entrega,
  } = req.body;
  const cliente_id = req.usuario.id;

  if (!tamanho_id || !data_entrega) {
    return res
      .status(400)
      .json({ erro: "Tamanho e data de entrega são obrigatórios." });
  }

  try {
    const [tamanho] = await pool.query(
      "SELECT preco_base FROM tamanhos WHERE id = ?",
      [tamanho_id],
    );
    if (tamanho.length === 0)
      return res.status(400).json({ erro: "Tamanho inválido." });

    const codigo = gerarCodigo();
    const preco_total = tamanho[0].preco_base;

    const [result] = await pool.query(
      `INSERT INTO pedidos 
        (codigo, cliente_id, sabor_massa_id, recheio_id, tamanho_id, data_entrega, observacoes, endereco_entrega, preco_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo,
        cliente_id,
        sabor_massa_id || null,
        recheio_id || null,
        tamanho_id,
        data_entrega,
        observacoes || null,
        endereco_entrega || null,
        preco_total,
      ],
    );

    res
      .status(201)
      .json({
        mensagem: "Pedido criado!",
        codigo,
        id: result.insertId,
        preco_total,
      });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao criar pedido.", detalhes: err.message });
  }
};

const meusPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, sm.nome AS sabor_massa, r.nome AS recheio, t.nome AS tamanho
       FROM pedidos p
       LEFT JOIN sabores_massa sm ON p.sabor_massa_id = sm.id
       LEFT JOIN recheios r ON p.recheio_id = r.id
       LEFT JOIN tamanhos t ON p.tamanho_id = t.id
       WHERE p.cliente_id = ?
       ORDER BY p.criado_em DESC`,
      [req.usuario.id],
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar pedidos.", detalhes: err.message });
  }
};

const todosPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.nome AS cliente_nome, u.telefone AS cliente_telefone, u.email AS cliente_email,
              sm.nome AS sabor_massa, r.nome AS recheio, t.nome AS tamanho
       FROM pedidos p
       LEFT JOIN usuarios u ON p.cliente_id = u.id
       LEFT JOIN sabores_massa sm ON p.sabor_massa_id = sm.id
       LEFT JOIN recheios r ON p.recheio_id = r.id
       LEFT JOIN tamanhos t ON p.tamanho_id = t.id
       ORDER BY p.criado_em DESC`,
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar pedidos.", detalhes: err.message });
  }
};

const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const statusValidos = [
    "aguardando",
    "confirmado",
    "em_producao",
    "pronto",
    "entregue",
    "cancelado",
  ];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: "Status inválido." });
  }

  try {
    await pool.query("UPDATE pedidos SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ mensagem: "Status atualizado!" });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar status.", detalhes: err.message });
  }
};

module.exports = { criarPedido, meusPedidos, todosPedidos, atualizarStatus };

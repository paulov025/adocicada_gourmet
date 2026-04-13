const express = require("express");
const router = express.Router();
const { autenticar, apenasConfeiteiro } = require("../middleware/auth");
const {
  criarPedido,
  meusPedidos,
  todosPedidos,
  atualizarStatus,
} = require("../controllers/pedidoController");

router.post("/", autenticar, criarPedido);
router.get("/meus", autenticar, meusPedidos);
router.get("/todos", autenticar, apenasConfeiteiro, todosPedidos);
router.patch("/:id/status", autenticar, apenasConfeiteiro, atualizarStatus);

module.exports = router;

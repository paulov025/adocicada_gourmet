const jwt = require("jsonwebtoken");
require("dotenv").config();

const autenticar = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err)
      return res.status(403).json({ erro: "Token inválido ou expirado." });
    req.usuario = usuario;
    next();
  });
};

const apenasConfeiteiro = (req, res, next) => {
  if (req.usuario.tipo !== "confeiteiro") {
    return res.status(403).json({ erro: "Acesso restrito ao confeiteiro." });
  }
  next();
};

module.exports = { autenticar, apenasConfeiteiro };

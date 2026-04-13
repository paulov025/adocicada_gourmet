const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// Rotas da API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/catalogo", require("./routes/catalogo"));

// Qualquer outra rota serve o frontend
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`\n🎂 Adocicada.Gourmet rodando em http://localhost:${PORT}\n`);
});

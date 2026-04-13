const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { autenticar, apenasConfeiteiro } = require("../middleware/auth");
const {
  listarSaboresMassa,
  listarRecheios,
  listarTamanhos,
  listarGaleria,
  adicionarGaleria,
  upsertSaborMassa,
  upsertRecheio,
} = require("../controllers/catalogoController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/sabores-massa", listarSaboresMassa);
router.get("/recheios", listarRecheios);
router.get("/tamanhos", listarTamanhos);
router.get("/galeria", listarGaleria);

router.post(
  "/galeria",
  autenticar,
  apenasConfeiteiro,
  upload.single("imagem"),
  adicionarGaleria,
);
router.post(
  "/sabores-massa",
  autenticar,
  apenasConfeiteiro,
  upload.single("imagem"),
  (req, res) => {
    req.params.id = null;
    upsertSaborMassa(req, res);
  },
);
router.put(
  "/sabores-massa/:id",
  autenticar,
  apenasConfeiteiro,
  upload.single("imagem"),
  upsertSaborMassa,
);
router.post(
  "/recheios",
  autenticar,
  apenasConfeiteiro,
  upload.single("imagem"),
  (req, res) => {
    req.params.id = null;
    upsertRecheio(req, res);
  },
);
router.put(
  "/recheios/:id",
  autenticar,
  apenasConfeiteiro,
  upload.single("imagem"),
  upsertRecheio,
);

module.exports = router;

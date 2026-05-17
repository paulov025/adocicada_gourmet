# 🎂 Adocicada.Gourmet

<div align="center">

![Banner](https://img.shields.io/badge/Adocicada.Gourmet-Confeitaria%20Artesanal-C9687F?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJhNSA1IDAgMCAxIDUgNXYxaDFhMiAyIDAgMCAxIDIgMnY5YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjEwYTIgMiAwIDAgMSAyLTJoMVY3YTUgNSAwIDAgMSA1LTV6Ii8+PC9zdmc+)

**Sistema completo de encomendas de bolos gourmet**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-C9687F?style=flat-square)](LICENSE)

[🌐 Acessar o Site](https://adocicadagourmet-production.up.railway.app) · [🐛 Reportar Bug](../../issues) · [✨ Sugerir Feature](../../issues)

</div>

---

## 📸 Preview

<div align="center">

| Página Inicial | Fazer Pedido | Painel da Confeiteira |
|:-:|:-:|:-:|
| 🏠 Home com galeria e catálogo | 🎂 Wizard em 4 etapas | 👩‍🍳 Dashboard completo |

</div>

---

## ✨ Funcionalidades

### 👩‍🍳 Para a Confeiteira
- 📋 Painel com todos os pedidos em tempo real
- 📊 Métricas de faturamento e pedidos em aberto
- 🔄 Atualização de status dos pedidos
- 🖼️ Gerenciamento da galeria de fotos
- 🌸 Cadastro de sabores de massa e recheios
- 📏 Gerenciamento de tamanhos e preços

### 🛍️ Para os Clientes
- 🎂 Montagem de pedido em 4 etapas intuitivas
- 🌸 Escolha de sabor de massa, recheio e tamanho
- 📝 Campo de personalizações e observações
- 🔐 Sistema de cadastro e login
- 📦 Código único por pedido para acompanhamento

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Uso |
|-----------|-----|
| **Node.js** | Runtime JavaScript |
| **Express** | Framework web |
| **MySQL2** | Banco de dados |
| **JWT** | Autenticação |
| **Bcrypt** | Criptografia de senhas |
| **Multer** | Upload de imagens |

### Frontend
| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura |
| **CSS3** | Estilização com variáveis e animações |
| **JavaScript** | Lógica e consumo de API |
| **Google Fonts** | Tipografia (Cormorant Garamond + DM Sans) |

### Infraestrutura
| Serviço | Uso |
|---------|-----|
| **Railway** | Hospedagem do backend e banco de dados |
| **GitHub** | Versionamento de código |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js v18+
- MySQL 8+
- Git

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/adocicada-gourmet.git
cd adocicada-gourmet
```

**2. Configure o banco de dados**
```bash
# Abra o MySQL e execute o schema
mysql -u root -p < backend/config/schema.sql
```

**3. Configure as variáveis de ambiente**
```bash
cd backend
cp .env.example .env
# Edite o .env com suas credenciais
```

**4. Instale as dependências e rode**
```bash
npm install
npm run dev
```

**5. Acesse o site**
```
http://localhost:3000/pages/index.html
```

---

## 📁 Estrutura do Projeto

```
adocicada-gourmet/
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── database.js       # Conexão MySQL
│   │   └── schema.sql        # Estrutura do banco
│   ├── 📂 controllers/
│   │   ├── authController.js
│   │   ├── pedidoController.js
│   │   └── catalogoController.js
│   ├── 📂 middleware/
│   │   └── auth.js           # JWT middleware
│   ├── 📂 routes/
│   │   ├── auth.js
│   │   ├── pedidos.js
│   │   └── catalogo.js
│   ├── server.js
│   └── package.json
│
└── 📂 frontend/
    ├── 📂 css/
    │   └── style.css
    ├── 📂 js/
    │   └── app.js
    └── 📂 pages/
        ├── index.html        # Página principal
        ├── pedido.html       # Fazer encomenda
        └── painel.html       # Painel da confeiteira
```

---

## 🔌 API Endpoints

### Autenticação
```
POST /api/auth/registrar   — Cadastrar cliente
POST /api/auth/login       — Login
```

### Pedidos
```
POST   /api/pedidos              — Criar pedido
GET    /api/pedidos/meus         — Meus pedidos
GET    /api/pedidos/todos        — Todos os pedidos (confeiteiro)
PATCH  /api/pedidos/:id/status   — Atualizar status (confeiteiro)
```

### Catálogo
```
GET  /api/catalogo/sabores-massa   — Listar sabores
GET  /api/catalogo/recheios        — Listar recheios
GET  /api/catalogo/tamanhos        — Listar tamanhos
GET  /api/catalogo/galeria         — Listar galeria
POST /api/catalogo/galeria         — Adicionar foto
---

## 🗺️ Roadmap

- [ ] 📱 Integração com WhatsApp
- [ ] 💳 Pagamento online (Mercado Pago)
- [ ] 📧 Notificações por e-mail
- [ ] 📅 Calendário de disponibilidade
- [ ] 📱 Layout mobile aprimorado
- [ ] ⭐ Sistema de avaliações

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com 💕 e muito açúcar para a **Adocicada.Gourmet**

*Confeitaria artesanal com amor ✦ Fortaleza, CE*

</div>

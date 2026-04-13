const API = "http://localhost:3001/api";

const Auth = {
  getToken: () => localStorage.getItem("adocicada_token"),
  getUser: () => JSON.parse(localStorage.getItem("adocicada_user") || "null"),
  isLogged: () => !!localStorage.getItem("adocicada_token"),
  isConfeiteiro: () => Auth.getUser()?.tipo === "confeiteiro",

  save(token, usuario) {
    localStorage.setItem("adocicada_token", token);
    localStorage.setItem("adocicada_user", JSON.stringify(usuario));
  },
  clear() {
    localStorage.removeItem("adocicada_token");
    localStorage.removeItem("adocicada_user");
  },
};

async function api(method, path, data = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (Auth.getToken())
    opts.headers["Authorization"] = `Bearer ${Auth.getToken()}`;
  if (data) opts.body = JSON.stringify(data);

  const res = await fetch(API + path, opts);
  const json = await res.json();
  if (!res.ok) throw new Error(json.erro || "Erro na requisição");
  return json;
}

async function apiForm(method, path, formData) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${Auth.getToken()}` },
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.erro || "Erro na requisição");
  return json;
}

function toast(msg, tipo = "default") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const el = document.createElement("div");
  const icons = { success: "✓", error: "✕", default: "🎂" };
  el.className = `toast ${tipo}`;
  el.innerHTML = `<span>${icons[tipo] || "🎂"}</span> ${msg}`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 400);
  }, 3500);
}

function openModal(tab = "login") {
  const overlay = document.getElementById("auth-modal");
  if (!overlay) return;
  overlay.classList.add("open");
  if (tab) switchTab(tab);
}
function closeModal() {
  document.getElementById("auth-modal")?.classList.remove("open");
}
function switchTab(tab) {
  document
    .querySelectorAll(".modal-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((f) => f.classList.add("hidden"));
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add("active");
  document.getElementById(`form-${tab}`)?.classList.remove("hidden");
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  try {
    const data = await api("POST", "/auth/login", { email, senha });
    Auth.save(data.token, data.usuario);
    closeModal();
    toast(`Bem-vinda de volta, ${data.usuario.nome}! 🎂`, "success");
    updateNavbar();
    if (data.usuario.tipo === "confeiteiro") {
      setTimeout(() => (window.location.href = "/pages/painel.html"), 800);
    }
  } catch (err) {
    toast(err.message, "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const nome = document.getElementById("reg-nome").value;
  const email = document.getElementById("reg-email").value;
  const telefone = document.getElementById("reg-telefone").value;
  const senha = document.getElementById("reg-senha").value;
  try {
    const data = await api("POST", "/auth/registrar", {
      nome,
      email,
      telefone,
      senha,
    });
    Auth.save(data.token, data.usuario);
    closeModal();
    toast(
      `Cadastro realizado! Seja bem-vinda, ${data.usuario.nome}! 🎉`,
      "success",
    );
    updateNavbar();
  } catch (err) {
    toast(err.message, "error");
  }
}

function logout() {
  Auth.clear();
  toast("Até logo! 👋");
  updateNavbar();
  if (window.location.pathname.includes("painel")) {
    window.location.href = "/pages/index.html";
  }
}

function updateNavbar() {
  const user = Auth.getUser();
  const actionsEl = document.getElementById("navbar-actions");
  if (!actionsEl) return;

  if (user) {
    actionsEl.innerHTML = `
      <span style="font-size:14px;color:var(--text-mid)">Olá, <strong>${user.nome.split(" ")[0]}</strong></span>
      ${
        user.tipo === "confeiteiro"
          ? `<a href="/pages/painel.html" class="btn btn-primary btn-sm">🎂 Painel</a>`
          : `<a href="/pages/pedido.html" class="btn btn-primary btn-sm">Fazer Pedido</a>`
      }
      <button onclick="logout()" class="btn btn-outline btn-sm">Sair</button>
    `;
  } else {
    actionsEl.innerHTML = `
      <button onclick="openModal('login')" class="btn btn-outline btn-sm">Entrar</button>
      <button onclick="openModal('register')" class="btn btn-primary btn-sm">Cadastrar</button>
    `;
  }
}

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
});

async function carregarSabores(containerId) {
  try {
    const sabores = await api("GET", "/catalogo/sabores-massa");
    const el = document.getElementById(containerId);
    if (!el) return;
    const emojis = ["🌸", "🍫", "❤️", "🍋", "🥕", "🥥"];
    el.innerHTML = sabores
      .map(
        (s, i) => `
      <div class="catalog-card">
        <div class="catalog-card-img">${emojis[i % emojis.length]}</div>
        <div class="catalog-card-body">
          <h3 class="catalog-card-title">${s.nome}</h3>
          <p class="catalog-card-desc">${s.descricao || ""}</p>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Erro ao carregar sabores:", err);
  }
}

async function carregarRecheios(containerId) {
  try {
    const recheios = await api("GET", "/catalogo/recheios");
    const el = document.getElementById(containerId);
    if (!el) return;
    const emojis = ["🍫", "🥛", "🌼", "🍓", "🍬", "🍋"];
    el.innerHTML = recheios
      .map(
        (r, i) => `
      <div class="catalog-card">
        <div class="catalog-card-img">${emojis[i % emojis.length]}</div>
        <div class="catalog-card-body">
          <h3 class="catalog-card-title">${r.nome}</h3>
          <p class="catalog-card-desc">${r.descricao || ""}</p>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Erro ao carregar recheios:", err);
  }
}

let pedidoData = {
  sabor_massa_id: null,
  recheio_id: null,
  tamanho_id: null,
  tamanho_preco: null,
};

function goStep(n) {
  document.querySelectorAll(".order-step").forEach((s, i) => {
    s.classList.toggle("active", i + 1 === n);
  });
  document.querySelectorAll(".step-btn").forEach((b, i) => {
    b.classList.remove("active");
    if (i + 1 < n) b.classList.add("done");
    if (i + 1 === n) b.classList.add("active");
  });
  document.getElementById(`step-${n}`)?.classList.add("active");
}

function selectOption(type, id, el, preco = null) {
  document
    .querySelectorAll(`[data-type="${type}"]`)
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
  pedidoData[`${type}_id`] = id;
  if (preco) pedidoData.tamanho_preco = preco;
  updateResumo();
}

function updateResumo() {
  const resumo = document.getElementById("resumo-preco");
  if (resumo && pedidoData.tamanho_preco) {
    resumo.textContent = `R$ ${pedidoData.tamanho_preco.toFixed(2).replace(".", ",")}`;
  }
}

async function carregarOpcoesStep2() {
  try {
    const [sabores, recheios, tamanhos] = await Promise.all([
      api("GET", "/catalogo/sabores-massa"),
      api("GET", "/catalogo/recheios"),
      api("GET", "/catalogo/tamanhos"),
    ]);

    const eSabores = document.getElementById("opcoes-sabores");
    const eRecheios = document.getElementById("opcoes-recheios");
    const eTamanhos = document.getElementById("opcoes-tamanhos");
    const emojisS = ["🌸", "🍫", "❤️", "🍋", "🥕", "🥥"];
    const emojisR = ["🍫", "🥛", "🌼", "🍓", "🍬", "🍋"];

    if (eSabores)
      eSabores.innerHTML = sabores
        .map(
          (s, i) => `
      <div class="option-card" data-type="sabor_massa" onclick="selectOption('sabor_massa',${s.id},this)">
        <div class="option-card-emoji">${emojisS[i % emojisS.length]}</div>
        <div class="option-card-name">${s.nome}</div>
        <div class="option-card-desc">${(s.descricao || "").slice(0, 60)}...</div>
      </div>
    `,
        )
        .join("");

    if (eRecheios)
      eRecheios.innerHTML = recheios
        .map(
          (r, i) => `
      <div class="option-card" data-type="recheio" onclick="selectOption('recheio',${r.id},this)">
        <div class="option-card-emoji">${emojisR[i % emojisR.length]}</div>
        <div class="option-card-name">${r.nome}</div>
        <div class="option-card-desc">${(r.descricao || "").slice(0, 60)}...</div>
      </div>
    `,
        )
        .join("");

    if (eTamanhos)
      eTamanhos.innerHTML = tamanhos
        .map(
          (t) => `
      <div class="option-card" data-type="tamanho" onclick="selectOption('tamanho',${t.id},this,${t.preco_base})">
        <div class="option-card-emoji">🎂</div>
        <div class="option-card-name">${t.nome}</div>
        <div class="option-card-desc">${t.porcoes}</div>
        <div class="option-card-price">R$ ${parseFloat(t.preco_base).toFixed(2).replace(".", ",")}</div>
      </div>
    `,
        )
        .join("");
  } catch (err) {
    console.error("Erro ao carregar opções:", err);
  }
}

const statusMap = {
  aguardando: { label: "Aguardando", badge: "badge-waiting" },
  confirmado: { label: "Confirmado", badge: "badge-confirm" },
  em_producao: { label: "Em produção", badge: "badge-making" },
  pronto: { label: "Pronto!", badge: "badge-ready" },
  entregue: { label: "Entregue", badge: "badge-done" },
  cancelado: { label: "Cancelado", badge: "badge-cancel" },
};

async function carregarPainel() {
  if (!Auth.isConfeiteiro()) {
    window.location.href = "/pages/index.html";
    return;
  }
  try {
    const pedidos = await api("GET", "/pedidos/todos");
    renderMetricas(pedidos);
    renderTabelaPedidos(pedidos);
  } catch (err) {
    toast("Erro ao carregar pedidos: " + err.message, "error");
  }
}

function renderMetricas(pedidos) {
  const total = pedidos.length;
  const emAberto = pedidos.filter(
    (p) => p.status !== "entregue" && p.status !== "cancelado",
  ).length;
  const producao = pedidos.filter((p) => p.status === "em_producao").length;
  const faturamento = pedidos
    .filter((p) => p.status !== "cancelado")
    .reduce((a, p) => a + parseFloat(p.preco_total || 0), 0);

  const m = document.getElementById("metricas");
  if (m)
    m.innerHTML = `
    <div class="metric-card"><div class="metric-icon">📋</div><div class="metric-value">${total}</div><div class="metric-label">Total de pedidos</div></div>
    <div class="metric-card"><div class="metric-icon">⏳</div><div class="metric-value">${emAberto}</div><div class="metric-label">Em aberto</div></div>
    <div class="metric-card"><div class="metric-icon">👩‍🍳</div><div class="metric-value">${producao}</div><div class="metric-label">Em produção</div></div>
    <div class="metric-card"><div class="metric-icon">💰</div><div class="metric-value">R$ ${faturamento.toFixed(2).replace(".", ",")}</div><div class="metric-label">Faturamento total</div></div>
  `;
}

function renderTabelaPedidos(pedidos) {
  const tbody = document.getElementById("tabela-pedidos");
  if (!tbody) return;
  tbody.innerHTML = pedidos
    .map((p) => {
      const st = statusMap[p.status] || { label: p.status, badge: "" };
      return `
    <tr>
      <td><strong>${p.codigo}</strong></td>
      <td>
        <div style="font-weight:500">${p.cliente_nome || "—"}</div>
        <div style="font-size:12px;color:var(--text-light)">${p.cliente_email || ""}</div>
        ${p.cliente_telefone ? `<div style="font-size:12px;color:var(--text-light)">${p.cliente_telefone}</div>` : ""}
      </td>
      <td>
        ${p.sabor_massa ? `<div>Massa: ${p.sabor_massa}</div>` : ""}
        ${p.recheio ? `<div>Recheio: ${p.recheio}</div>` : ""}
        ${p.tamanho ? `<div>Tamanho: ${p.tamanho}</div>` : ""}
      </td>
      <td>${p.data_entrega ? new Date(p.data_entrega).toLocaleDateString("pt-BR") : "—"}</td>
      <td><p style="font-size:12px;color:var(--text-mid);max-width:180px">${p.observacoes || "—"}</p></td>
      <td><span class="badge ${st.badge}">${st.label}</span></td>
      <td>
        <select class="status-select" onchange="mudarStatus(${p.id}, this.value)">
          ${Object.entries(statusMap)
            .map(
              ([v, s]) =>
                `<option value="${v}" ${v === p.status ? "selected" : ""}>${s.label}</option>`,
            )
            .join("")}
        </select>
      </td>
      <td><strong>R$ ${parseFloat(p.preco_total || 0)
        .toFixed(2)
        .replace(".", ",")}</strong></td>
    </tr>`;
    })
    .join("");
}

async function mudarStatus(id, status) {
  try {
    await api("PATCH", `/pedidos/${id}/status`, { status });
    toast("Status atualizado!", "success");
    carregarPainel();
  } catch (err) {
    toast(err.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  document.getElementById("auth-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "auth-modal") closeModal();
  });
});

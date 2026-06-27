// ═══════════════════════════════════════════════════════════════
//  InfoLab Escolar
//  Colégio Estadual Mathias Jacomel · Pinhais / PR
// ═══════════════════════════════════════════════════════════════

// ── SUPABASE ──────────────────────────────────────────────────
const supabaseConfig = window.INFOLAB_SUPABASE || {};
const client = window.supabase && supabaseConfig.url && supabaseConfig.publishableKey
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;

const ICONS = {
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M3 19v-5h5"/><path d="M21 5v5h-5"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14v3"/><path d="M12 9v8"/><path d="M17 5v12"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15"/><path d="M15 6v15"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-3-3 2.5-2.5Z"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
};

const STATUS = {
  livre: {
    label: "Livre",
    className: "livre",
    hint: "Disponível para uso",
  },
  uso: {
    label: "Em uso",
    className: "uso",
    hint: "Computador ocupado",
  },
  manutencao: {
    label: "Manutenção",
    className: "manut",
    hint: "Em revisão técnica",
  },
  defeito: {
    label: "Defeito",
    className: "defeito",
    hint: "Precisa de reparo",
  },
};

const STATUS_ALIASES = {
  livre: "livre",
  disponivel: "livre",
  disponível: "livre",
  uso: "uso",
  "em uso": "uso",
  ocupado: "uso",
  manutencao: "manutencao",
  manutenção: "manutencao",
  manut: "manutencao",
  defeito: "defeito",
  quebrado: "defeito",
};

const appState = {
  usuario: null,
  computadores: [],
  realtimeChannel: null,
  relogioTimer: null,
  refreshTimer: null,
  counters: new Map(),
};

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  window.InfoLabAnimations?.initAuthBackground("bg-canvas");
  bindAuthEvents();
  restoreSession();

  if (!client) {
    toast("Supabase não foi configurado. Verifique o arquivo supabase-config.js.", "erro");
  }
});

// ═══════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════
function bindAuthEvents() {
  $("tabLogin")?.addEventListener("click", mostrarLogin);
  $("tabCadastro")?.addEventListener("click", mostrarCadastro);
  $("openCadastro")?.addEventListener("click", mostrarCadastro);
  $("openLogin")?.addEventListener("click", mostrarLogin);
  $("loginArea")?.addEventListener("submit", entrar);
  $("cadastroArea")?.addEventListener("submit", cadastrar);
}

function mostrarLogin() {
  $("loginArea").hidden = false;
  $("cadastroArea").hidden = true;
  $("tabLogin").classList.add("active");
  $("tabCadastro").classList.remove("active");
  $("tabPill").classList.remove("right");
}

function mostrarCadastro() {
  $("loginArea").hidden = true;
  $("cadastroArea").hidden = false;
  $("tabCadastro").classList.add("active");
  $("tabLogin").classList.remove("active");
  $("tabPill").classList.add("right");
}

async function cadastrar(event) {
  event.preventDefault();
  if (!ensureSupabase()) return;

  const form = event.currentTarget;
  const nome = $("nome").value.trim();
  const email = $("email").value.trim().toLowerCase();
  const senha = $("senha").value.trim();
  const tipo = $("tipo").value;

  if (!nome || !email || !senha) {
    toast("Preencha todos os campos.", "erro");
    return;
  }

  if (senha.length < 6) {
    toast("Use uma senha com pelo menos 6 caracteres.", "erro");
    return;
  }

  const btn = form.querySelector(".btn-grad");
  setButtonLoading(btn, true, "Aguarde...");

  const { data, error } = await client.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, tipo },
    },
  });

  setButtonLoading(btn, false, "Criar minha conta");

  if (error) {
    toast("Erro ao cadastrar: " + error.message, "erro");
    return;
  }

  form.reset();
  if (data.session && data.user) {
    const usuario = await carregarPerfilUsuario(data.user);
    toast("Conta criada com sucesso.");
    abrirPainel(usuario);
    return;
  }

  toast("Conta criada. Confira seu e-mail para confirmar o cadastro.");
  mostrarLogin();
}

async function entrar(event) {
  event.preventDefault();
  if (!ensureSupabase()) return;

  const form = event.currentTarget;
  const email = $("loginEmail").value.trim().toLowerCase();
  const senha = $("loginSenha").value.trim();

  if (!email || !senha) {
    toast("Preencha e-mail e senha.", "erro");
    return;
  }

  const btn = form.querySelector(".btn-grad");
  setButtonLoading(btn, true, "Entrando...");

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: senha,
  });

  setButtonLoading(btn, false, "Entrar no sistema");

  if (error) {
    toast("Erro ao entrar: " + error.message, "erro");
    return;
  }

  if (!data.user) {
    toast("E-mail ou senha incorretos.", "erro");
    return;
  }

  const usuario = await carregarPerfilUsuario(data.user);
  abrirPainel(usuario);
}

async function restoreSession() {
  if (!client) return;

  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.user) return;

  const usuario = await carregarPerfilUsuario(data.session.user);
  abrirPainel(usuario);
}

async function carregarPerfilUsuario(user) {
  const fallback = {
    id: user.id,
    nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Usuário",
    email: user.email || "",
    tipo: "aluno",
  };

  const { data, error } = await client
    .from("profiles")
    .select("id,nome,email,tipo")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("Não foi possível carregar profile:", error);
    toast("Perfil não encontrado. Rode o arquivo supabase-setup.sql no Supabase.", "erro");
    return fallback;
  }

  return {
    ...fallback,
    ...data,
    email: data?.email || fallback.email,
  };
}

function setButtonLoading(button, isLoading, label) {
  if (!button) return;
  button.disabled = isLoading;
  const text = button.querySelector("span");
  if (text) text.textContent = label;
}

function ensureSupabase() {
  if (client) return true;
  toast("Supabase não carregou. Verifique supabase-config.js e recarregue a página.", "erro");
  return false;
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════
function abrirPainel(usuario) {
  appState.usuario = usuario;

  $("app").style.display = "none";
  $("bg-canvas").style.display = "none";

  const dash = $("dashboard");
  dash.style.display = "block";
  dash.innerHTML = dashboardTemplate(usuario);

  bindDashboardEvents();
  iniciarRelogio();
  carregarComputadores();
  iniciarRealtimeComputadores();
  window.InfoLabAnimations?.reveal(".welcome-banner, .role-panel, .stat-card, .lab-card, .ativ-card", 45);
}

function dashboardTemplate(usuario) {
  const isProf = isProfessor(usuario);
  const roleName = isProf ? "Professor" : "Aluno";
  const safeName = escapeHtml(usuario.nome || "Usuário");
  const safeEmail = escapeHtml(usuario.email || "");

  return `
    <nav class="topbar">
      <div class="topbar-brand">
        <img src="logo.png" alt="Colégio Mathias Jacomel">
        <div>
          <div class="tb-name">InfoLab Escolar</div>
          <div class="tb-school">Colégio Estadual Mathias Jacomel — Pinhais / PR</div>
        </div>
      </div>
      <div class="topbar-right">
        <div id="relogio"></div>
        <button class="btn-logout" id="logoutBtn" type="button">
          ${ICONS.logout}
          Sair
        </button>
      </div>
    </nav>

    <div class="dash-main">
      <section class="welcome-banner">
        <div class="wb-fx-1"></div>
        <div class="wb-fx-2"></div>
        <div class="wb-fx-3"></div>
        <div class="wb-left">
          <p class="wb-greeting">Bem-vindo(a) de volta</p>
          <p class="wb-name">${safeName}</p>
          <p class="wb-email">${safeEmail}</p>
        </div>
        <div class="wb-right">
          <div class="wb-badge">
            <div class="wb-badge-icon">${isProf ? ICONS.shield : ICONS.user}</div>
            <div>
              <div class="wb-badge-role-label">Perfil</div>
              <div class="wb-badge-role-name">${roleName}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="role-panel ${isProf ? "teacher-panel" : "student-panel"}">
        <div class="role-copy">
          <div class="role-icon">${isProf ? ICONS.wrench : ICONS.monitor}</div>
          <div>
            <div class="role-eyebrow">${isProf ? "Controle do professor" : "Visualização do aluno"}</div>
            <h2 class="role-title">${isProf ? "Gerencie o laboratório em tempo real" : "Mapa atualizado automaticamente"}</h2>
            <p class="role-desc">
              ${isProf
                ? "Altere o status de cada computador. As mudanças aparecem para alunos e professores assim que o Supabase Realtime confirma a atualização."
                : "Acompanhe quais computadores estão livres, em uso, em manutenção ou com defeito sem precisar recarregar a página."}
            </p>
          </div>
        </div>
        <div class="role-actions">
          <span class="live-state warn" id="realtimeStatus"><span class="live-dot"></span>Conectando</span>
          <button class="btn-soft" id="refreshComputadores" type="button">
            ${ICONS.refresh}
            Atualizar agora
          </button>
        </div>
      </section>

      <div class="sec-hdr">
        <div class="sec-hdr-icon">${ICONS.chart}</div>
        <span class="sec-hdr-title grad-text">Visão Geral</span>
        <div class="sec-hdr-line"></div>
      </div>

      <section class="stats-grid" aria-label="Resumo dos computadores">
        <div class="stat-card c-total">
          <span class="sc-icon">${ICONS.monitor}</span>
          <div class="sc-num" id="s-total">0</div>
          <div class="sc-lbl">Total de PCs</div>
        </div>
        <div class="stat-card c-active">
          <span class="sc-icon">${ICONS.check}</span>
          <div class="sc-num" id="s-active">0</div>
          <div class="sc-lbl">Ativos</div>
        </div>
        <div class="stat-card c-livre">
          <span class="sc-icon">${ICONS.check}</span>
          <div class="sc-num" id="s-livres">0</div>
          <div class="sc-lbl">Livres</div>
        </div>
        <div class="stat-card c-uso">
          <span class="sc-icon">${ICONS.monitor}</span>
          <div class="sc-num" id="s-uso">0</div>
          <div class="sc-lbl">Em uso</div>
        </div>
        <div class="stat-card c-manut">
          <span class="sc-icon">${ICONS.wrench}</span>
          <div class="sc-num" id="s-manut">0</div>
          <div class="sc-lbl">Manutenção</div>
        </div>
        <div class="stat-card c-defeito">
          <span class="sc-icon">${ICONS.alert}</span>
          <div class="sc-num" id="s-defeito">0</div>
          <div class="sc-lbl">Defeito</div>
        </div>
      </section>

      <section class="lab-section">
        <div class="sec-hdr">
          <div class="sec-hdr-icon">${ICONS.map}</div>
          <span class="sec-hdr-title grad-text">Mapa da Sala</span>
          <div class="sec-hdr-line"></div>
        </div>

        <div class="lab-card">
          <div class="lab-card-header">
            <div>
              <span class="lab-card-title">Distribuição dos computadores</span>
              <span class="lab-card-sub" id="labSummary">Carregando dados do laboratório...</span>
            </div>
            <div class="lab-legend" aria-label="Legenda de status">
              <div class="leg-item"><div class="leg-dot livre"></div>Livre</div>
              <div class="leg-item"><div class="leg-dot uso"></div>Em uso</div>
              <div class="leg-item"><div class="leg-dot manut"></div>Manutenção</div>
              <div class="leg-item"><div class="leg-dot defeito"></div>Defeito</div>
            </div>
          </div>
          <div class="lab-grid" id="labMap" aria-live="polite">
            <div class="empty-state">Carregando computadores...</div>
          </div>
        </div>
      </section>

      <div class="sec-hdr">
        <div class="sec-hdr-icon">${ICONS.book}</div>
        <span class="sec-hdr-title grad-text">Atividades Recentes</span>
        <div class="sec-hdr-line"></div>
      </div>

      <section class="ativ-grid">
        <article class="ativ-card">
          <div class="ativ-icon-box green">${ICONS.chart}</div>
          <div class="ativ-info">
            <h3>Introdução ao Excel</h3>
            <p>Planilhas eletrônicas, fórmulas básicas e criação de gráficos. Disponível para todos os alunos.</p>
            <span class="ativ-tag">Disponível</span>
          </div>
        </article>
        <article class="ativ-card">
          <div class="ativ-icon-box blue">${ICONS.book}</div>
          <div class="ativ-info">
            <h3>Lógica de Programação</h3>
            <p>Exercícios de algoritmos, fluxogramas e comandos básicos de programação estruturada.</p>
            <span class="ativ-tag">Disponível</span>
          </div>
        </article>
      </section>
    </div>
  `;
}

function bindDashboardEvents() {
  $("logoutBtn")?.addEventListener("click", logout);
  $("refreshComputadores")?.addEventListener("click", () => carregarComputadores());
  $("labMap")?.addEventListener("change", atualizarStatusComputador);
}

function isProfessor(usuario = appState.usuario) {
  return String(usuario?.tipo || "").toLowerCase() === "professor";
}

// ═══════════════════════════════════════════════════════════════
//  COMPUTADORES
// ═══════════════════════════════════════════════════════════════
async function carregarComputadores(options = {}) {
  if (!ensureSupabase()) return false;

  const silent = Boolean(options.silent);
  const highlightNumero = options.highlightNumero;
  const labMap = $("labMap");

  if (!silent && labMap) {
    labMap.innerHTML = '<div class="empty-state">Carregando computadores...</div>';
  }

  const { data, error } = await client
    .from("computadores")
    .select("*")
    .order("numero", { ascending: true });

  if (error) {
    renderErroComputadores(error);
    return false;
  }

  appState.computadores = Array.isArray(data) ? data : [];
  renderComputadores();

  if (highlightNumero !== undefined && highlightNumero !== null) {
    window.InfoLabAnimations?.pulseElement(findPcCard(highlightNumero));
  }

  return true;
}

function renderComputadores() {
  const labMap = $("labMap");
  if (!labMap) return;

  labMap.textContent = "";

  const computadores = appState.computadores;
  if (!computadores.length) {
    labMap.innerHTML = '<div class="empty-state">Nenhum computador cadastrado na tabela <strong>computadores</strong>.</div>';
    updateStats(computadores);
    updateLabSummary();
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const pc of computadores) {
    fragment.appendChild(createPcCard(pc));
  }
  labMap.appendChild(fragment);

  updateStats(computadores);
  updateLabSummary();
}

function createPcCard(pc) {
  const statusKey = normalizeStatus(pc.status);
  const meta = STATUS[statusKey];
  const professor = isProfessor();

  const card = document.createElement("article");
  card.className = `pc-card ${meta.className}`;
  card.dataset.numero = String(pc.numero ?? "");
  card.dataset.status = statusKey;

  const head = document.createElement("div");
  head.className = "pc-card-head";

  const mark = document.createElement("div");
  mark.className = "pc-mark";

  const icon = document.createElement("span");
  icon.className = "pc-icon";
  icon.innerHTML = ICONS.monitor;

  const labelWrap = document.createElement("div");

  const id = document.createElement("div");
  id.className = "pc-id";
  id.textContent = formatPcNumber(pc.numero);

  const note = document.createElement("div");
  note.className = "pc-note";
  note.textContent = meta.hint;

  labelWrap.append(id, note);
  mark.append(icon, labelWrap);

  const chip = document.createElement("div");
  chip.className = `status-chip ${meta.className}`;
  const dot = document.createElement("span");
  dot.className = "status-dot";
  chip.append(dot, document.createTextNode(meta.label));

  head.append(mark, chip);
  card.appendChild(head);

  const body = document.createElement("div");
  body.className = "pc-card-body";

  if (professor) {
    body.appendChild(createStatusSelect(pc, statusKey));
  } else {
    const readOnly = document.createElement("p");
    readOnly.className = "pc-readonly";
    readOnly.textContent = "Status sincronizado automaticamente pelo painel do professor.";
    body.appendChild(readOnly);
  }

  card.appendChild(body);
  return card;
}

function createStatusSelect(pc, selectedStatus) {
  const select = document.createElement("select");
  select.className = "pc-status-select";
  select.dataset.previousStatus = selectedStatus;
  select.dataset.pcNumero = String(pc.numero ?? "");
  select.setAttribute("aria-label", `Alterar status do ${formatPcNumber(pc.numero)}`);

  if (pc.id !== undefined && pc.id !== null) {
    select.dataset.pcId = String(pc.id);
  }

  for (const [value, meta] of Object.entries(STATUS)) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = meta.label;
    select.appendChild(option);
  }

  select.value = selectedStatus;
  return select;
}

async function atualizarStatusComputador(event) {
  const select = event.target.closest(".pc-status-select");
  if (!select || !isProfessor()) return;

  const novoStatus = normalizeStatus(select.value);
  const statusAnterior = normalizeStatus(select.dataset.previousStatus);
  if (novoStatus === statusAnterior) return;

  select.disabled = true;

  let query = client
    .from("computadores")
    .update({ status: novoStatus });

  if (select.dataset.pcId) {
    query = query.eq("id", select.dataset.pcId);
  } else {
    query = query.eq("numero", normalizeNumero(select.dataset.pcNumero));
  }

  const { error } = await query;
  select.disabled = false;

  if (error) {
    select.value = statusAnterior;
    toast("Não foi possível atualizar o computador: " + error.message, "erro");
    return;
  }

  select.dataset.previousStatus = novoStatus;
  toast(`${formatPcNumber(select.dataset.pcNumero)} atualizado para ${STATUS[novoStatus].label}.`);
  await carregarComputadores({ silent: true, highlightNumero: select.dataset.pcNumero });
}

function updateStats(computadores) {
  const counts = {
    total: computadores.length,
    livre: 0,
    uso: 0,
    manutencao: 0,
    defeito: 0,
  };

  for (const pc of computadores) {
    const status = normalizeStatus(pc.status);
    counts[status] += 1;
  }

  const ativos = counts.livre + counts.uso;
  animateNumber("s-total", counts.total);
  animateNumber("s-active", ativos);
  animateNumber("s-livres", counts.livre);
  animateNumber("s-uso", counts.uso);
  animateNumber("s-manut", counts.manutencao);
  animateNumber("s-defeito", counts.defeito);
}

function updateLabSummary() {
  const el = $("labSummary");
  if (!el) return;

  const counts = appState.computadores.reduce((acc, pc) => {
    const status = normalizeStatus(pc.status);
    acc[status] += 1;
    return acc;
  }, { livre: 0, uso: 0, manutencao: 0, defeito: 0 });

  const ativos = counts.livre + counts.uso;
  const total = appState.computadores.length;
  const sync = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  el.textContent = `${ativos} ativos, ${counts.defeito} com defeito, ${total} no total. Última atualização: ${sync}.`;
}

function renderErroComputadores(error) {
  const labMap = $("labMap");
  if (labMap) {
    labMap.innerHTML = `<div class="error-state">Erro ao carregar computadores: ${escapeHtml(error.message)}</div>`;
  }
  setRealtimeStatus("Erro de leitura", "error");
  toast("Erro ao carregar computadores: " + error.message, "erro");
}

function normalizeStatus(status) {
  const raw = String(status || "livre")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return STATUS_ALIASES[raw] || "livre";
}

function normalizeNumero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

function formatPcNumber(value) {
  const number = Number(value);
  if (Number.isFinite(number)) return `PC${String(number).padStart(2, "0")}`;
  return `PC ${String(value || "--").trim()}`;
}

function findPcCard(numero) {
  return Array.from(document.querySelectorAll(".pc-card"))
    .find((card) => card.dataset.numero === String(numero)) || null;
}

function animateNumber(id, target) {
  const el = $(id);
  if (!el) return;

  const previousTimer = appState.counters.get(id);
  if (previousTimer) clearInterval(previousTimer);

  const start = Number(el.textContent) || 0;
  const diff = target - start;
  if (!diff) {
    el.textContent = target;
    return;
  }

  let frame = 0;
  const frames = 18;
  const timer = setInterval(() => {
    frame += 1;
    const progress = frame / frames;
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + diff * eased);

    if (frame >= frames) {
      clearInterval(timer);
      appState.counters.delete(id);
      el.textContent = target;
    }
  }, 24);

  appState.counters.set(id, timer);
}

// ═══════════════════════════════════════════════════════════════
//  REALTIME
// ═══════════════════════════════════════════════════════════════
function iniciarRealtimeComputadores() {
  if (!ensureSupabase()) return;

  if (appState.realtimeChannel) {
    client.removeChannel(appState.realtimeChannel);
  }

  appState.realtimeChannel = client
    .channel("infolab-computadores")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "computadores" },
      (payload) => {
        const changedNumero = payload.new?.numero ?? payload.old?.numero;
        setRealtimeStatus("Atualizando", "warn");
        carregarComputadores({ silent: true, highlightNumero: changedNumero }).then((ok) => {
          if (ok) setRealtimeStatus("Tempo real ativo", "ok");
        });
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setRealtimeStatus("Tempo real ativo", "ok");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setRealtimeStatus("Atualização manual", "warn");
      } else if (status === "CLOSED") {
        setRealtimeStatus("Conexão fechada", "error");
      }
    });

  clearInterval(appState.refreshTimer);
  appState.refreshTimer = setInterval(() => {
    carregarComputadores({ silent: true });
  }, 30000);
}

function setRealtimeStatus(label, type = "ok") {
  const el = $("realtimeStatus");
  if (!el) return;

  el.classList.remove("warn", "error");
  if (type === "warn") el.classList.add("warn");
  if (type === "error") el.classList.add("error");

  el.innerHTML = `<span class="live-dot"></span>${escapeHtml(label)}`;
}

// ═══════════════════════════════════════════════════════════════
//  RELÓGIO / TOAST / HELPERS
// ═══════════════════════════════════════════════════════════════
function iniciarRelogio() {
  const el = $("relogio");
  if (!el) return;

  clearInterval(appState.relogioTimer);

  const tick = () => {
    const d = new Date();
    el.innerHTML =
      d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }) +
      "<br>" +
      d.toLocaleTimeString("pt-BR");
  };

  tick();
  appState.relogioTimer = setInterval(tick, 1000);
}

function toast(msg, tipo = "ok") {
  document.getElementById("_il_toast")?.remove();

  const el = document.createElement("div");
  el.id = "_il_toast";
  el.setAttribute("role", tipo === "ok" ? "status" : "alert");

  const isOk = tipo === "ok";
  Object.assign(el.style, {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    zIndex: "9999",
    padding: "14px 22px",
    borderRadius: "14px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: "800",
    color: "white",
    maxWidth: "360px",
    lineHeight: "1.5",
    background: isOk
      ? "linear-gradient(135deg,#059669,#10b981)"
      : "linear-gradient(135deg,#b91c1c,#ef4444)",
    boxShadow: isOk
      ? "0 8px 28px rgba(16,185,129,.4)"
      : "0 8px 28px rgba(239,68,68,.4)",
    border: isOk
      ? "1px solid rgba(52,211,153,.3)"
      : "1px solid rgba(248,113,113,.3)",
    animation: "_ilToast .25s cubic-bezier(.22,1,.36,1) both",
  });

  el.textContent = msg;

  if (!$("_ilToastCSS")) {
    const s = document.createElement("style");
    s.id = "_ilToastCSS";
    s.textContent = `
      @keyframes _ilToast {
        from { opacity: 0; transform: translateY(14px) scale(.96); }
        to   { opacity: 1; transform: none; }
      }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function logout() {
  clearInterval(appState.relogioTimer);
  clearInterval(appState.refreshTimer);

  if (appState.realtimeChannel && client) {
    client.removeChannel(appState.realtimeChannel);
  }

  if (client) {
    await client.auth.signOut();
  }

  location.reload();
}

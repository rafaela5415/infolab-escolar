// ═══════════════════════════════════════════════════════════════
//  InfoLab Escolar
//  Colégio Estadual Mathias Jacomel · Pinhais / PR
//  Auth seguro (Supabase) + Painel do Professor + Tempo real
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
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 15-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/><path d="M18 8a3 3 0 0 1 0 6"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
  grad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
};

const STATUS = {
  livre: { label: "Livre", className: "livre", hint: "Disponível para uso" },
  uso: { label: "Em uso", className: "uso", hint: "Computador ocupado" },
  manutencao: { label: "Manutenção", className: "manut", hint: "Em revisão técnica" },
  defeito: { label: "Defeito", className: "defeito", hint: "Precisa de reparo" },
};

// classes CSS aplicadas a cards/chips (usadas para alternar sem apagar as demais)
const STATUS_CLASS_LIST = ["livre", "uso", "manut", "defeito"];

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
  contentChannel: null,
  realtimeOk: false,
  painelAberto: false,
  relogioTimer: null,
  refreshTimer: null,
  relativeTimer: null,
  counters: new Map(),
  filter: "todos",
  search: "",
};

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  window.InfoLabAnimations?.initAuthBackground("bg-canvas");
  bindAuthEvents();

  if (!client) {
    toast("Supabase não foi configurado. Verifique o arquivo supabase-config.js.", "erro");
    return;
  }

  // Detecta sessão automaticamente: login, cadastro confirmado por e-mail
  // (o usuário volta do link já logado) e sessão salva de visitas anteriores.
  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      appState.painelAberto = false;
      return;
    }
    // defere para fora do callback de auth (boa prática do Supabase)
    if (session?.user) setTimeout(() => handleSession(session), 0);
  });
});

async function handleSession(session) {
  if (!session?.user || appState.painelAberto) return;
  appState.painelAberto = true;
  const usuario = await carregarPerfilUsuario(session.user);
  abrirPainel(usuario);
}

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

  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => togglePassword(btn));
  });

  const tipo = $("tipo");
  if (tipo) {
    tipo.addEventListener("change", () => updateProfilePreview(tipo.value));
    updateProfilePreview(tipo.value);
  }
}

function togglePassword(btn) {
  const input = $(btn.getAttribute("data-toggle-password"));
  if (!input) return;
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  btn.classList.toggle("is-visible", show);
  btn.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  btn.setAttribute("aria-pressed", String(show));
}

function updateProfilePreview(tipo) {
  const wrap = $("profilePreview");
  if (!wrap) return;
  const isProf = String(tipo).toLowerCase() === "professor";
  const icon = wrap.querySelector(".profile-preview-icon");
  const role = wrap.querySelector("[data-preview-role]");
  if (icon) icon.innerHTML = isProf ? ICONS.shield : ICONS.grad;
  if (role) role.textContent = isProf ? "Professor" : "Aluno";
  wrap.dataset.role = isProf ? "professor" : "aluno";
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
  const tipo = $("tipo").value === "professor" ? "professor" : "aluno";

  if (!nome || !email || !senha) {
    toast("Preencha todos os campos.", "erro");
    window.InfoLabAnimations?.shakeElement(form.querySelector(".btn-grad"));
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
      emailRedirectTo: window.location.href.split("#")[0],
    },
  });

  setButtonLoading(btn, false, "Criar minha conta");

  if (error) {
    toast("Erro ao cadastrar: " + error.message, "erro");
    window.InfoLabAnimations?.shakeElement(btn);
    return;
  }

  form.reset();
  updateProfilePreview("aluno");

  // Confirmação de e-mail OFF → já vem sessão (onAuthStateChange abre o painel).
  // Confirmação de e-mail ON → sem sessão: avisa para confirmar.
  if (!data.session) {
    const papel = tipo === "professor" ? "professor" : "aluno";
    toast(`Conta de ${papel} criada! Confirme pelo link no seu e-mail para entrar.`);
    mostrarLogin();
  }
}

async function entrar(event) {
  event.preventDefault();
  if (!ensureSupabase()) return;

  const form = event.currentTarget;
  const email = $("loginEmail").value.trim().toLowerCase();
  const senha = $("loginSenha").value.trim();

  if (!email || !senha) {
    toast("Preencha e-mail e senha.", "erro");
    window.InfoLabAnimations?.shakeElement(form.querySelector(".btn-grad"));
    return;
  }

  const btn = form.querySelector(".btn-grad");
  setButtonLoading(btn, true, "Entrando...");

  const { error } = await client.auth.signInWithPassword({ email, password: senha });

  setButtonLoading(btn, false, "Entrar no sistema");

  if (error) {
    const msg = /email not confirmed/i.test(error.message)
      ? "Confirme seu e-mail pelo link que enviamos antes de entrar."
      : "E-mail ou senha incorretos.";
    toast(msg, "erro");
    window.InfoLabAnimations?.shakeElement(btn);
    return;
  }
  // sucesso → onAuthStateChange (SIGNED_IN) abre o painel
}

async function carregarPerfilUsuario(user) {
  const metaTipo = String(user.user_metadata?.tipo || "").toLowerCase();
  const fallback = {
    id: user.id,
    nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Usuário",
    email: user.email || "",
    tipo: metaTipo === "professor" ? "professor" : "aluno",
  };

  const { data, error } = await client
    .from("profiles")
    .select("id,nome,email,tipo")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("profiles select:", error.message);
    return fallback; // tabela ainda não existe — usa metadata
  }

  if (data) {
    return { ...fallback, ...data, email: data.email || fallback.email };
  }

  // ── auto-correção: cria o perfil que faltava (resolve "Perfil não encontrado") ──
  const { data: novo, error: insErr } = await client
    .from("profiles")
    .insert({ id: user.id, email: fallback.email, nome: fallback.nome, tipo: fallback.tipo })
    .select("id,nome,email,tipo")
    .maybeSingle();

  if (insErr) {
    console.warn("profiles self-heal:", insErr.message);
    return fallback;
  }
  return { ...fallback, ...novo };
}

function setButtonLoading(button, isLoading, label) {
  if (!button) return;
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
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
  renderSkeleton(12);
  carregarComputadores();
  iniciarRealtimeComputadores();
  iniciarRelativeTimer();

  carregarAtividades();
  carregarAvisos();
  if (isProfessor(usuario)) {
    carregarReservas();
    carregarOcorrencias();
  }
  iniciarRealtimeConteudo();

  window.InfoLabAnimations?.reveal(
    ".welcome-banner, .role-panel, .stat-card, .lab-card, .prof-card, .ativ-card, .aviso-card",
    40
  );
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
        <button class="btn-logout" id="logoutBtn" type="button">${ICONS.logout}Sair</button>
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
                ? "Altere o status dos computadores e publique atividades e avisos. Tudo aparece na hora para os alunos conectados."
                : "Acompanhe os computadores, as atividades e os avisos do professor — tudo sincroniza sozinho, sem recarregar a página."}
            </p>
          </div>
        </div>
        <div class="role-actions">
          <span class="live-state warn" id="realtimeStatus"><span class="live-dot"></span>Conectando</span>
          <button class="btn-soft" id="refreshComputadores" type="button">${ICONS.refresh}Atualizar agora</button>
          ${isProf ? `<button class="btn-soft" id="imprimirRelatorio" type="button">${ICONS.printer}Imprimir relatório</button>` : ""}
        </div>
      </section>

      <div class="sec-hdr">
        <div class="sec-hdr-icon">${ICONS.chart}</div>
        <span class="sec-hdr-title grad-text">Visão Geral</span>
        <div class="sec-hdr-line"></div>
      </div>

      <section class="stats-grid" aria-label="Resumo dos computadores">
        <div class="stat-card c-total"><span class="sc-icon">${ICONS.monitor}</span><div class="sc-num" id="s-total">0</div><div class="sc-lbl">Total de PCs</div></div>
        <div class="stat-card c-active"><span class="sc-icon">${ICONS.check}</span><div class="sc-num" id="s-active">0</div><div class="sc-lbl">Ativos</div></div>
        <div class="stat-card c-livre"><span class="sc-icon">${ICONS.check}</span><div class="sc-num" id="s-livres">0</div><div class="sc-lbl">Livres</div></div>
        <div class="stat-card c-uso"><span class="sc-icon">${ICONS.monitor}</span><div class="sc-num" id="s-uso">0</div><div class="sc-lbl">Em uso</div></div>
        <div class="stat-card c-manut"><span class="sc-icon">${ICONS.wrench}</span><div class="sc-num" id="s-manut">0</div><div class="sc-lbl">Manutenção</div></div>
        <div class="stat-card c-defeito"><span class="sc-icon">${ICONS.alert}</span><div class="sc-num" id="s-defeito">0</div><div class="sc-lbl">Defeito</div></div>
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

          <div class="lab-toolbar">
            <div class="lab-filters" id="labFilters" role="group" aria-label="Filtrar por status">
              <button class="filter-chip active" data-filter="todos" type="button">Todos <span class="filter-count" data-count="todos">0</span></button>
              <button class="filter-chip" data-filter="livre" type="button"><span class="leg-dot livre"></span>Livres <span class="filter-count" data-count="livre">0</span></button>
              <button class="filter-chip" data-filter="uso" type="button"><span class="leg-dot uso"></span>Em uso <span class="filter-count" data-count="uso">0</span></button>
              <button class="filter-chip" data-filter="manutencao" type="button"><span class="leg-dot manut"></span>Manutenção <span class="filter-count" data-count="manutencao">0</span></button>
              <button class="filter-chip" data-filter="defeito" type="button"><span class="leg-dot defeito"></span>Defeito <span class="filter-count" data-count="defeito">0</span></button>
            </div>
            <div class="lab-search">
              <span class="lab-search-icon">${ICONS.search}</span>
              <input type="search" id="labSearch" placeholder="Buscar PC..." aria-label="Buscar computador pelo número" autocomplete="off">
            </div>
          </div>

          <div class="lab-grid" id="labMap" aria-live="polite">
            <div class="empty-state">Carregando computadores...</div>
          </div>
          <div class="lab-no-results" id="labNoResults" hidden>
            ${ICONS.search}
            <p>Nenhum computador encontrado com esse filtro.</p>
            <button class="btn-soft" id="clearFilter" type="button">Limpar filtros</button>
          </div>
        </div>
      </section>

      ${isProf ? painelProfessorTemplate() : ""}

      <div class="sec-hdr">
        <div class="sec-hdr-icon">${ICONS.megaphone}</div>
        <span class="sec-hdr-title grad-text">Avisos</span>
        <div class="sec-hdr-line"></div>
      </div>
      <section class="aviso-grid" id="avisoGrid">
        <div class="empty-state">Carregando avisos...</div>
      </section>

      <div class="sec-hdr">
        <div class="sec-hdr-icon">${ICONS.book}</div>
        <span class="sec-hdr-title grad-text">Atividades</span>
        <div class="sec-hdr-line"></div>
      </div>
      <section class="ativ-grid" id="ativGrid">
        <div class="empty-state">Carregando atividades...</div>
      </section>
    </div>
  `;
}

function painelProfessorTemplate() {
  return `
    <div class="sec-hdr">
      <div class="sec-hdr-icon">${ICONS.shield}</div>
      <span class="sec-hdr-title grad-text">Painel do Professor</span>
      <div class="sec-hdr-line"></div>
    </div>

    <section class="prof-grid">
      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.clipboard}</span><h3>Criar atividade</h3></div>
        <p class="prof-card-sub">Publique uma atividade que aparece na hora para os alunos.</p>
        <input id="tituloAtividade" type="text" placeholder="Título da atividade" maxlength="80">
        <textarea id="descricaoAtividade" placeholder="Descrição da atividade" maxlength="400"></textarea>
        <button class="prof-btn" id="btnCriarAtividade" type="button">${ICONS.plus}Salvar atividade</button>
      </article>

      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.calendar}</span><h3>Reservar laboratório</h3></div>
        <p class="prof-card-sub">Garanta a sala para sua aula.</p>
        <input id="dataReserva" type="date">
        <input id="horarioReserva" type="text" placeholder="Horário. Ex: 08:00 às 09:40" maxlength="40">
        <button class="prof-btn" id="btnReservar" type="button">${ICONS.calendar}Reservar sala</button>
      </article>

      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.megaphone}</span><h3>Enviar aviso</h3></div>
        <p class="prof-card-sub">O aviso aparece em tempo real para os alunos.</p>
        <input id="tituloAviso" type="text" placeholder="Título do aviso" maxlength="80">
        <textarea id="mensagemAviso" placeholder="Mensagem para os alunos" maxlength="400"></textarea>
        <button class="prof-btn" id="btnEnviarAviso" type="button">${ICONS.send}Enviar aviso</button>
      </article>

      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.wrench}</span><h3>Registrar ocorrência</h3></div>
        <p class="prof-card-sub">Anote um problema ou observação de um computador.</p>
        <select id="ocorrenciaPC" class="prof-select"></select>
        <textarea id="ocorrenciaTexto" placeholder="Ex: mouse com defeito, aluno precisa de suporte..." maxlength="300"></textarea>
        <button class="prof-btn" id="btnRegistrarOcorrencia" type="button">${ICONS.plus}Salvar ocorrência</button>
      </article>
    </section>

    <section class="prof-grid prof-lists">
      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.clipboard}</span><h3>Últimas atividades</h3></div>
        <div class="mini-list" id="listaAtividadesProf"><div class="mini-empty">Carregando...</div></div>
      </article>
      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.calendar}</span><h3>Próximas reservas</h3></div>
        <div class="mini-list" id="listaReservasProf"><div class="mini-empty">Carregando...</div></div>
      </article>
      <article class="prof-card">
        <div class="prof-card-head"><span class="prof-icon">${ICONS.alert}</span><h3>Últimas ocorrências</h3></div>
        <div class="mini-list" id="listaOcorrenciasProf"><div class="mini-empty">Carregando...</div></div>
      </article>
    </section>
  `;
}

function bindDashboardEvents() {
  $("logoutBtn")?.addEventListener("click", logout);
  $("refreshComputadores")?.addEventListener("click", () => carregarComputadores({ manual: true }));
  $("labMap")?.addEventListener("change", atualizarStatusComputador);
  $("labFilters")?.addEventListener("click", onFilterClick);
  $("labSearch")?.addEventListener("input", onSearchInput);
  $("clearFilter")?.addEventListener("click", limparFiltros);

  // professor
  $("imprimirRelatorio")?.addEventListener("click", () => window.print());
  $("btnCriarAtividade")?.addEventListener("click", criarAtividade);
  $("btnReservar")?.addEventListener("click", reservarLaboratorio);
  $("btnEnviarAviso")?.addEventListener("click", enviarAviso);
  $("btnRegistrarOcorrencia")?.addEventListener("click", registrarOcorrencia);

  // excluir (delegação — funciona para itens criados depois)
  $("dashboard")?.addEventListener("click", (e) => {
    const del = e.target.closest(".item-del");
    if (!del) return;
    deletarItem(del.dataset.table, del.dataset.id, del.dataset.label || "");
  });
}

function isProfessor(usuario = appState.usuario) {
  return String(usuario?.tipo || "").toLowerCase() === "professor";
}

// ═══════════════════════════════════════════════════════════════
//  COMPUTADORES
// ═══════════════════════════════════════════════════════════════
async function carregarComputadores(options = {}) {
  if (!ensureSupabase()) return false;

  const manual = Boolean(options.manual);
  const highlightNumero = options.highlightNumero;

  if (manual) setRefreshSpinning(true);

  const { data, error } = await client
    .from("computadores")
    .select("*")
    .order("numero", { ascending: true });

  if (manual) setRefreshSpinning(false);

  if (error) {
    renderErroComputadores(error);
    return false;
  }

  appState.computadores = Array.isArray(data) ? data : [];
  renderComputadores();
  preencherSelectOcorrencia();

  if (manual) toast("Mapa do laboratório atualizado.");
  if (highlightNumero !== undefined && highlightNumero !== null) {
    window.InfoLabAnimations?.pulseElement(findPcCard(highlightNumero));
  }
  return true;
}

function renderSkeleton(count = 12) {
  const labMap = $("labMap");
  if (!labMap) return;
  labMap.textContent = "";
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton-card";
    sk.style.setProperty("--card-index", String(i));
    sk.innerHTML = '<div class="sk-line sk-head"></div><div class="sk-line sk-body"></div><div class="sk-line sk-foot"></div>';
    fragment.appendChild(sk);
  }
  labMap.appendChild(fragment);
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
    updateFilterCounts();
    return;
  }

  const fragment = document.createDocumentFragment();
  computadores.forEach((pc, index) => fragment.appendChild(createPcCard(pc, index)));
  labMap.appendChild(fragment);

  updateStats(computadores);
  updateLabSummary();
  updateFilterCounts();
  applyFilter();
}

function createPcCard(pc, index = 0) {
  const statusKey = normalizeStatus(pc.status);
  const meta = STATUS[statusKey];
  const professor = isProfessor();

  const card = document.createElement("article");
  card.className = `pc-card ${meta.className}`;
  card.dataset.numero = String(pc.numero ?? "");
  card.dataset.status = statusKey;
  card.dataset.updatedAt = pc.updated_at || "";
  card.dataset.updatedBy = pc.updated_by || "";
  card.style.setProperty("--card-index", String(index));

  const head = document.createElement("div");
  head.className = "pc-card-head";

  const icon = document.createElement("span");
  icon.className = "pc-icon";
  icon.innerHTML = ICONS.monitor;

  const labelWrap = document.createElement("div");
  labelWrap.className = "pc-id-wrap";
  const id = document.createElement("div");
  id.className = "pc-id";
  id.textContent = formatPcNumber(pc.numero);
  const note = document.createElement("div");
  note.className = "pc-note";
  note.textContent = meta.hint;
  labelWrap.append(id, note);
  head.append(icon, labelWrap);
  card.appendChild(head);

  // selo de status na própria linha (nunca corta nem sobrepõe)
  const chip = document.createElement("div");
  chip.className = `status-chip ${meta.className}`;
  const dot = document.createElement("span");
  dot.className = "status-dot";
  const chipLabel = document.createElement("span");
  chipLabel.className = "status-chip-label";
  chipLabel.textContent = meta.label;
  chip.append(dot, chipLabel);
  card.appendChild(chip);

  const body = document.createElement("div");
  body.className = "pc-card-body";
  if (professor) {
    body.appendChild(createStatusSelect(pc, statusKey));
  } else {
    const readOnly = document.createElement("p");
    readOnly.className = "pc-readonly";
    readOnly.textContent = "Sincronizado automaticamente pelo professor.";
    body.appendChild(readOnly);
  }
  card.appendChild(body);

  const foot = document.createElement("div");
  foot.className = "pc-card-foot";
  const updated = document.createElement("span");
  updated.className = "pc-updated";
  updated.innerHTML = `<span class="pc-updated-ic">${ICONS.clock}</span><span class="pc-updated-text">${escapeHtml(formatUpdated(pc.updated_at, pc.updated_by))}</span>`;
  foot.appendChild(updated);
  card.appendChild(foot);

  return card;
}

function createStatusSelect(pc, selectedStatus) {
  const select = document.createElement("select");
  select.className = "pc-status-select";
  select.dataset.previousStatus = selectedStatus;
  select.dataset.pcNumero = String(pc.numero ?? "");
  select.setAttribute("aria-label", `Alterar status do ${formatPcNumber(pc.numero)}`);
  if (pc.id !== undefined && pc.id !== null) select.dataset.pcId = String(pc.id);

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

  const numero = normalizeNumero(select.dataset.pcNumero);
  const card = findPcCard(numero);
  const idx = appState.computadores.findIndex((pc) => String(pc.numero) === String(numero));

  // atualização otimista (o professor vê na hora)
  if (idx !== -1) {
    appState.computadores[idx] = {
      ...appState.computadores[idx],
      status: novoStatus,
      updated_at: new Date().toISOString(),
      updated_by: appState.usuario?.id || null,
    };
    updateCardInPlace(appState.computadores[idx]);
    updateStats(appState.computadores);
    updateLabSummary();
    updateFilterCounts();
  }

  select.disabled = true;
  card?.classList.add("pc-saving");

  let query = client.from("computadores").update({ status: novoStatus });
  query = select.dataset.pcId ? query.eq("id", select.dataset.pcId) : query.eq("numero", numero);
  const { error } = await query;

  select.disabled = false;
  card?.classList.remove("pc-saving");

  if (error) {
    if (idx !== -1) {
      appState.computadores[idx].status = statusAnterior;
      updateCardInPlace(appState.computadores[idx]);
      updateStats(appState.computadores);
      updateFilterCounts();
    }
    select.value = statusAnterior;
    select.dataset.previousStatus = statusAnterior;
    toast("Não foi possível atualizar o computador: " + error.message, "erro");
    return;
  }

  select.dataset.previousStatus = novoStatus;
  toast(`${formatPcNumber(numero)} agora está “${STATUS[novoStatus].label}”.`);
}

function updateCardInPlace(pc) {
  const card = findPcCard(pc.numero);
  if (!card) return;

  const statusKey = normalizeStatus(pc.status);
  const meta = STATUS[statusKey];

  STATUS_CLASS_LIST.forEach((c) => card.classList.remove(c));
  card.classList.add(meta.className);
  card.dataset.status = statusKey;
  card.dataset.updatedAt = pc.updated_at || "";
  card.dataset.updatedBy = pc.updated_by || "";

  const note = card.querySelector(".pc-note");
  if (note) note.textContent = meta.hint;

  const chip = card.querySelector(".status-chip");
  if (chip) {
    STATUS_CLASS_LIST.forEach((c) => chip.classList.remove(c));
    chip.classList.add(meta.className);
    const chipLabel = chip.querySelector(".status-chip-label");
    if (chipLabel) chipLabel.textContent = meta.label;
  }

  const select = card.querySelector(".pc-status-select");
  if (select && document.activeElement !== select && !select.disabled) {
    select.value = statusKey;
    select.dataset.previousStatus = statusKey;
  }

  const updatedText = card.querySelector(".pc-updated-text");
  if (updatedText) updatedText.textContent = formatUpdated(pc.updated_at, pc.updated_by);

  applyFilterToCard(card);
  refreshNoResults();
  window.InfoLabAnimations?.pulseElement(card);
}

function updateStats(computadores) {
  const counts = { total: computadores.length, livre: 0, uso: 0, manutencao: 0, defeito: 0 };
  for (const pc of computadores) counts[normalizeStatus(pc.status)] += 1;
  const ativos = counts.livre + counts.uso;
  animateNumber("s-total", counts.total);
  animateNumber("s-active", ativos);
  animateNumber("s-livres", counts.livre);
  animateNumber("s-uso", counts.uso);
  animateNumber("s-manut", counts.manutencao);
  animateNumber("s-defeito", counts.defeito);
}

function statusCounts() {
  return appState.computadores.reduce(
    (acc, pc) => { acc[normalizeStatus(pc.status)] += 1; return acc; },
    { livre: 0, uso: 0, manutencao: 0, defeito: 0 }
  );
}

function updateLabSummary() {
  const el = $("labSummary");
  if (!el) return;
  const counts = statusCounts();
  const ativos = counts.livre + counts.uso;
  const total = appState.computadores.length;
  const sync = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  el.textContent = `${ativos} ativos, ${counts.defeito} com defeito, ${total} no total. Última sincronização: ${sync}.`;
}

function updateFilterCounts() {
  const counts = statusCounts();
  const map = {
    todos: appState.computadores.length,
    livre: counts.livre,
    uso: counts.uso,
    manutencao: counts.manutencao,
    defeito: counts.defeito,
  };
  for (const [key, value] of Object.entries(map)) {
    const el = document.querySelector(`.filter-count[data-count="${key}"]`);
    if (el) el.textContent = value;
  }
}

function renderErroComputadores(error) {
  const labMap = $("labMap");
  if (labMap) labMap.innerHTML = `<div class="error-state">Erro ao carregar computadores: ${escapeHtml(error.message)}</div>`;
  setRealtimeStatus("Erro de leitura", "error");
  toast("Erro ao carregar computadores: " + error.message, "erro");
}

// ── FILTROS / BUSCA ──────────────────────────────────────────
function onFilterClick(event) {
  const btn = event.target.closest(".filter-chip");
  if (!btn) return;
  appState.filter = btn.dataset.filter || "todos";
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === btn));
  applyFilter();
}

function onSearchInput(event) {
  appState.search = event.target.value || "";
  applyFilter();
}

function limparFiltros() {
  appState.filter = "todos";
  appState.search = "";
  const search = $("labSearch");
  if (search) search.value = "";
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.filter === "todos"));
  applyFilter();
}

function cardMatchesFilter(card) {
  const f = appState.filter;
  const statusOk = f === "todos" || card.dataset.status === f;
  const term = appState.search.trim().toLowerCase();
  if (!term) return statusOk;
  const numero = card.dataset.numero || "";
  const label = formatPcNumber(numero).toLowerCase();
  return statusOk && (label.includes(term) || numero.includes(term));
}

function applyFilterToCard(card) {
  card.classList.toggle("pc-hidden", !cardMatchesFilter(card));
}

function applyFilter() {
  const cards = document.querySelectorAll(".pc-card");
  let visible = 0;
  cards.forEach((card) => {
    const ok = cardMatchesFilter(card);
    card.classList.toggle("pc-hidden", !ok);
    if (ok) visible += 1;
  });
  const noResults = $("labNoResults");
  if (noResults) noResults.hidden = !(cards.length > 0 && visible === 0);
}

function refreshNoResults() {
  const cards = document.querySelectorAll(".pc-card");
  const visible = Array.from(cards).some((c) => !c.classList.contains("pc-hidden"));
  const noResults = $("labNoResults");
  if (noResults) noResults.hidden = !(cards.length > 0 && !visible);
}

// ═══════════════════════════════════════════════════════════════
//  PAINEL DO PROFESSOR — ATIVIDADES / RESERVAS / AVISOS / OCORRÊNCIAS
// ═══════════════════════════════════════════════════════════════
function preencherSelectOcorrencia() {
  const sel = $("ocorrenciaPC");
  if (!sel) return;
  const atual = sel.value;
  sel.innerHTML = "";
  appState.computadores.forEach((pc) => {
    const opt = document.createElement("option");
    opt.value = String(pc.numero);
    opt.textContent = formatPcNumber(pc.numero);
    sel.appendChild(opt);
  });
  if (atual) sel.value = atual;
}

async function criarAtividade() {
  if (!ensureSupabase()) return;
  const titulo = $("tituloAtividade")?.value.trim();
  const descricao = $("descricaoAtividade")?.value.trim();
  if (!titulo || !descricao) {
    toast("Preencha título e descrição da atividade.", "erro");
    return;
  }
  const btn = $("btnCriarAtividade");
  setProfBtnLoading(btn, true);
  const { error } = await client.from("atividades").insert({ titulo, descricao });
  setProfBtnLoading(btn, false);
  if (error) {
    toast("Erro ao criar atividade: " + error.message, "erro");
    return;
  }
  $("tituloAtividade").value = "";
  $("descricaoAtividade").value = "";
  toast("Atividade publicada para os alunos!");
  carregarAtividades();
}

async function reservarLaboratorio() {
  if (!ensureSupabase()) return;
  const data_reserva = $("dataReserva")?.value;
  const horario = $("horarioReserva")?.value.trim();
  if (!data_reserva || !horario) {
    toast("Preencha data e horário da reserva.", "erro");
    return;
  }
  const btn = $("btnReservar");
  setProfBtnLoading(btn, true);
  const { error } = await client.from("reservas").insert({
    professor: appState.usuario?.nome || "Professor",
    data_reserva,
    horario,
  });
  setProfBtnLoading(btn, false);
  if (error) {
    toast("Erro ao reservar: " + error.message, "erro");
    return;
  }
  $("dataReserva").value = "";
  $("horarioReserva").value = "";
  toast("Laboratório reservado com sucesso!");
  carregarReservas();
}

async function enviarAviso() {
  if (!ensureSupabase()) return;
  const titulo = $("tituloAviso")?.value.trim();
  const mensagem = $("mensagemAviso")?.value.trim();
  if (!titulo || !mensagem) {
    toast("Preencha título e mensagem do aviso.", "erro");
    return;
  }
  const btn = $("btnEnviarAviso");
  setProfBtnLoading(btn, true);
  const { error } = await client.from("avisos").insert({
    titulo,
    mensagem,
    autor: appState.usuario?.nome || "Professor",
  });
  setProfBtnLoading(btn, false);
  if (error) {
    toast("Erro ao enviar aviso: " + error.message, "erro");
    return;
  }
  $("tituloAviso").value = "";
  $("mensagemAviso").value = "";
  toast("Aviso enviado para os alunos!");
  carregarAvisos();
}

async function registrarOcorrencia() {
  if (!ensureSupabase()) return;
  const computador = Number($("ocorrenciaPC")?.value);
  const descricao = $("ocorrenciaTexto")?.value.trim();
  if (!Number.isFinite(computador)) {
    toast("Selecione um computador.", "erro");
    return;
  }
  if (!descricao) {
    toast("Escreva a observação da ocorrência.", "erro");
    return;
  }
  const btn = $("btnRegistrarOcorrencia");
  setProfBtnLoading(btn, true);
  const { error } = await client.from("ocorrencias").insert({
    computador,
    descricao,
    professor: appState.usuario?.nome || "Professor",
  });
  setProfBtnLoading(btn, false);
  if (error) {
    toast("Erro ao salvar ocorrência: " + error.message, "erro");
    return;
  }
  $("ocorrenciaTexto").value = "";
  toast(`Ocorrência registrada para ${formatPcNumber(computador)}.`);
  carregarOcorrencias();
}

async function carregarAtividades() {
  if (!client) return;
  const grid = $("ativGrid");
  const lista = $("listaAtividadesProf");
  const prof = isProfessor();
  const { data, error } = await client
    .from("atividades")
    .select("*")
    .order("id", { ascending: false })
    .limit(12);

  if (error) {
    if (grid) grid.innerHTML = emptyBox("As atividades aparecerão aqui quando o professor publicar.");
    if (lista) lista.innerHTML = '<div class="mini-empty">Crie a tabela atividades no Supabase.</div>';
    return;
  }

  const atividades = data || [];
  if (grid) {
    grid.innerHTML = atividades.length
      ? atividades.map((a, i) => `
          <article class="ativ-card" style="--card-index:${i}">
            ${prof ? delBtn("atividades", a.id, a.titulo) : ""}
            <div class="ativ-icon-box blue">${ICONS.book}</div>
            <div class="ativ-info">
              <h3>${escapeHtml(a.titulo)}</h3>
              <p>${escapeHtml(a.descricao)}</p>
              <span class="ativ-tag">Disponível</span>
            </div>
          </article>`).join("")
      : emptyBox("Nenhuma atividade publicada ainda.");
  }
  if (lista) {
    lista.innerHTML = atividades.length
      ? atividades.slice(0, 6).map((a) => `<div class="mini-item"><div class="mini-item-main"><strong>${escapeHtml(a.titulo)}</strong><span>${escapeHtml(a.descricao)}</span></div>${delBtn("atividades", a.id, a.titulo)}</div>`).join("")
      : '<div class="mini-empty">Nenhuma atividade ainda.</div>';
  }
}

async function carregarAvisos() {
  if (!client) return;
  const grid = $("avisoGrid");
  if (!grid) return;
  const { data, error } = await client
    .from("avisos")
    .select("*")
    .order("id", { ascending: false })
    .limit(8);

  if (error) {
    grid.innerHTML = emptyBox("Os avisos do professor aparecerão aqui.");
    return;
  }
  const avisos = data || [];
  const prof = isProfessor();
  grid.innerHTML = avisos.length
    ? avisos.map((a, i) => `
        <article class="aviso-card" style="--card-index:${i}">
          ${prof ? delBtn("avisos", a.id, a.titulo) : ""}
          <div class="aviso-icon">${ICONS.megaphone}</div>
          <div class="aviso-body">
            <h3>${escapeHtml(a.titulo)}</h3>
            <p>${escapeHtml(a.mensagem)}</p>
            <span class="aviso-meta">${escapeHtml(a.autor || "Professor")}${a.criado_em ? " · " + formatDateBR(a.criado_em) : ""}</span>
          </div>
        </article>`).join("")
    : emptyBox("Nenhum aviso no momento.");
}

async function carregarReservas() {
  if (!client) return;
  const lista = $("listaReservasProf");
  if (!lista) return;
  const { data, error } = await client
    .from("reservas")
    .select("*")
    .order("data_reserva", { ascending: true })
    .limit(6);
  if (error) {
    lista.innerHTML = '<div class="mini-empty">Crie a tabela reservas no Supabase.</div>';
    return;
  }
  lista.innerHTML = (data && data.length)
    ? data.map((r) => `<div class="mini-item"><div class="mini-item-main"><strong>${formatDateBR(r.data_reserva)}</strong><span>${escapeHtml(r.horario)} · ${escapeHtml(r.professor || "")}</span></div>${delBtn("reservas", r.id, "reserva")}</div>`).join("")
    : '<div class="mini-empty">Nenhuma reserva cadastrada.</div>';
}

async function carregarOcorrencias() {
  if (!client) return;
  const lista = $("listaOcorrenciasProf");
  if (!lista) return;
  const { data, error } = await client
    .from("ocorrencias")
    .select("*")
    .order("id", { ascending: false })
    .limit(6);
  if (error) {
    lista.innerHTML = '<div class="mini-empty">Crie a tabela ocorrencias no Supabase.</div>';
    return;
  }
  lista.innerHTML = (data && data.length)
    ? data.map((o) => `<div class="mini-item"><div class="mini-item-main"><strong>${formatPcNumber(o.computador)}</strong><span>${escapeHtml(o.descricao)}</span></div>${delBtn("ocorrencias", o.id, "ocorrência")}</div>`).join("")
    : '<div class="mini-empty">Nenhuma ocorrência registrada.</div>';
}

function setProfBtnLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle("is-loading", loading);
}

function emptyBox(msg) {
  return `<div class="empty-state">${escapeHtml(msg)}</div>`;
}

function delBtn(table, id, label) {
  return `<button class="item-del" type="button" data-table="${table}" data-id="${escapeHtml(id)}" data-label="${escapeHtml(label || "")}" aria-label="Excluir" title="Excluir">${ICONS.trash}</button>`;
}

async function deletarItem(table, id, label) {
  if (!ensureSupabase() || !id) return;
  if (!isProfessor()) return;
  const alvo = label ? `"${label}"` : "este item";
  if (!window.confirm(`Excluir ${alvo}? Esta ação não pode ser desfeita.`)) return;

  const { error } = await client.from(table).delete().eq("id", id);
  if (error) {
    toast("Erro ao excluir: " + error.message, "erro");
    return;
  }
  toast("Item excluído.");
  if (table === "atividades") carregarAtividades();
  else if (table === "avisos") carregarAvisos();
  else if (table === "reservas") carregarReservas();
  else if (table === "ocorrencias") carregarOcorrencias();
}

// ═══════════════════════════════════════════════════════════════
//  HELPERS DE FORMATAÇÃO
// ═══════════════════════════════════════════════════════════════
function normalizeStatus(status) {
  const raw = String(status || "livre")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
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

function formatUpdated(iso, by) {
  if (!iso) return "Status inicial";
  const mine = by && appState.usuario && String(by) === String(appState.usuario.id);
  return `Atualizado ${relativeTime(iso)}${mine ? " por você" : ""}`;
}

function relativeTime(iso) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "—";
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60000);
  if (diff < 45000) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  return `há ${Math.floor(hours / 24)} d`;
}

function formatDateBR(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return String(value || "");
  // datas puras (YYYY-MM-DD) não têm hora
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function findPcCard(numero) {
  return Array.from(document.querySelectorAll(".pc-card")).find((card) => card.dataset.numero === String(numero)) || null;
}

function findPcIndex(row) {
  if (row.id !== undefined && row.id !== null) {
    const byId = appState.computadores.findIndex((pc) => String(pc.id) === String(row.id));
    if (byId !== -1) return byId;
  }
  return appState.computadores.findIndex((pc) => String(pc.numero) === String(row.numero));
}

function animateNumber(id, target) {
  const el = $(id);
  if (!el) return;
  const previousTimer = appState.counters.get(id);
  if (previousTimer) clearInterval(previousTimer);

  const start = Number(el.textContent) || 0;
  const diff = target - start;
  if (!diff) { el.textContent = target; return; }

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

function setRefreshSpinning(spinning) {
  const btn = $("refreshComputadores");
  if (!btn) return;
  btn.classList.toggle("is-spinning", spinning);
  btn.disabled = spinning;
}

function iniciarRelativeTimer() {
  clearInterval(appState.relativeTimer);
  appState.relativeTimer = setInterval(() => {
    document.querySelectorAll(".pc-card").forEach((card) => {
      const text = card.querySelector(".pc-updated-text");
      if (text) text.textContent = formatUpdated(card.dataset.updatedAt, card.dataset.updatedBy);
    });
  }, 20000);
}

// ═══════════════════════════════════════════════════════════════
//  REALTIME
// ═══════════════════════════════════════════════════════════════
function iniciarRealtimeComputadores() {
  if (!ensureSupabase()) return;
  if (appState.realtimeChannel) client.removeChannel(appState.realtimeChannel);

  appState.realtimeChannel = client
    .channel("infolab-computadores")
    .on("postgres_changes", { event: "*", schema: "public", table: "computadores" }, (payload) => {
      setRealtimeStatus("Atualizando", "warn");
      applyRealtimeChange(payload);
      setRealtimeStatus("Tempo real ativo", "ok");
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        appState.realtimeOk = true;
        setRealtimeStatus("Tempo real ativo", "ok");
        agendarFallback();
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        appState.realtimeOk = false;
        setRealtimeStatus("Atualização automática", "warn");
        agendarFallback();
      } else if (status === "CLOSED") {
        appState.realtimeOk = false;
        setRealtimeStatus("Reconectando", "error");
        agendarFallback();
      }
    });
}

// Realtime das atividades e avisos: o aluno recebe na hora o que o professor publica.
function iniciarRealtimeConteudo() {
  if (!ensureSupabase()) return;
  if (appState.contentChannel) client.removeChannel(appState.contentChannel);

  appState.contentChannel = client
    .channel("infolab-conteudo")
    .on("postgres_changes", { event: "*", schema: "public", table: "atividades" }, () => carregarAtividades())
    .on("postgres_changes", { event: "*", schema: "public", table: "avisos" }, () => carregarAvisos())
    .subscribe();
}

function applyRealtimeChange(payload) {
  const { eventType } = payload;
  const row = payload.new;
  const old = payload.old;

  if (eventType === "UPDATE" && row) {
    const idx = findPcIndex(row);
    if (idx === -1) {
      appState.computadores.push(row);
      appState.computadores.sort((a, b) => Number(a.numero) - Number(b.numero));
      renderComputadores();
    } else {
      appState.computadores[idx] = { ...appState.computadores[idx], ...row };
      updateCardInPlace(appState.computadores[idx]);
      updateStats(appState.computadores);
      updateLabSummary();
      updateFilterCounts();
    }
  } else if (eventType === "INSERT" && row) {
    if (findPcIndex(row) === -1) {
      appState.computadores.push(row);
      appState.computadores.sort((a, b) => Number(a.numero) - Number(b.numero));
    }
    renderComputadores();
    preencherSelectOcorrencia();
  } else if (eventType === "DELETE" && old) {
    appState.computadores = appState.computadores.filter(
      (pc) => String(pc.id) !== String(old.id) && String(pc.numero) !== String(old.numero)
    );
    renderComputadores();
    preencherSelectOcorrencia();
  }
}

function agendarFallback() {
  clearInterval(appState.refreshTimer);
  appState.refreshTimer = setInterval(() => {
    if (!appState.realtimeOk) carregarComputadores({ silent: true });
  }, 15000);
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
      "<br>" + d.toLocaleTimeString("pt-BR");
  };
  tick();
  appState.relogioTimer = setInterval(tick, 1000);
}

function getToastStack() {
  let stack = $("_il_toast_stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "_il_toast_stack";
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  return stack;
}

function toast(msg, tipo = "ok") {
  const stack = getToastStack();
  const isOk = tipo === "ok";

  const el = document.createElement("div");
  el.className = `il-toast ${isOk ? "ok" : "erro"}`;
  el.setAttribute("role", isOk ? "status" : "alert");

  const icon = document.createElement("span");
  icon.className = "il-toast-icon";
  icon.innerHTML = isOk ? ICONS.check : ICONS.alert;

  const text = document.createElement("span");
  text.className = "il-toast-text";
  text.textContent = msg;

  const close = document.createElement("button");
  close.className = "il-toast-close";
  close.type = "button";
  close.setAttribute("aria-label", "Fechar aviso");
  close.innerHTML = ICONS.close;

  const dismiss = () => {
    el.classList.add("leaving");
    el.addEventListener("animationend", () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);
  };

  close.addEventListener("click", dismiss);
  el.append(icon, text, close);
  stack.appendChild(el);

  while (stack.children.length > 4) stack.firstElementChild?.remove();
  setTimeout(dismiss, 4200);
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
  clearInterval(appState.relativeTimer);
  if (appState.realtimeChannel && client) client.removeChannel(appState.realtimeChannel);
  if (appState.contentChannel && client) client.removeChannel(appState.contentChannel);
  appState.painelAberto = false;
  if (client) await client.auth.signOut();
  location.reload();
}

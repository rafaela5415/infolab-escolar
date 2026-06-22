// ═══════════════════════════════════════════════════════════════
//  InfoLab Escolar — script.js
//  Colégio Estadual Mathias Jacomel · Pinhais / PR
// ═══════════════════════════════════════════════════════════════

// ── SUPABASE ──────────────────────────────────────────────────
const supabaseUrl = "https://khueoohxlkisfzkktolg.supabase.co";
const supabaseKey = "sb_publishable_v4VuBQEeDv_CwuTv-mAEyA_l205jxW3";
const client = window.supabase.createClient(supabaseUrl, supabaseKey);

// ═══════════════════════════════════════════════════════════════
//  CANVAS DE FUNDO — partículas + ondas
// ═══════════════════════════════════════════════════════════════
(function initBgCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawn(n = 70) {
    particles = Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.6 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      a:  Math.random() * 0.4 + 0.08,
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;

    // ondas suaves no fundo
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, H * 0.55 + i * 60);
      for (let x = 0; x <= W; x += 8) {
        const y = H * 0.55 + i * 60
          + Math.sin(x * 0.008 + t + i * 1.2) * 28
          + Math.cos(x * 0.004 + t * 0.7)    * 14;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(21,87,245,${0.04 - i * 0.01})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    // conexões entre partículas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / 130) * 0.14})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // pontos
    for (const p of particles) {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.a})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  spawn();
  draw();
  window.addEventListener("resize", () => { resize(); spawn(); });
})();

// ═══════════════════════════════════════════════════════════════
//  TABS — Login / Cadastro
// ═══════════════════════════════════════════════════════════════
function mostrarLogin() {
  document.getElementById("loginArea").style.display    = "flex";
  document.getElementById("cadastroArea").style.display = "none";
  document.getElementById("tabLogin").classList.add("active");
  document.getElementById("tabCadastro").classList.remove("active");
  document.getElementById("tabPill").classList.remove("right");
}

function mostrarCadastro() {
  document.getElementById("loginArea").style.display    = "none";
  document.getElementById("cadastroArea").style.display = "flex";
  document.getElementById("tabCadastro").classList.add("active");
  document.getElementById("tabLogin").classList.remove("active");
  document.getElementById("tabPill").classList.add("right");
}

// ═══════════════════════════════════════════════════════════════
//  CADASTRO
// ═══════════════════════════════════════════════════════════════
async function cadastrar() {
  const nome  = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value.trim();
  const tipo  = document.getElementById("tipo").value;

  if (!nome || !email || !senha) {
    toast("⚠️ Preencha todos os campos!", "erro");
    return;
  }

  const btn = event.currentTarget;
  btn.disabled = true;
  btn.querySelector("span").textContent = "Aguarde...";

  const { error } = await client
    .from("usuarios")
    .insert([{ nome, email, senha, tipo }]);

  btn.disabled = false;
  btn.querySelector("span").textContent = "Criar minha conta";

  if (error) { toast("❌ Erro ao cadastrar: " + error.message, "erro"); return; }

  toast("🎉 Conta criada com sucesso!");
  mostrarLogin();
}

// ═══════════════════════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════════════════════
async function entrar() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const senha = document.getElementById("loginSenha").value.trim();

  if (!email || !senha) {
    toast("⚠️ Preencha e-mail e senha!", "erro");
    return;
  }

  const btn = event.currentTarget;
  btn.disabled = true;
  btn.querySelector("span").textContent = "Entrando...";

  const { data, error } = await client
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("senha", senha);

  btn.disabled = false;
  btn.querySelector("span").textContent = "Entrar no sistema";

  if (error)       { toast("❌ Erro: " + error.message, "erro"); return; }
  if (!data.length){ toast("❌ E-mail ou senha incorretos!", "erro"); return; }

  abrirPainel(data[0]);
}

// ═══════════════════════════════════════════════════════════════
//  CARREGAR COMPUTADORES
// ═══════════════════════════════════════════════════════════════
async function carregarComputadores() {
  const { data, error } = await client
    .from("computadores")
    .select("*")
    .order("numero", { ascending: true });

  if (error) { console.error("Erro ao carregar PCs:", error); return; }

  let livres = 0, uso = 0, manutencao = 0, defeito = 0;
  let html = "";

  data.forEach(pc => {
    const s = pc.status.trim().toLowerCase();
    let cls = "livre";

    if      (s === "livre")                                   { livres++;    cls = "livre";  }
    else if (s === "uso")                                     { uso++;       cls = "uso";    }
    else if (s === "manutencao" || s === "manutenção")        { manutencao++;cls = "manut";  }
    else if (s === "defeito")                                 { defeito++;   cls = "defeito";}

    html += `<div class="pc ${cls}">PC${String(pc.numero).padStart(2, "0")}</div>`;
  });

  countUp("s-total",   data.length);
  countUp("s-livres",  livres);
  countUp("s-uso",     uso);
  countUp("s-manut",   manutencao);
  countUp("s-defeito", defeito);

  document.getElementById("labMap").innerHTML = html;
}

// ── animação de contador ──────────────────────────────────────
function countUp(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let v = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const timer = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = v;
    if (v >= target) clearInterval(timer);
  }, 40);
}

// ═══════════════════════════════════════════════════════════════
//  RELÓGIO
// ═══════════════════════════════════════════════════════════════
let _relogioTimer;

function iniciarRelogio() {
  const el = document.getElementById("relogio");
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.innerHTML =
      d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }) +
      "<br>" +
      d.toLocaleTimeString("pt-BR");
  };
  tick();
  _relogioTimer = setInterval(tick, 1000);
}

// ═══════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════
function toast(msg, tipo = "ok") {
  document.getElementById("_il_toast")?.remove();

  const el = document.createElement("div");
  el.id = "_il_toast";

  const isOk = tipo === "ok";
  Object.assign(el.style, {
    position:   "fixed",
    bottom:     "28px",
    right:      "28px",
    zIndex:     "9999",
    padding:    "14px 22px",
    borderRadius: "14px",
    fontFamily: "'Inter', sans-serif",
    fontSize:   "14px",
    fontWeight: "700",
    color:      "white",
    maxWidth:   "340px",
    lineHeight: "1.5",
    background: isOk
      ? "linear-gradient(135deg,#059669,#10b981)"
      : "linear-gradient(135deg,#b91c1c,#ef4444)",
    boxShadow:  isOk
      ? "0 8px 28px rgba(16,185,129,.4)"
      : "0 8px 28px rgba(239,68,68,.4)",
    border: isOk
      ? "1px solid rgba(52,211,153,.3)"
      : "1px solid rgba(248,113,113,.3)",
    animation:  "_ilToast .35s cubic-bezier(.22,1,.36,1) both",
  });

  el.textContent = msg;

  if (!document.getElementById("_ilToastCSS")) {
    const s = document.createElement("style");
    s.id = "_ilToastCSS";
    s.textContent = `
      @keyframes _ilToast {
        from { opacity: 0; transform: translateY(14px) scale(.95); }
        to   { opacity: 1; transform: none; }
      }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

// ═══════════════════════════════════════════════════════════════
//  ABRIR PAINEL / DASHBOARD
// ═══════════════════════════════════════════════════════════════
function abrirPainel(usuario) {
  // oculta tela de login
  document.getElementById("app").style.display       = "none";
  document.getElementById("bg-canvas").style.display = "none";

  const dash = document.getElementById("dashboard");
  dash.style.display = "block";

  const isProf   = usuario.tipo === "professor";
  const roleIcon = isProf ? "👨‍🏫" : "🎓";
  const roleName = isProf ? "Professor" : "Aluno";

  dash.innerHTML = `
    <!-- ══ TOPBAR ══ -->
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
        <button class="btn-logout" onclick="logout()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </div>
    </nav>

    <!-- ══ MAIN ══ -->
    <div class="dash-main">

      <!-- WELCOME BANNER -->
      <div class="welcome-banner">
        <div class="wb-fx-1"></div>
        <div class="wb-fx-2"></div>
        <div class="wb-fx-3"></div>
        <div class="wb-left">
          <p class="wb-greeting">👋 Bem-vindo(a) de volta</p>
          <p class="wb-name">${usuario.nome}</p>
          <p class="wb-email">${usuario.email}</p>
        </div>
        <div class="wb-right">
          <div class="wb-badge">
            <div class="wb-badge-icon">${roleIcon}</div>
            <div>
              <div class="wb-badge-role-label">Perfil</div>
              <div class="wb-badge-role-name">${roleName}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- VISÃO GERAL -->
      <div class="sec-hdr">
        <div class="sec-hdr-icon">📊</div>
        <span class="sec-hdr-title grad-text">Visão Geral</span>
        <div class="sec-hdr-line"></div>
      </div>

      <div class="stats-grid">
        <div class="stat-card c-total">
          <span class="sc-icon">🖥️</span>
          <div class="sc-num" id="s-total">—</div>
          <div class="sc-lbl">Total de PCs</div>
        </div>
        <div class="stat-card c-livre">
          <span class="sc-icon">✅</span>
          <div class="sc-num" id="s-livres">—</div>
          <div class="sc-lbl">Livres</div>
        </div>
        <div class="stat-card c-uso">
          <span class="sc-icon">💻</span>
          <div class="sc-num" id="s-uso">—</div>
          <div class="sc-lbl">Em uso</div>
        </div>
        <div class="stat-card c-manut">
          <span class="sc-icon">🔧</span>
          <div class="sc-num" id="s-manut">—</div>
          <div class="sc-lbl">Manutenção</div>
        </div>
        <div class="stat-card c-defeito">
          <span class="sc-icon">⚠️</span>
          <div class="sc-num" id="s-defeito">—</div>
          <div class="sc-lbl">Defeito</div>
        </div>
      </div>

      <!-- MAPA DA SALA -->
      <div class="lab-section">
        <div class="sec-hdr">
          <div class="sec-hdr-icon">🗺️</div>
          <span class="sec-hdr-title grad-text">Mapa da Sala</span>
          <div class="sec-hdr-line"></div>
        </div>

        <div class="lab-card">
          <div class="lab-card-header">
            <span class="lab-card-title">Distribuição dos computadores em tempo real</span>
            <div class="lab-legend">
              <div class="leg-item"><div class="leg-dot livre"></div>Livre</div>
              <div class="leg-item"><div class="leg-dot uso"></div>Em uso</div>
              <div class="leg-item"><div class="leg-dot manut"></div>Manutenção</div>
              <div class="leg-item"><div class="leg-dot defeito"></div>Defeito</div>
            </div>
          </div>
          <div class="lab-grid" id="labMap">
            <div style="grid-column:1/-1;text-align:center;padding:24px;color:rgba(148,163,184,.5);font-size:13px;">
              Carregando computadores...
            </div>
          </div>
        </div>
      </div>

      <!-- ATIVIDADES RECENTES -->
      <div class="sec-hdr">
        <div class="sec-hdr-icon">📚</div>
        <span class="sec-hdr-title grad-text">Atividades Recentes</span>
        <div class="sec-hdr-line"></div>
      </div>

      <div class="ativ-grid">
        <div class="ativ-card">
          <div class="ativ-icon-box green">📊</div>
          <div class="ativ-info">
            <h3>Introdução ao Excel</h3>
            <p>Planilhas eletrônicas, fórmulas básicas e criação de gráficos. Disponível para todos os alunos.</p>
            <span class="ativ-tag">Disponível</span>
          </div>
        </div>
        <div class="ativ-card">
          <div class="ativ-icon-box blue">🧩</div>
          <div class="ativ-info">
            <h3>Lógica de Programação</h3>
            <p>Exercícios de algoritmos, fluxogramas e comandos básicos de programação estruturada.</p>
            <span class="ativ-tag">Disponível</span>
          </div>
        </div>
      </div>

    </div><!-- fim dash-main -->
  `;

  iniciarRelogio();
  carregarComputadores();
}

// ═══════════════════════════════════════════════════════════════
//  LOGOUT
// ═══════════════════════════════════════════════════════════════
function logout() {
  clearInterval(_relogioTimer);
  location.reload();
}

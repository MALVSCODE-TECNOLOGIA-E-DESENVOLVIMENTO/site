/* ============================================================
   Sistema de Atendimento · MALVSCODE
   ============================================================ */

/* ---------- WhatsApp ---------- */
const WHATSAPP_NUMBER = '5527998201003';
const WHATSAPP_MESSAGE =
    'Olá! Vi o projeto "Sistema de Atendimento" no site da MALVSCODE e gostaria de conversar sobre algo parecido.';
document.getElementById('whatsappFloat').href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/* ============================================================
   STORAGE
   ============================================================ */
const Storage = {
    prefix: 'malvscode.atendimento.',
    read(key, fallback) {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch { return fallback; }
    },
    write(key, value) {
        try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); }
        catch (e) { console.error('Storage write error:', e); }
    },
    clearAll() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.prefix))
            .forEach(k => localStorage.removeItem(k));
    }
};

/* IDs */
const uid = (prefix = 'id') =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

/* Datas */
const pad = n => String(n).padStart(2, '0');
const toDateInput = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayInput  = () => toDateInput(new Date());
const nowISO      = () => new Date().toISOString();

const fmtDate = iso => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    return `${pad(d)}/${pad(m)}/${y}`;
};
const fmtDateTime = iso => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* ============================================================
   SEED
   ============================================================ */
function seed() {
    if (Storage.read('seeded.v1', false)) return;

    const clientes = [
        { id: 'cl_1', nome: 'Ana Paula Ribeiro', contato: '(27) 99811-1001', email: 'ana.ribeiro@exemplo.com', documento: '000.111.222-33', observacoes: 'Prefere contato por WhatsApp.', dataCadastro: '2025-08-14', status: 'ativo' },
        { id: 'cl_2', nome: 'Bruno Cardoso',     contato: '(27) 99811-1002', email: 'bruno.cardoso@exemplo.com', documento: '111.222.333-44', observacoes: '', dataCadastro: '2025-09-02', status: 'ativo' },
        { id: 'cl_3', nome: 'Carla Menezes',     contato: '(27) 99811-1003', email: 'carla.menezes@exemplo.com', documento: '222.333.444-55', observacoes: 'Cliente recorrente.', dataCadastro: '2025-06-20', status: 'ativo' },
        { id: 'cl_4', nome: 'Diego Farias',      contato: '(27) 99811-1004', email: 'diego.farias@exemplo.com', documento: '333.444.555-66', observacoes: '', dataCadastro: '2025-10-05', status: 'inativo' },
        { id: 'cl_5', nome: 'Eduarda Lopes',     contato: '(27) 99811-1005', email: 'eduarda.lopes@exemplo.com', documento: '444.555.666-77', observacoes: 'Indicada pela Ana.', dataCadastro: '2025-11-18', status: 'ativo' }
    ];

    const profissionais = [
        { id: 'pr_1', nome: 'Mariana Alves',   contato: '(27) 99777-2001', especialidades: 'Consultoria, Suporte', disponibilidade: 'Seg a Sex · 08h–18h', status: 'ativo', observacoes: '' },
        { id: 'pr_2', nome: 'Rafael Teixeira', contato: '(27) 99777-2002', especialidades: 'Instalação, Manutenção', disponibilidade: 'Seg a Sáb · 09h–17h', status: 'ativo', observacoes: '' },
        { id: 'pr_3', nome: 'Juliana Prado',   contato: '(27) 99777-2003', especialidades: 'Atendimento geral', disponibilidade: 'Ter a Sex · 13h–19h', status: 'ativo', observacoes: '' }
    ];

    const canais = [
        { id: 'cn_1', nome: 'WhatsApp',     tipo: 'mensagem',   status: 'ativo', observacoes: '' },
        { id: 'cn_2', nome: 'Telefone',     tipo: 'ligacao',    status: 'ativo', observacoes: '' },
        { id: 'cn_3', nome: 'E-mail',       tipo: 'email',      status: 'ativo', observacoes: '' },
        { id: 'cn_4', nome: 'Site',         tipo: 'formulario', status: 'ativo', observacoes: '' },
        { id: 'cn_5', nome: 'Presencial',   tipo: 'presencial', status: 'ativo', observacoes: '' }
    ];

    const hoje = new Date();
    const isoHoje = toDateInput(hoje);
    const ontem = new Date(hoje); ontem.setDate(ontem.getDate() - 1);
    const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);
    const em3 = new Date(hoje); em3.setDate(em3.getDate() + 3);
    const em7 = new Date(hoje); em7.setDate(em7.getDate() + 7);

    const agendamentos = [
        { id: 'ag_1', clienteId: 'cl_1', servicoNome: 'Consultoria Inicial',   profissionalId: 'pr_1', data: isoHoje,            hora: '09:00', status: 'agendado',       canalId: 'cn_1', observacoes: '' },
        { id: 'ag_2', clienteId: 'cl_3', servicoNome: 'Instalação Padrão',     profissionalId: 'pr_2', data: isoHoje,            hora: '14:00', status: 'agendado',       canalId: 'cn_2', observacoes: '' },
        { id: 'ag_3', clienteId: 'cl_2', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_1', data: toDateInput(ontem), hora: '10:30', status: 'nao_compareceu', canalId: 'cn_3', observacoes: 'Cliente avisou que não poderá comparecer.' },
        { id: 'ag_4', clienteId: 'cl_5', servicoNome: 'Manutenção Preventiva', profissionalId: 'pr_2', data: toDateInput(amanha),hora: '11:00', status: 'agendado',       canalId: 'cn_1', observacoes: '' },
        { id: 'ag_5', clienteId: 'cl_1', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_3', data: toDateInput(em3),   hora: '15:30', status: 'agendado',       canalId: 'cn_4', observacoes: '' },
        { id: 'ag_6', clienteId: 'cl_3', servicoNome: 'Consultoria Inicial',   profissionalId: 'pr_1', data: toDateInput(em7),   hora: '10:00', status: 'agendado',       canalId: 'cn_1', observacoes: '' }
    ];

    const atendimentos = [
        { id: 'at_1', clienteId: 'cl_1', servicoNome: 'Consultoria Inicial',   profissionalId: 'pr_1', data: isoHoje,            hora: '09:00', canalId: 'cn_1', status: 'agendado',       observacoes: [] },
        { id: 'at_2', clienteId: 'cl_3', servicoNome: 'Instalação Padrão',     profissionalId: 'pr_2', data: isoHoje,            hora: '14:00', canalId: 'cn_2', status: 'agendado',       observacoes: [] },
        { id: 'at_3', clienteId: 'cl_2', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_1', data: toDateInput(ontem), hora: '10:30', canalId: 'cn_3', status: 'nao_compareceu', observacoes: [{ texto: 'Cliente não compareceu. Reagendar.', autor: 'Recepção', timestamp: nowISO() }] },
        { id: 'at_4', clienteId: 'cl_5', servicoNome: 'Manutenção Preventiva', profissionalId: 'pr_2', data: toDateInput(amanha),hora: '11:00', canalId: 'cn_1', status: 'agendado',       observacoes: [] },
        { id: 'at_5', clienteId: 'cl_1', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_3', data: toDateInput(em3),   hora: '15:30', canalId: 'cn_4', status: 'agendado',       observacoes: [] },
        { id: 'at_6', clienteId: 'cl_3', servicoNome: 'Consultoria Inicial',   profissionalId: 'pr_1', data: toDateInput(ontem), hora: '16:00', canalId: 'cn_3', status: 'atendido',       observacoes: [{ texto: 'Atendimento concluído com sucesso.', autor: 'Mariana Alves', timestamp: nowISO() }] },
        { id: 'at_7', clienteId: 'cl_4', servicoNome: 'Instalação Padrão',     profissionalId: 'pr_2', data: toDateInput(ontem), hora: '13:00', canalId: 'cn_5', status: 'cancelado',      observacoes: [{ texto: 'Cliente solicitou cancelamento.', autor: 'Recepção', timestamp: nowISO() }] },
        { id: 'at_8', clienteId: 'cl_5', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_3', data: isoHoje,            hora: '08:00', canalId: 'cn_1', status: 'atendido',       observacoes: [] }
    ];

    const comunicacoes = [
        { id: 'co_1', clienteId: 'cl_1', canalId: 'cn_1', assunto: 'Dúvida sobre prazos',      prioridade: 'alta',   status: 'aguardando',     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),  observacoes: [] },
        { id: 'co_2', clienteId: 'cl_4', canalId: 'cn_3', assunto: 'Solicitação de orçamento', prioridade: 'normal', status: 'aguardando',     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), observacoes: [] },
        { id: 'co_3', clienteId: 'cl_2', canalId: 'cn_2', assunto: 'Reagendamento',            prioridade: 'normal', status: 'em_atendimento', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),  observacoes: [] },
        { id: 'co_4', clienteId: 'cl_5', canalId: 'cn_4', assunto: 'Confirmação de cadastro',  prioridade: 'baixa',  status: 'resolvido',      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), observacoes: [] },
        { id: 'co_5', clienteId: 'cl_3', canalId: 'cn_1', assunto: 'Confirmação de horário',   prioridade: 'baixa',  status: 'aguardando',     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), observacoes: [] }
    ];

    Storage.write('clientes', clientes);
    Storage.write('profissionais', profissionais);
    Storage.write('canais', canais);
    Storage.write('agendamentos', agendamentos);
    Storage.write('atendimentos', atendimentos);
    Storage.write('comunicacoes', comunicacoes);
    Storage.write('config.funcionamento', {
        inicio: '08:00',
        fim: '18:00',
        intervaloMin: 30,
        diasUteis: [1, 2, 3, 4, 5, 6]
    });
    Storage.write('seeded.v1', true);
}
seed();

/* ============================================================
   Helpers de dados
   ============================================================ */
const DB = {
    getClientes:      () => Storage.read('clientes', []),
    getProfissionais: () => Storage.read('profissionais', []),
    getCanais:        () => Storage.read('canais', []),
    getAgendamentos:  () => Storage.read('agendamentos', []),
    getAtendimentos:  () => Storage.read('atendimentos', []),
    getComunicacoes:  () => Storage.read('comunicacoes', []),

    setClientes:      v => Storage.write('clientes', v),
    setProfissionais: v => Storage.write('profissionais', v),
    setCanais:        v => Storage.write('canais', v),
    setAgendamentos:  v => Storage.write('agendamentos', v),
    setAtendimentos:  v => Storage.write('atendimentos', v),
    setComunicacoes:  v => Storage.write('comunicacoes', v)
};

const byId = (arr, id) => arr.find(x => x.id === id) || null;
const clienteNome      = id => byId(DB.getClientes(), id)?.nome || '—';
const profissionalNome = id => byId(DB.getProfissionais(), id)?.nome || '—';
const canalNome        = id => byId(DB.getCanais(), id)?.nome || '—';

/* ============================================================
   Módulos
   ============================================================ */
const MODULES = [
    { id: 'atendimentos',  label: 'Controle de Atendimento', short: 'Atendimentos',  icon: 'calendarCheck' },
    { id: 'agendamentos',  label: 'Agendamentos',            short: 'Agendamentos',  icon: 'clock' },
    { id: 'canais',        label: 'Canais de Atendimento',   short: 'Canais',        icon: 'inbox' },
    { id: 'clientes',      label: 'Clientes',                short: 'Clientes',      icon: 'users' },
    { id: 'profissionais', label: 'Profissionais',           short: 'Profissionais', icon: 'userCheck' },
    { id: 'historico',     label: 'Histórico de Atendimento',short: 'Histórico',     icon: 'history' },
    { id: 'relatorios',    label: 'Relatórios',              short: 'Relatórios',    icon: 'barChart' },
    { id: 'config',        label: 'Configurações',           short: 'Configurações', icon: 'settings' }
];

const ICONS = {
    calendarCheck: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 15 11 17 15 13"/></svg>`,
    clock:         `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    inbox:         `<svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
    users:         `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    userCheck:     `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`,
    history:       `<svg viewBox="0 0 24 24"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>`,
    barChart:      `<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    settings:      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
};

const MONTH_NAMES = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

/* Mês de referência global (usado pelo calendário) */
window.currentMonth = new Date();
window.setCurrentMonth = function (d) {
    window.currentMonth = d;
    const el = document.getElementById('currentMonth');
    if (el) el.textContent = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    if (typeof renderRoute === 'function') renderRoute();
};

/* ============================================================
   Toast / Modal / Confirm
   ============================================================ */
function toast(message, type = 'info', ttl = 3000) {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = `floating-message ${type}`;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => {
        el.style.transition = 'opacity .25s, transform .25s';
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        setTimeout(() => el.remove(), 250);
    }, ttl);
}

function openModal({ title, bodyHTML, actions = [], size = '' }) {
    const root = document.getElementById('modalRoot');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    const sizeClass = size ? ` ${size}` : '';
    overlay.innerHTML = `
        <div class="modal-content${sizeClass}" role="dialog" aria-modal="true">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="close-modal" data-close aria-label="Fechar">✕</button>
            </div>
            <div class="modal-body">${bodyHTML}</div>
            ${actions.length ? `<div class="modal-actions">${actions.map((a, i) =>
                `<button class="${a.class || 'secondary'}" data-action="${i}">${a.label}</button>`).join('')}</div>` : ''}
        </div>
    `;
    root.appendChild(overlay);

    const close = () => {
        overlay.style.animation = 'fadeOut 0.15s ease forwards';
        setTimeout(() => overlay.remove(), 150);
    };

    overlay.querySelector('[data-close]').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    const escHandler = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    overlay.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.action);
            const act = actions[idx];
            if (act?.onClick) {
                const keepOpen = act.onClick(overlay);
                if (keepOpen !== false && act.close !== false) close();
            } else {
                close();
            }
        });
    });

    return { overlay, close };
}

function confirmDialog(message, { confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = true } = {}) {
    return new Promise(resolve => {
        const { overlay } = openModal({
            title: '',
            bodyHTML: `
                <div class="confirm-modal-body">
                    <h3 class="confirm-modal-title">${message}</h3>
                </div>
            `,
            actions: [
                { label: cancelLabel, class: 'secondary', onClick: () => { resolve(false); } },
                { label: confirmLabel, class: danger ? 'danger' : 'success', onClick: () => { resolve(true); } }
            ]
        });
        overlay.querySelector('.modal-content').classList.add('confirm-modal-content');
        const header = overlay.querySelector('.modal-header');
        if (header) header.style.display = 'none';
        const actions = overlay.querySelector('.modal-actions');
        if (actions) actions.classList.add('confirm-modal-actions');
    });
}

/* ============================================================
   Roteador
   ============================================================ */
function parseHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    return { module: parts[0] || 'atendimentos', rest: parts.slice(1) };
}

const RENDERERS = {
    atendimentos:  renderAtendimentos,
    agendamentos:  renderAgendamentos,
    canais:        renderCanais,
    clientes:      renderClientes,
    profissionais: renderProfissionais,
    historico:     renderHistorico,
    relatorios:    renderRelatorios,
    config:        renderConfig
};

function renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    const { module: active } = parseHash();

    const aguardando = DB.getComunicacoes().filter(c => c.status === 'aguardando').length;

    nav.innerHTML = MODULES.map(m => {
        const badge = (m.id === 'canais' && aguardando) ? `<span class="nav-badge">${aguardando}</span>` : '';
        return `
            <a class="nav-item ${m.id === active ? 'active' : ''}" href="#/${m.id}" data-module="${m.id}" title="${m.label}">
                <span class="nav-icon">${ICONS[m.icon]}</span>
                <span class="nav-label">${m.label}</span>
                ${badge}
            </a>
        `;
    }).join('');
}

function renderRoute() {
    const { module } = parseHash();
    const m = MODULES.find(x => x.id === module) || MODULES[0];
    const content = document.getElementById('content');
    if (!content) return;
    content.innerHTML = '';
    RENDERERS[m.id](content);
    renderSidebar();
}

/* ============================================================
   Sidebar mobile
   ============================================================ */
function setupSidebarMobile() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Adiciona overlay clicável e botão hamburguer dinamicamente
    const existingMenuBtn = document.getElementById('menuToggle');
    if (!existingMenuBtn) {
        const btn = document.createElement('button');
        btn.id = 'menuToggle';
        btn.className = 'btn-icon';
        btn.setAttribute('aria-label', 'Abrir menu');
        btn.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:950;width:40px;height:40px;background:rgba(255,255,255,.95);border:1px solid var(--border-color);border-radius:8px;box-shadow:var(--card-shadow);display:none;';
        btn.innerHTML = '<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        document.body.appendChild(btn);
        btn.addEventListener('click', () => sidebar.classList.add('open'));
        window.addEventListener('resize', () => {
            btn.style.display = window.innerWidth <= 900 ? 'inline-flex' : 'none';
            if (window.innerWidth > 900) sidebar.classList.remove('open');
        });
        btn.style.display = window.innerWidth <= 900 ? 'inline-flex' : 'none';
    }

    const existingOverlay = document.getElementById('sidebarOverlay');
    if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(2px);z-index:90;display:none;';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => sidebar.classList.remove('open'));
        sidebar.addEventListener('click', e => {
            if (e.target.closest('.nav-item')) {
                sidebar.classList.remove('open');
            }
        });
        // Mostra/oculta o overlay junto com a sidebar aberta
        const observer = new MutationObserver(() => {
            overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
        });
        observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
}

/* ============================================================
   Helpers de UI
   ============================================================ */
const statusLabel = {
    pendente:        'Pendente',
    agendado:        'Agendado',
    em_atendimento:  'Em atendimento',
    atendido:        'Atendido',
    cancelado:       'Cancelado',
    nao_compareceu:  'Não compareceu',
    aguardando:      'Aguardando',
    resolvido:       'Resolvido'
};

const statusBadge = s => `<span class="badge ${s}">${statusLabel[s] || s}</span>`;
const prioBadge   = p => `<span class="prio ${p}">${p === 'alta' ? 'Alta' : p === 'baixa' ? 'Baixa' : 'Normal'}</span>`;

function emptyState(title, text) {
    return `
        <div class="empty-state">
            <div class="empty-icon">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg>
            </div>
            <h3>${title}</h3>
            <p>${text}</p>
        </div>
    `;
}

function moduleHead(title, subtitle, buttonHTML = '') {
    return `
        <div class="module-head">
            <div class="module-head-left">
                <h1>${title}</h1>
                <p>${subtitle}</p>
            </div>
            ${buttonHTML}
        </div>
    `;
}

/* ============================================================
   MÓDULO · CONTROLE DE ATENDIMENTO
   ============================================================ */
let atendFilters = { status: '', clienteId: '', profissionalId: '', q: '' };

function atendimentosFiltrados() {
    const list = DB.getAtendimentos();
    const ref = window.currentMonth || new Date();
    const { status, clienteId, profissionalId, q } = atendFilters;
    const ql = q.trim().toLowerCase();

    return list.filter(a => {
        const d = new Date(a.data + 'T00:00:00');
        if (d.getMonth() !== ref.getMonth() || d.getFullYear() !== ref.getFullYear()) return false;
        if (status && a.status !== status) return false;
        if (clienteId && a.clienteId !== clienteId) return false;
        if (profissionalId && a.profissionalId !== profissionalId) return false;
        if (ql) {
            const hay = (clienteNome(a.clienteId) + ' ' + profissionalNome(a.profissionalId) + ' ' + (a.servicoNome || '')).toLowerCase();
            if (!hay.includes(ql)) return false;
        }
        return true;
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function renderAtendimentos(root) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const ref = window.currentMonth || new Date();

    const list = atendimentosFiltrados();
    const total = list.length;
    const agendados = list.filter(a => a.status === 'agendado').length;
    const atendidos = list.filter(a => a.status === 'atendido').length;
    const cancelados = list.filter(a => a.status === 'cancelado' || a.status === 'nao_compareceu').length;

    root.innerHTML = `
        ${moduleHead(
            'Controle de Atendimento',
            'Atendimentos registrados no período selecionado.',
            `<button class="btn-new-order-header" id="btnNovoAt">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo atendimento
            </button>`
        )}

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-primary">${total}</div>
                    <div class="stat-label">Total no período</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-info">${agendados}</div>
                    <div class="stat-label">Agendados</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-success">${atendidos}</div>
                    <div class="stat-label">Atendidos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-danger">${cancelados}</div>
                    <div class="stat-label">Cancelados / Não compareceu</div>
                </div>
            </div>
        </div>

        <div class="search-bar-wrapper">
            <div class="search-bar">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="atQ" placeholder="Pesquisar por cliente, profissional ou serviço" value="${atendFilters.q}">
                <div class="search-bar-filters">
                    <div class="filter-dropdown-inline">
                        <select id="atStatus">
                            <option value="">Todos os status</option>
                            ${['agendado','atendido','cancelado','nao_compareceu'].map(s =>
                                `<option value="${s}" ${atendFilters.status === s ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="atCliente">
                            <option value="">Todos os clientes</option>
                            ${clientes.map(c => `<option value="${c.id}" ${atendFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="atProf">
                            <option value="">Todos os profissionais</option>
                            ${profissionais.map(p => `<option value="${p.id}" ${atendFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="month-navigation-inline">
                        <button class="month-nav-arrow" id="prevMonthBtn" title="Mês anterior">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div class="month-display-inline"><span id="currentMonth">${MONTH_NAMES[ref.getMonth()]} ${ref.getFullYear()}</span></div>
                        <button class="month-nav-arrow" id="nextMonthBtn" title="Próximo mês">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>
                <button class="calendar-btn" id="calendarBtn" title="Selecionar mês">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </button>
            </div>
        </div>

        <div class="card table-card">
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th style="width:44px;text-align:center;">✓</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Profissional</th>
                            <th>Canal</th>
                            <th>Status</th>
                            <th style="text-align:right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="atBody"></tbody>
                </table>
            </div>
        </div>
    `;

    renderAtendRows();
    bindMonthNavigation();

    document.getElementById('atQ').addEventListener('input', e => { atendFilters.q = e.target.value; renderAtendRows(); });
    document.getElementById('atStatus').addEventListener('change', e => { atendFilters.status = e.target.value; renderAtendRows(); });
    document.getElementById('atCliente').addEventListener('change', e => { atendFilters.clienteId = e.target.value; renderAtendRows(); });
    document.getElementById('atProf').addEventListener('change', e => { atendFilters.profissionalId = e.target.value; renderAtendRows(); });
    document.getElementById('btnNovoAt').addEventListener('click', () => openAtendimentoModal());
}

function renderAtendRows() {
    const tbody = document.getElementById('atBody');
    if (!tbody) return;
    const list = atendimentosFiltrados();

    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="9">${emptyState('Nenhum atendimento encontrado', 'Ajuste os filtros acima ou crie um novo atendimento.')}</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(a => {
        const concluido = a.status === 'atendido';
        const cancelado = a.status === 'cancelado';
        const naoComp   = a.status === 'nao_compareceu';
        const rowClass  = concluido ? 'row-atendido' : cancelado ? 'row-cancelado' : naoComp ? 'row-nao-compareceu' : '';
        const disabled  = cancelado || naoComp;

        return `
            <tr class="${rowClass}">
                <td style="text-align:center;">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="check-${a.id}" class="styled-checkbox"
                               ${concluido ? 'checked' : ''} ${disabled ? 'disabled' : ''}
                               data-toggle="${a.id}">
                        <label for="check-${a.id}" class="checkbox-label-styled"></label>
                    </div>
                </td>
                <td><strong>${fmtDate(a.data)}</strong></td>
                <td>${a.hora}</td>
                <td>${clienteNome(a.clienteId)}</td>
                <td>${a.servicoNome || '—'}</td>
                <td>${profissionalNome(a.profissionalId)}</td>
                <td><span class="chip">${canalNome(a.canalId)}</span></td>
                <td>${statusBadge(a.status)}</td>
                <td>
                    <div style="display:flex;gap:4px;justify-content:flex-end;">
                        <button class="btn-icon" data-view="${a.id}" title="Ver detalhes">
                            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="btn-icon" data-edit="${a.id}" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </button>
                        <button class="btn-icon" data-cancel="${a.id}" title="Cancelar" ${disabled ? 'disabled' : ''}>
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('[data-toggle]').forEach(cb => {
        cb.addEventListener('change', e => toggleAtendimento(cb.dataset.toggle, e.target.checked));
    });
    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewAtendimento(b.dataset.view)));
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openAtendimentoModal(b.dataset.edit)));
    tbody.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => cancelAtendimento(b.dataset.cancel)));
}

function toggleAtendimento(id, checked) {
    const list = DB.getAtendimentos();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].status = checked ? 'atendido' : 'agendado';
    DB.setAtendimentos(list);
    renderAtendRows();
    toast(checked ? 'Atendimento marcado como atendido.' : 'Atendimento reaberto.', 'success');
}

async function cancelAtendimento(id) {
    const ok = await confirmDialog('Deseja cancelar este atendimento? Esta ação ficará registrada no histórico.');
    if (!ok) return;
    const list = DB.getAtendimentos();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].status = 'cancelado';
    list[idx].observacoes = [...(list[idx].observacoes || []), { texto: 'Atendimento cancelado.', autor: 'Operador', timestamp: nowISO() }];
    DB.setAtendimentos(list);
    renderAtendRows();
    toast('Atendimento cancelado.', 'error');
}

function viewAtendimento(id) {
    const a = DB.getAtendimentos().find(x => x.id === id);
    if (!a) return;
    const obs = a.observacoes || [];
    const obsHTML = obs.length
        ? `<div class="observations-list">${obs.map(o => `
            <div class="observacao-item-view">
                <span class="observacao-data">${fmtDateTime(o.timestamp)} · ${o.autor || '—'}</span>
                <div class="observacao-texto">${o.texto}</div>
            </div>
        `).join('')}</div>`
        : '<p style="color:var(--text-secondary);font-size:0.85rem;">Nenhuma observação registrada.</p>';

    const { overlay } = openModal({
        title: `Atendimento · ${clienteNome(a.clienteId)}`,
        size: 'large',
        bodyHTML: `
            <div class="tabs-container">
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="dados">Dados</button>
                    <button class="tab-btn" data-tab="obs">Observações</button>
                </div>
                <div class="tab-content active" data-pane="dados">
                    <div class="info-section">
                        <h4>Informações gerais</h4>
                        <p><strong>Data:</strong> ${fmtDate(a.data)}</p>
                        <p><strong>Hora:</strong> ${a.hora}</p>
                        <p><strong>Cliente:</strong> ${clienteNome(a.clienteId)}</p>
                        <p><strong>Serviço:</strong> ${a.servicoNome || '—'}</p>
                        <p><strong>Profissional:</strong> ${profissionalNome(a.profissionalId)}</p>
                        <p><strong>Canal:</strong> ${canalNome(a.canalId)}</p>
                        <p><strong>Status:</strong> ${statusBadge(a.status)}</p>
                    </div>
                </div>
                <div class="tab-content" data-pane="obs">
                    <div class="info-section">
                        <h4>Observações</h4>
                        ${obsHTML}
                        <div class="nova-observacao" style="margin-top:1rem;">
                            <label for="newObs" style="font-size:0.8rem;">Nova observação</label>
                            <textarea id="newObs" rows="3" placeholder="Escreva uma observação..."></textarea>
                            <button class="btn-add-obs small" id="addObsBtn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'secondary' }]
    });

    overlay.querySelectorAll('.tabs-nav .tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            overlay.querySelectorAll('.tabs-nav .tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            overlay.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
            const target = overlay.querySelector(`.tab-content[data-pane="${tab.dataset.tab}"]`);
            if (target) target.classList.add('active');
        });
    });

    overlay.querySelector('#addObsBtn').addEventListener('click', () => {
        const txt = overlay.querySelector('#newObs').value.trim();
        if (!txt) { toast('Digite uma observação.', 'warning'); return; }
        const all = DB.getAtendimentos();
        const ix = all.findIndex(x => x.id === id);
        if (ix < 0) return;
        all[ix].observacoes = [...(all[ix].observacoes || []), { texto: txt, autor: 'Operador', timestamp: nowISO() }];
        DB.setAtendimentos(all);
        toast('Observação registrada.', 'success');
        overlay.remove();
        viewAtendimento(id);
    });
}

function openAtendimentoModal(editId) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const canais = DB.getCanais();
    const a = editId ? DB.getAtendimentos().find(x => x.id === editId) : null;

    openModal({
        title: a ? 'Editar atendimento' : 'Novo atendimento',
        size: 'large',
        bodyHTML: `
            <form id="formAt" class="form-grid">
                <div class="form-group">
                    <label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(c => `<option value="${c.id}" ${a?.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Serviço <span class="req">*</span></label>
                    <input type="text" name="servicoNome" required value="${a?.servicoNome || ''}" placeholder="Ex: Consultoria Inicial">
                </div>
                <div class="form-group">
                    <label>Profissional <span class="req">*</span></label>
                    <select name="profissionalId" required>
                        <option value="">Selecione</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${a?.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Canal</label>
                    <select name="canalId">
                        <option value="">Selecione</option>
                        ${canais.map(c => `<option value="${c.id}" ${a?.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Data <span class="req">*</span></label>
                    <input type="date" name="data" required value="${a?.data || todayInput()}">
                </div>
                <div class="form-group">
                    <label>Hora <span class="req">*</span></label>
                    <input type="time" name="hora" required value="${a?.hora || '09:00'}">
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: a ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formAt');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());

                if (conflitoHorario(data.profissionalId, data.data, data.hora, a?.id)) {
                    toast('Já existe um atendimento neste horário para o profissional.', 'error');
                    return false;
                }

                const list = DB.getAtendimentos();
                if (a) {
                    const idx = list.findIndex(x => x.id === a.id);
                    list[idx] = { ...list[idx], ...data };
                } else {
                    list.push({ id: uid('at'), ...data, status: 'agendado', observacoes: [] });
                }
                DB.setAtendimentos(list);
                toast(a ? 'Atendimento atualizado.' : 'Atendimento criado.', 'success');
                renderAtendRows();
                return true;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · AGENDAMENTOS
   ============================================================ */
let agFilters = { status: '', clienteId: '', profissionalId: '', q: '' };

function agendamentosFiltrados() {
    const list = DB.getAgendamentos();
    const { status, clienteId, profissionalId, q } = agFilters;
    const ql = q.trim().toLowerCase();
    const ref = window.currentMonth || new Date();
    const hoje = todayInput();

    return list.filter(a => {
        // Só do mês de referência ou futuros
        const d = new Date(a.data + 'T00:00:00');
        const noMes = d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
        const futuro = a.data >= hoje;
        if (!noMes && !futuro) return false;

        if (status && a.status !== status) return false;
        if (clienteId && a.clienteId !== clienteId) return false;
        if (profissionalId && a.profissionalId !== profissionalId) return false;
        if (ql) {
            const hay = (clienteNome(a.clienteId) + ' ' + profissionalNome(a.profissionalId) + ' ' + (a.servicoNome || '')).toLowerCase();
            if (!hay.includes(ql)) return false;
        }
        return true;
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function renderAgendamentos(root) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const list = agendamentosFiltrados();

    const agendados = list.filter(a => a.status === 'agendado').length;
    const atendidos = list.filter(a => a.status === 'atendido').length;
    const naoComp = list.filter(a => a.status === 'nao_compareceu').length;

    root.innerHTML = `
        ${moduleHead(
            'Agendamentos',
            'Crie e gerencie agendamentos. O sistema bloqueia horários ocupados.',
            `<button class="btn-new-order-header" id="btnNovoAg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo agendamento
            </button>`
        )}

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-info">${agendados}</div>
                    <div class="stat-label">Agendados</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-success">${atendidos}</div>
                    <div class="stat-label">Atendidos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-warning">${naoComp}</div>
                    <div class="stat-label">Não compareceu</div>
                </div>
            </div>
        </div>

        <div class="search-bar-wrapper">
            <div class="search-bar">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="agQ" placeholder="Pesquisar por cliente, profissional ou serviço" value="${agFilters.q}">
                <div class="search-bar-filters">
                    <div class="filter-dropdown-inline">
                        <select id="agStatus">
                            <option value="">Todos os status</option>
                            ${['agendado','atendido','cancelado','nao_compareceu'].map(s =>
                                `<option value="${s}" ${agFilters.status === s ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="agCliente">
                            <option value="">Todos os clientes</option>
                            ${clientes.map(c => `<option value="${c.id}" ${agFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="agProf">
                            <option value="">Todos os profissionais</option>
                            ${profissionais.map(p => `<option value="${p.id}" ${agFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="card table-card">
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Profissional</th>
                            <th>Canal</th>
                            <th>Status</th>
                            <th style="text-align:right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="agBody"></tbody>
                </table>
            </div>
        </div>
    `;

    renderAgendRows();

    document.getElementById('agQ').addEventListener('input', e => { agFilters.q = e.target.value; renderAgendRows(); });
    document.getElementById('agStatus').addEventListener('change', e => { agFilters.status = e.target.value; renderAgendRows(); });
    document.getElementById('agCliente').addEventListener('change', e => { agFilters.clienteId = e.target.value; renderAgendRows(); });
    document.getElementById('agProf').addEventListener('change', e => { agFilters.profissionalId = e.target.value; renderAgendRows(); });
    document.getElementById('btnNovoAg').addEventListener('click', () => openAgendamentoModal());
}

function renderAgendRows() {
    const tbody = document.getElementById('agBody');
    if (!tbody) return;
    const list = agendamentosFiltrados();
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="8">${emptyState('Nenhum agendamento', 'Crie um novo agendamento ou ajuste os filtros.')}</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(a => `
        <tr>
            <td><strong>${fmtDate(a.data)}</strong></td>
            <td>${a.hora}</td>
            <td>${clienteNome(a.clienteId)}</td>
            <td>${a.servicoNome || '—'}</td>
            <td>${profissionalNome(a.profissionalId)}</td>
            <td><span class="chip">${canalNome(a.canalId)}</span></td>
            <td>${statusBadge(a.status)}</td>
            <td>
                <div style="display:flex;gap:4px;justify-content:flex-end;">
                    <button class="btn-icon" data-edit="${a.id}" title="Editar">
                        <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    </button>
                    <button class="btn-icon" data-nao="${a.id}" title="Marcar não compareceu">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    </button>
                    <button class="btn-icon" data-cancel="${a.id}" title="Cancelar">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openAgendamentoModal(b.dataset.edit)));
    tbody.querySelectorAll('[data-nao]').forEach(b => b.addEventListener('click', () => marcarNaoCompareceu(b.dataset.nao)));
    tbody.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => cancelarAgendamento(b.dataset.cancel)));
}

function marcarNaoCompareceu(id) {
    const list = DB.getAgendamentos();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].status = 'nao_compareceu';
    DB.setAgendamentos(list);

    const ats = DB.getAtendimentos();
    const at = ats.find(x => x.clienteId === list[idx].clienteId && x.data === list[idx].data && x.hora === list[idx].hora);
    if (at) { at.status = 'nao_compareceu'; DB.setAtendimentos(ats); }

    renderAgendRows();
    toast('Marcado como não compareceu.', 'warning');
}

async function cancelarAgendamento(id) {
    const ok = await confirmDialog('Deseja cancelar este agendamento?');
    if (!ok) return;
    const list = DB.getAgendamentos();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].status = 'cancelado';
    DB.setAgendamentos(list);
    renderAgendRows();
    toast('Agendamento cancelado.', 'error');
}

function openAgendamentoModal(editId) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const canais = DB.getCanais().filter(c => c.status === 'ativo');
    const config = Storage.read('config.funcionamento', { inicio: '08:00', fim: '18:00', intervaloMin: 30 });
    const a = editId ? DB.getAgendamentos().find(x => x.id === editId) : null;

    const slots = gerarSlots(config.inicio, config.fim, config.intervaloMin);

    const { overlay } = openModal({
        title: a ? 'Editar agendamento' : 'Novo agendamento',
        size: 'large',
        bodyHTML: `
            <form id="formAg" class="form-grid">
                <div class="form-group">
                    <label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(c => `<option value="${c.id}" ${a?.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Serviço <span class="req">*</span></label>
                    <input type="text" name="servicoNome" required value="${a?.servicoNome || ''}" placeholder="Ex: Consultoria Inicial">
                </div>
                <div class="form-group">
                    <label>Profissional <span class="req">*</span></label>
                    <select name="profissionalId" required id="agProfSel">
                        <option value="">Selecione</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${a?.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Canal</label>
                    <select name="canalId">
                        <option value="">Selecione</option>
                        ${canais.map(c => `<option value="${c.id}" ${a?.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Data <span class="req">*</span></label>
                    <input type="date" name="data" required id="agData" value="${a?.data || todayInput()}">
                </div>
                <div class="form-group full">
                    <label>Horário <span class="req">*</span></label>
                    <div class="slots-grid" id="agSlots"></div>
                    <input type="hidden" name="hora" id="agHora" value="${a?.hora || ''}">
                </div>
                <div class="form-group full">
                    <label>Observações</label>
                    <textarea name="observacoes">${a?.observacoes || ''}</textarea>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: a ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: ov => {
                const form = ov.querySelector('#formAg');
                const hora = ov.querySelector('#agHora').value;
                if (!hora) { toast('Selecione um horário.', 'warning'); return false; }
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                data.hora = hora;

                if (conflitoHorario(data.profissionalId, data.data, data.hora, a?.id)) {
                    toast('Horário indisponível para este profissional.', 'error');
                    return false;
                }

                const list = DB.getAgendamentos();
                if (a) {
                    const idx = list.findIndex(x => x.id === a.id);
                    list[idx] = { ...list[idx], ...data };
                    // Atualiza atendimento correspondente
                    const ats = DB.getAtendimentos();
                    const iat = ats.findIndex(x => x.clienteId === a.clienteId && x.data === a.data && x.hora === a.hora);
                    if (iat >= 0) {
                        ats[iat] = { ...ats[iat], ...data };
                        DB.setAtendimentos(ats);
                    }
                } else {
                    list.push({ id: uid('ag'), ...data, status: 'agendado' });
                    // Cria atendimento correspondente
                    const ats = DB.getAtendimentos();
                    ats.push({
                        id: uid('at'),
                        clienteId: data.clienteId,
                        servicoNome: data.servicoNome,
                        profissionalId: data.profissionalId,
                        canalId: data.canalId,
                        data: data.data,
                        hora: data.hora,
                        status: 'agendado',
                        observacoes: data.observacoes ? [{ texto: data.observacoes, autor: 'Sistema', timestamp: nowISO() }] : []
                    });
                    DB.setAtendimentos(ats);
                }
                DB.setAgendamentos(list);
                toast(a ? 'Agendamento atualizado.' : 'Agendamento criado. Atendimento gerado.', 'success');
                renderAgendRows();
                return true;
            }}
        ]
    });

    const slotsEl = overlay.querySelector('#agSlots');
    const horaInput = overlay.querySelector('#agHora');
    const profSel = overlay.querySelector('#agProfSel');
    const dataInput = overlay.querySelector('#agData');

    function renderSlots() {
        const profissionalId = profSel.value;
        const data = dataInput.value;
        const ags = DB.getAgendamentos().filter(x => x.status !== 'cancelado');
        const ats = DB.getAtendimentos().filter(x => x.status !== 'cancelado');

        slotsEl.innerHTML = slots.map(s => {
            const ocupado = (profissionalId && data) && (
                ags.some(x => x.profissionalId === profissionalId && x.data === data && x.hora === s) ||
                ats.some(x => x.profissionalId === profissionalId && x.data === data && x.hora === s)
            );
            const cls = ['slot'];
            if (ocupado) cls.push('busy');
            if (horaInput.value === s) cls.push('selected');
            return `<button type="button" class="${cls.join(' ')}" data-slot="${s}" ${ocupado ? 'disabled' : ''}>${s}</button>`;
        }).join('');

        slotsEl.querySelectorAll('.slot').forEach(b => {
            b.addEventListener('click', () => {
                horaInput.value = b.dataset.slot;
                renderSlots();
            });
        });
    }

    profSel.addEventListener('change', renderSlots);
    dataInput.addEventListener('change', renderSlots);
    renderSlots();
}

function gerarSlots(inicio, fim, intervalo) {
    const out = [];
    const [hi, mi] = inicio.split(':').map(Number);
    const [hf, mf] = fim.split(':').map(Number);
    let h = hi, m = mi;
    while (h < hf || (h === hf && m < mf)) {
        out.push(`${pad(h)}:${pad(m)}`);
        m += intervalo;
        while (m >= 60) { m -= 60; h++; }
    }
    return out;
}

function conflitoHorario(profissionalId, data, hora, ignorarId = null) {
    if (!profissionalId || !data || !hora) return false;
    const ags = DB.getAgendamentos().filter(a => a.status !== 'cancelado' && a.id !== ignorarId);
    const ats = DB.getAtendimentos().filter(a => a.status !== 'cancelado' && a.status !== 'atendido' && a.status !== 'nao_compareceu');
    const ocupadoAg = ags.some(a => a.profissionalId === profissionalId && a.data === data && a.hora === hora);
    const ocupadoAt = ats.some(a => a.profissionalId === profissionalId && a.data === data && a.hora === hora);
    return ocupadoAg || ocupadoAt;
}

/* ============================================================
   MÓDULO · CANAIS DE ATENDIMENTO
   ============================================================ */
let cnFilters = { canalId: '', status: '', clienteId: '' };

function renderCanais(root) {
    const canais = DB.getCanais();
    const clientes = DB.getClientes();

    // Ordenação FIFO: mais antigas primeiro
    const comunicacoes = DB.getComunicacoes()
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const filtradas = comunicacoes.filter(c => {
        if (cnFilters.canalId && c.canalId !== cnFilters.canalId) return false;
        if (cnFilters.status && c.status !== cnFilters.status) return false;
        if (cnFilters.clienteId && c.clienteId !== cnFilters.clienteId) return false;
        return true;
    });

    const aguardando = comunicacoes.filter(c => c.status === 'aguardando').length;
    const emAtendimento = comunicacoes.filter(c => c.status === 'em_atendimento').length;
    const resolvidas = comunicacoes.filter(c => c.status === 'resolvido').length;

    root.innerHTML = `
        ${moduleHead(
            'Canais de Atendimento',
            'Solicitações recebidas por canais. As mais antigas têm prioridade.',
            `<button class="btn-new-order-header" id="btnNovoCom">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nova comunicação
            </button>`
        )}

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-warning">${aguardando}</div>
                    <div class="stat-label">Aguardando</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-info">${emAtendimento}</div>
                    <div class="stat-label">Em atendimento</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div class="stat-content">
                    <div class="stat-value stat-value-success">${resolvidas}</div>
                    <div class="stat-label">Resolvidas</div>
                </div>
            </div>
        </div>

        <div class="search-bar-wrapper">
            <div class="search-bar">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Pesquisar" id="cnSearch">
                <div class="search-bar-filters">
                    <div class="filter-dropdown-inline">
                        <select id="cnCanal">
                            <option value="">Todos os canais</option>
                            ${canais.map(c => `<option value="${c.id}" ${cnFilters.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="cnStatus">
                            <option value="">Todos os status</option>
                            ${['aguardando','em_atendimento','resolvido'].map(s =>
                                `<option value="${s}" ${cnFilters.status === s ? 'selected' : ''}>${statusLabel[s] || s}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="cnCliente">
                            <option value="">Todos os clientes</option>
                            ${clientes.map(c => `<option value="${c.id}" ${cnFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="card table-card">
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Prioridade</th>
                            <th>Recebida há</th>
                            <th>Cliente</th>
                            <th>Canal</th>
                            <th>Assunto</th>
                            <th>Status</th>
                            <th style="text-align:right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="cnBody"></tbody>
                </table>
            </div>
        </div>
    `;

    renderCanaisRows(filtradas);

    document.getElementById('cnCanal').addEventListener('change', e => { cnFilters.canalId = e.target.value; renderCanaisRows(filtrarComunicacoes()); });
    document.getElementById('cnStatus').addEventListener('change', e => { cnFilters.status = e.target.value; renderCanaisRows(filtrarComunicacoes()); });
    document.getElementById('cnCliente').addEventListener('change', e => { cnFilters.clienteId = e.target.value; renderCanaisRows(filtrarComunicacoes()); });
    document.getElementById('cnSearch').addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        const all = filtrarComunicacoes();
        renderCanaisRows(all.filter(c => (c.assunto + ' ' + clienteNome(c.clienteId)).toLowerCase().includes(q)));
    });
    document.getElementById('btnNovoCom').addEventListener('click', () => openComunicacaoModal());
}

function filtrarComunicacoes() {
    return DB.getComunicacoes()
        .filter(c => {
            if (cnFilters.canalId && c.canalId !== cnFilters.canalId) return false;
            if (cnFilters.status && c.status !== cnFilters.status) return false;
            if (cnFilters.clienteId && c.clienteId !== cnFilters.clienteId) return false;
            return true;
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function renderCanaisRows(comunicacoes) {
    const tbody = document.getElementById('cnBody');
    if (!tbody) return;
    if (!comunicacoes.length) {
        tbody.innerHTML = `<tr><td colspan="7">${emptyState('Sem comunicações', 'Nenhuma comunicação registrada com estes filtros.')}</td></tr>`;
        return;
    }
    tbody.innerHTML = comunicacoes.map(c => {
        const ageMin = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 60000);
        const aging = ageMin > 60 * 24 ? `${Math.floor(ageMin / (60 * 24))}d`
                   : ageMin > 60     ? `${Math.floor(ageMin / 60)}h`
                   : `${ageMin}min`;
        return `
            <tr>
                <td>${prioBadge(c.prioridade || 'normal')}</td>
                <td>${aging}</td>
                <td><strong>${clienteNome(c.clienteId)}</strong></td>
                <td><span class="chip">${canalNome(c.canalId)}</span></td>
                <td>${c.assunto}</td>
                <td>${statusBadge(c.status)}</td>
                <td>
                    <div style="display:flex;gap:4px;justify-content:flex-end;">
                        <button class="btn-icon" data-view="${c.id}" title="Ver detalhes">
                            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="btn-icon" data-edit="${c.id}" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </button>
                        <button class="btn-icon" data-done="${c.id}" title="Marcar resolvida">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewComunicacao(b.dataset.view)));
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openComunicacaoModal(b.dataset.edit)));
    tbody.querySelectorAll('[data-done]').forEach(b => b.addEventListener('click', () => resolveComunicacao(b.dataset.done)));
}

function resolveComunicacao(id) {
    const list = DB.getComunicacoes();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].status = 'resolvido';
    DB.setComunicacoes(list);
    renderCanais(document.getElementById('content'));
    toast('Comunicação resolvida.', 'success');
}

function viewComunicacao(id) {
    const c = DB.getComunicacoes().find(x => x.id === id);
    if (!c) return;
    openModal({
        title: `Comunicação · ${c.assunto}`,
        size: 'large',
        bodyHTML: `
            <div class="info-section">
                <h4>Informações</h4>
                <p><strong>Cliente:</strong> ${clienteNome(c.clienteId)}</p>
                <p><strong>Canal:</strong> ${canalNome(c.canalId)}</p>
                <p><strong>Assunto:</strong> ${c.assunto}</p>
                <p><strong>Recebida em:</strong> ${fmtDateTime(c.createdAt)}</p>
                <p><strong>Prioridade:</strong> ${prioBadge(c.prioridade || 'normal')}</p>
                <p><strong>Status:</strong> ${statusBadge(c.status)}</p>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'secondary' }]
    });
}

function openComunicacaoModal(editId) {
    const clientes = DB.getClientes();
    const canais = DB.getCanais().filter(c => c.status === 'ativo');
    const c = editId ? DB.getComunicacoes().find(x => x.id === editId) : null;

    openModal({
        title: c ? 'Editar comunicação' : 'Nova comunicação',
        bodyHTML: `
            <form id="formCom" class="form-grid">
                <div class="form-group">
                    <label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(cl => `<option value="${cl.id}" ${c?.clienteId === cl.id ? 'selected' : ''}>${cl.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Canal <span class="req">*</span></label>
                    <select name="canalId" required>
                        <option value="">Selecione</option>
                        ${canais.map(cn => `<option value="${cn.id}" ${c?.canalId === cn.id ? 'selected' : ''}>${cn.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group full">
                    <label>Assunto <span class="req">*</span></label>
                    <input type="text" name="assunto" required value="${c?.assunto || ''}">
                </div>
                <div class="form-group">
                    <label>Prioridade</label>
                    <select name="prioridade">
                        ${['baixa','normal','alta'].map(p => `<option value="${p}" ${c?.prioridade === p ? 'selected' : ''}>${p[0].toUpperCase() + p.slice(1)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        ${['aguardando','em_atendimento','resolvido'].map(s => `<option value="${s}" ${c?.status === s ? 'selected' : ''}>${statusLabel[s] || s}</option>`).join('')}
                    </select>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: ov => {
                const form = ov.querySelector('#formCom');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getComunicacoes();
                if (c) {
                    const idx = list.findIndex(x => x.id === c.id);
                    list[idx] = { ...list[idx], ...data };
                } else {
                    list.push({ id: uid('co'), ...data, createdAt: nowISO(), observacoes: [] });
                }
                DB.setComunicacoes(list);
                toast(c ? 'Comunicação atualizada.' : 'Comunicação registrada.', 'success');
                renderCanais(document.getElementById('content'));
                return true;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · CLIENTES
   ============================================================ */
let cliQ = '';

function renderClientes(root) {
    root.innerHTML = `
        ${moduleHead(
            'Clientes',
            'Cadastro, contato e histórico de relacionamento.',
            `<button class="btn-new-order-header" id="btnNovoCli">Novo cliente</button>`
        )}

        <div class="search-bar-wrapper">
            <div class="search-bar">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="cliQ" placeholder="Buscar por nome, contato ou e-mail" value="${cliQ}">
            </div>
        </div>

        <div class="card table-card">
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th><th>Contato</th><th>E-mail</th><th>Último atendimento</th><th>Cadastro</th><th>Status</th>
                            <th style="text-align:right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="cliBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const render = () => {
        const tbody = document.getElementById('cliBody');
        const ql = cliQ.trim().toLowerCase();
        const list = DB.getClientes().filter(c => {
            if (!ql) return true;
            return c.nome.toLowerCase().includes(ql)
                || (c.contato || '').toLowerCase().includes(ql)
                || (c.email || '').toLowerCase().includes(ql);
        });

        const atendimentos = DB.getAtendimentos();

        if (!list.length) { tbody.innerHTML = `<tr><td colspan="7">${emptyState('Nenhum cliente', 'Cadastre o primeiro cliente.')}</td></tr>`; return; }

        tbody.innerHTML = list.map(c => {
            const ats = atendimentos.filter(a => a.clienteId === c.id && a.status === 'atendido');
            const ultimo = ats.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora))[0];
            return `
                <tr>
                    <td><strong>${c.nome}</strong></td>
                    <td>${c.contato || '—'}</td>
                    <td>${c.email || '—'}</td>
                    <td>${ultimo ? fmtDate(ultimo.data) : '—'}</td>
                    <td>${fmtDate(c.dataCadastro)}</td>
                    <td>${c.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</td>
                    <td>
                        <div style="display:flex;gap:4px;justify-content:flex-end;">
                            <button class="btn-icon" data-hist="${c.id}" title="Histórico">
                                <svg viewBox="0 0 24 24"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
                            </button>
                            <button class="btn-icon" data-edit="${c.id}" title="Editar">
                                <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openClienteModal(b.dataset.edit)));
        tbody.querySelectorAll('[data-hist]').forEach(b => b.addEventListener('click', () => viewHistoricoCliente(b.dataset.hist)));
    };

    render();
    document.getElementById('cliQ').addEventListener('input', e => { cliQ = e.target.value; render(); });
    document.getElementById('btnNovoCli').addEventListener('click', () => openClienteModal());
}

function openClienteModal(editId) {
    const c = editId ? DB.getClientes().find(x => x.id === editId) : null;
    openModal({
        title: c ? 'Editar cliente' : 'Novo cliente',
        bodyHTML: `
            <form id="formCli" class="form-grid">
                <div class="form-group full"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${c?.nome || ''}"></div>
                <div class="form-group"><label>Contato</label><input type="text" name="contato" value="${c?.contato || ''}"></div>
                <div class="form-group"><label>E-mail</label><input type="email" name="email" value="${c?.email || ''}"></div>
                <div class="form-group"><label>Documento</label><input type="text" name="documento" value="${c?.documento || ''}"></div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="ativo" ${c?.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${c?.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </div>
                <div class="form-group full"><label>Observações</label><textarea name="observacoes">${c?.observacoes || ''}</textarea></div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: ov => {
                const form = ov.querySelector('#formCli');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getClientes();
                if (c) { const i = list.findIndex(x => x.id === c.id); list[i] = { ...list[i], ...data }; }
                else { list.push({ id: uid('cl'), ...data, dataCadastro: todayInput() }); }
                DB.setClientes(list);
                toast(c ? 'Cliente atualizado.' : 'Cliente criado.', 'success');
                renderClientes(document.getElementById('content'));
                return true;
            }}
        ]
    });
}

function viewHistoricoCliente(id) {
    const c = DB.getClientes().find(x => x.id === id);
    if (!c) return;
    const ats = DB.getAtendimentos()
        .filter(a => a.clienteId === id)
        .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
    const coms = DB.getComunicacoes()
        .filter(x => x.clienteId === id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const atsHTML = ats.length ? ats.map(a => `
        <div class="timeline-item">
            <span class="timeline-time">${fmtDate(a.data)} · ${a.hora}</span>
            <div class="timeline-title">${a.servicoNome || '—'}</div>
            <div class="timeline-desc">${profissionalNome(a.profissionalId)} · ${statusLabel[a.status] || a.status}</div>
        </div>
    `).join('') : '<p style="color:var(--text-secondary);font-size:0.85rem;">Sem atendimentos registrados.</p>';

    const comsHTML = coms.length ? coms.map(c => `
        <div class="timeline-item">
            <span class="timeline-time">${fmtDateTime(c.createdAt)}</span>
            <div class="timeline-title">${c.assunto}</div>
            <div class="timeline-desc">${canalNome(c.canalId)} · ${statusLabel[c.status] || c.status}</div>
        </div>
    `).join('') : '<p style="color:var(--text-secondary);font-size:0.85rem;">Sem comunicações.</p>';

    const { overlay } = openModal({
        title: `Histórico · ${c.nome}`,
        size: 'large',
        bodyHTML: `
            <div class="tabs-container">
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="at">Atendimentos</button>
                    <button class="tab-btn" data-tab="co">Comunicações</button>
                    <button class="tab-btn" data-tab="info">Dados</button>
                </div>
                <div class="tab-content active" data-pane="at"><div class="timeline">${atsHTML}</div></div>
                <div class="tab-content" data-pane="co"><div class="timeline">${comsHTML}</div></div>
                <div class="tab-content" data-pane="info">
                    <div class="info-section">
                        <h4>Dados do cliente</h4>
                        <p><strong>Nome:</strong> ${c.nome}</p>
                        <p><strong>Contato:</strong> ${c.contato || '—'}</p>
                        <p><strong>E-mail:</strong> ${c.email || '—'}</p>
                        <p><strong>Documento:</strong> ${c.documento || '—'}</p>
                        <p><strong>Cadastro:</strong> ${fmtDate(c.dataCadastro)}</p>
                        <p><strong>Observações:</strong> ${c.observacoes || '—'}</p>
                    </div>
                </div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'secondary' }]
    });

    overlay.querySelectorAll('.tabs-nav .tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            overlay.querySelectorAll('.tabs-nav .tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            overlay.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
            overlay.querySelector(`.tab-content[data-pane="${tab.dataset.tab}"]`).classList.add('active');
        });
    });
}

/* ============================================================
   MÓDULO · PROFISSIONAIS
   ============================================================ */
function renderProfissionais(root) {
    const list = DB.getProfissionais();
    root.innerHTML = `
        ${moduleHead(
            'Profissionais',
            'Responsáveis pelos atendimentos.',
            `<button class="btn-new-order-header" id="btnNovoProf">Novo profissional</button>`
        )}
        <div class="card table-card">
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th><th>Contato</th><th>Especialidades</th><th>Disponibilidade</th><th>Status</th>
                            <th style="text-align:right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="profBody"></tbody>
                </table>
            </div>
        </div>
    `;
    const tbody = document.getElementById('profBody');
    if (!list.length) tbody.innerHTML = `<tr><td colspan="6">${emptyState('Sem profissionais', 'Cadastre o primeiro profissional.')}</td></tr>`;
    else {
        tbody.innerHTML = list.map(p => `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td>${p.contato || '—'}</td>
                <td>${p.especialidades || '—'}</td>
                <td>${p.disponibilidade || '—'}</td>
                <td>${p.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</td>
                <td>
                    <div style="display:flex;gap:4px;justify-content:flex-end;">
                        <button class="btn-icon" data-edit="${p.id}" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openProfissionalModal(b.dataset.edit)));
    }
    document.getElementById('btnNovoProf').addEventListener('click', () => openProfissionalModal());
}

function openProfissionalModal(editId) {
    const p = editId ? DB.getProfissionais().find(x => x.id === editId) : null;
    openModal({
        title: p ? 'Editar profissional' : 'Novo profissional',
        bodyHTML: `
            <form id="formProf" class="form-grid">
                <div class="form-group full"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${p?.nome || ''}"></div>
                <div class="form-group"><label>Contato</label><input type="text" name="contato" value="${p?.contato || ''}"></div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="ativo" ${p?.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${p?.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </div>
                <div class="form-group full"><label>Especialidades</label><input type="text" name="especialidades" value="${p?.especialidades || ''}"></div>
                <div class="form-group full"><label>Disponibilidade</label><input type="text" name="disponibilidade" value="${p?.disponibilidade || ''}"></div>
                <div class="form-group full"><label>Observações</label><textarea name="observacoes">${p?.observacoes || ''}</textarea></div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: p ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: ov => {
                const form = ov.querySelector('#formProf');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getProfissionais();
                if (p) { const i = list.findIndex(x => x.id === p.id); list[i] = { ...list[i], ...data }; }
                else { list.push({ id: uid('pr'), ...data }); }
                DB.setProfissionais(list);
                toast(p ? 'Profissional atualizado.' : 'Profissional criado.', 'success');
                renderProfissionais(document.getElementById('content'));
                return true;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · HISTÓRICO DE ATENDIMENTO
   ============================================================ */
function renderHistorico(root) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();

    root.innerHTML = `
        ${moduleHead(
            'Histórico de Atendimento',
            'Atendimentos já encerrados: concluídos, cancelados ou não comparecidos.'
        )}

        <div class="search-bar-wrapper">
            <div class="search-bar">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Pesquisar" id="hiSearch">
                <div class="search-bar-filters">
                    <div class="filter-dropdown-inline">
                        <select id="hiCli"><option value="">Todos os clientes</option>${clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}</select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="filter-dropdown-inline">
                        <select id="hiProf"><option value="">Todos os profissionais</option>${profissionais.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}</select>
                        <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="card table-card">
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr><th>Data</th><th>Hora</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Canal</th><th>Status</th></tr>
                    </thead>
                    <tbody id="hiBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const render = () => {
        const cId = document.getElementById('hiCli').value;
        const pId = document.getElementById('hiProf').value;
        const q = (document.getElementById('hiSearch').value || '').toLowerCase();
        const list = DB.getAtendimentos()
            .filter(a => a.status === 'atendido' || a.status === 'cancelado' || a.status === 'nao_compareceu')
            .filter(a => (!cId || a.clienteId === cId))
            .filter(a => (!pId || a.profissionalId === pId))
            .filter(a => !q || (clienteNome(a.clienteId) + ' ' + (a.servicoNome || '')).toLowerCase().includes(q))
            .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));

        const tbody = document.getElementById('hiBody');
        if (!list.length) tbody.innerHTML = `<tr><td colspan="7">${emptyState('Sem histórico', 'Nenhum atendimento encerrado com estes filtros.')}</td></tr>`;
        else tbody.innerHTML = list.map(a => `
            <tr>
                <td><strong>${fmtDate(a.data)}</strong></td>
                <td>${a.hora}</td>
                <td>${clienteNome(a.clienteId)}</td>
                <td>${a.servicoNome || '—'}</td>
                <td>${profissionalNome(a.profissionalId)}</td>
                <td><span class="chip">${canalNome(a.canalId)}</span></td>
                <td>${statusBadge(a.status)}</td>
            </tr>
        `).join('');
    };
    render();
    document.getElementById('hiCli').addEventListener('change', render);
    document.getElementById('hiProf').addEventListener('change', render);
    document.getElementById('hiSearch').addEventListener('input', render);
}

/* ============================================================
   MÓDULO · RELATÓRIOS
   ============================================================ */
function renderRelatorios(root) {
    const atendimentos = DB.getAtendimentos();
    const agendamentos = DB.getAgendamentos();

    const total = atendimentos.length;
    const atendidos = atendimentos.filter(a => a.status === 'atendido').length;
    const cancelados = atendimentos.filter(a => a.status === 'cancelado').length;
    const naoComp = atendimentos.filter(a => a.status === 'nao_compareceu').length;

    const porProf = {};
    const porCanal = {};
    const porServico = {};

    atendimentos.forEach(a => {
        porProf[a.profissionalId] = (porProf[a.profissionalId] || 0) + 1;
        porCanal[a.canalId] = (porCanal[a.canalId] || 0) + 1;
        const s = a.servicoNome || 'Outros';
        porServico[s] = (porServico[s] || 0) + 1;
    });

    const maxProf = Math.max(1, ...Object.values(porProf));
    const maxCanal = Math.max(1, ...Object.values(porCanal));
    const maxServico = Math.max(1, ...Object.values(porServico));

    const bar = (label, val, max) => `
        <div class="report-bar">
            <span class="label">${label}</span>
            <div class="track"><div class="fill" style="width:${(val / max) * 100}%"></div></div>
            <span class="value">${val}</span>
        </div>
    `;

    root.innerHTML = `
        ${moduleHead('Relatórios', 'Indicadores consolidados da operação.')}

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
                <div class="stat-content"><div class="stat-value stat-value-primary">${total}</div><div class="stat-label">Atendimentos</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div class="stat-content"><div class="stat-value stat-value-success">${atendidos}</div><div class="stat-label">Concluídos</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
                <div class="stat-content"><div class="stat-value stat-value-danger">${cancelados}</div><div class="stat-label">Cancelados</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                <div class="stat-content"><div class="stat-value stat-value-warning">${naoComp}</div><div class="stat-label">Não compareceu</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div class="stat-content"><div class="stat-value stat-value-info">${agendamentos.length}</div><div class="stat-label">Agendamentos</div></div>
            </div>
        </div>

        <div class="card" style="padding:1.5rem;">
            <div class="info-section"><h4>Atendimentos por profissional</h4>
                <div class="report-bars">${Object.entries(porProf).map(([id, v]) => bar(profissionalNome(id), v, maxProf)).join('') || '<span style="color:var(--text-secondary);font-size:0.85rem;">Sem dados.</span>'}</div>
            </div>
        </div>

        <div class="card" style="padding:1.5rem;">
            <div class="info-section"><h4>Atendimentos por canal</h4>
                <div class="report-bars">${Object.entries(porCanal).map(([id, v]) => bar(canalNome(id), v, maxCanal)).join('') || '<span style="color:var(--text-secondary);font-size:0.85rem;">Sem dados.</span>'}</div>
            </div>
        </div>

        <div class="card" style="padding:1.5rem;">
            <div class="info-section"><h4>Serviços mais realizados</h4>
                <div class="report-bars">
                    ${Object.entries(porServico).sort((a,b) => b[1] - a[1]).map(([s, v]) => bar(s, v, maxServico)).join('') || '<span style="color:var(--text-secondary);font-size:0.85rem;">Sem dados.</span>'}
                </div>
            </div>
        </div>
    `;
}

/* ============================================================
   MÓDULO · CONFIGURAÇÕES
   ============================================================ */
function renderConfig(root) {
    const config = Storage.read('config.funcionamento', { inicio: '08:00', fim: '18:00', intervaloMin: 30, diasUteis: [1,2,3,4,5,6] });
    const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

    root.innerHTML = `
        ${moduleHead('Configurações', 'Horário de funcionamento e preferências gerais.')}

        <div class="card" style="padding:1.75rem;">
            <div class="info-section"><h4>Horário de funcionamento</h4>
                <form id="formConfig" class="form-grid">
                    <div class="form-group">
                        <label>Início</label>
                        <input type="time" name="inicio" value="${config.inicio}">
                    </div>
                    <div class="form-group">
                        <label>Fim</label>
                        <input type="time" name="fim" value="${config.fim}">
                    </div>
                    <div class="form-group">
                        <label>Intervalo entre horários (min)</label>
                        <input type="number" name="intervaloMin" min="5" step="5" value="${config.intervaloMin}">
                    </div>
                    <div class="form-group full">
                        <label>Dias úteis</label>
                        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.35rem;">
                            ${dias.map((d, i) => `
                                <label style="display:inline-flex;align-items:center;gap:0.35rem;background:var(--input-bg);border:1px solid var(--border-color);padding:6px 10px;border-radius:6px;cursor:pointer;font-size:0.82rem;font-weight:400;">
                                    <input type="checkbox" data-dia="${i}" ${config.diasUteis.includes(i) ? 'checked' : ''}> ${d}
                                </label>`).join('')}
                        </div>
                    </div>
                </form>
                <div style="margin-top:1.25rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
                    <button class="success" id="saveConfig">Salvar alterações</button>
                </div>
            </div>
        </div>

        <div class="card" style="padding:1.75rem;">
            <div class="info-section"><h4>Dados da demonstração</h4>
                <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:1rem;">Restaurar apaga todas as alterações feitas nesta demonstração e recarrega os dados iniciais.</p>
                <button class="danger" id="resetDemo">Restaurar dados de demonstração</button>
            </div>
        </div>
    `;

    document.getElementById('saveConfig').addEventListener('click', () => {
        const ini = document.querySelector('[name="inicio"]').value;
        const fim = document.querySelector('[name="fim"]').value;
        const int = Number(document.querySelector('[name="intervaloMin"]').value) || 30;
        const diasSel = Array.from(document.querySelectorAll('[data-dia]:checked')).map(x => Number(x.dataset.dia));
        Storage.write('config.funcionamento', { inicio: ini, fim, intervaloMin: int, diasUteis: diasSel });
        toast('Configurações salvas.', 'success');
    });

    document.getElementById('resetDemo').addEventListener('click', async () => {
        const ok = await confirmDialog('Restaurar os dados originais da demonstração? Suas alterações serão perdidas.', { confirmLabel: 'Restaurar' });
        if (!ok) return;
        Storage.clearAll();
        location.reload();
    });
}

/* ============================================================
   Calendário
   ============================================================ */
function setupCalendarModal() {
    if (document.getElementById('calendarModal')) return;
    const html = `
        <div class="calendar-modal" id="calendarModal">
            <div class="calendar-content">
                <div class="calendar-header">
                    <button class="calendar-year-nav" onclick="changeCalendarYear(-1)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <h3 id="calendarYear">${new Date().getFullYear()}</h3>
                    <button class="calendar-year-nav" onclick="changeCalendarYear(1)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>
                <div class="calendar-months" id="calendarMonths"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function bindMonthNavigation() {
    const prev = document.getElementById('prevMonthBtn');
    const next = document.getElementById('nextMonthBtn');
    const cal  = document.getElementById('calendarBtn');

    if (prev) prev.addEventListener('click', () => {
        const d = new Date(window.currentMonth);
        d.setMonth(d.getMonth() - 1, 1);
        window.setCurrentMonth(d);
    });
    if (next) next.addEventListener('click', () => {
        const d = new Date(window.currentMonth);
        d.setMonth(d.getMonth() + 1, 1);
        window.setCurrentMonth(d);
    });
    if (cal) cal.addEventListener('click', () => {
        if (typeof window.toggleCalendar === 'function') window.toggleCalendar();
    });
}

let calendarYear = new Date().getFullYear();
window.changeCalendarYear = function (direction) {
    calendarYear += direction;
    renderCalendarMonths();
};
window.selectMonth = function (monthIndex) {
    const ref = window.currentMonth || new Date();
    window.setCurrentMonth(new Date(calendarYear, monthIndex, 1));
    document.getElementById('calendarModal')?.classList.remove('show');
};

function renderCalendarMonths() {
    const yearEl = document.getElementById('calendarYear');
    const monthsEl = document.getElementById('calendarMonths');
    if (!yearEl || !monthsEl) return;
    yearEl.textContent = calendarYear;
    const ref = window.currentMonth || new Date();

    monthsEl.innerHTML = MONTH_NAMES.map((mes, i) => {
        const isCurrent = i === ref.getMonth() && calendarYear === ref.getFullYear();
        return `<div class="calendar-month ${isCurrent ? 'current' : ''}" onclick="selectMonth(${i})">${mes}</div>`;
    }).join('');
}

window.toggleCalendar = function () {
    const modal = document.getElementById('calendarModal');
    if (!modal) return;
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
    } else {
        calendarYear = (window.currentMonth || new Date()).getFullYear();
        renderCalendarMonths();
        modal.classList.add('show');
    }
};

/* ============================================================
   START
   ============================================================ */
function setupIntroToApp() {
    const startBtn = document.getElementById('startBtn');
    const introScreen = document.getElementById('introScreen');
    const appScreen = document.getElementById('appScreen');
    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        if (!location.hash) location.hash = '#/atendimentos';
        renderRoute();
        setupSidebarMobile();
        setupCalendarModal();
    });
}

window.addEventListener('hashchange', () => {
    // Só renderiza se o app já estiver visível
    const app = document.getElementById('appScreen');
    if (app && !app.classList.contains('hidden')) renderRoute();
});

window.addEventListener('DOMContentLoaded', () => {
    setupIntroToApp();
});

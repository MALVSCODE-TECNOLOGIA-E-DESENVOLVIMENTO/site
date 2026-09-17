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
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (e) { console.error('Storage write error:', e); }
    }
};

/* IDs */
const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

/* Datas */
const pad = n => String(n).padStart(2, '0');
const toDateInput = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayInput = () => toDateInput(new Date());
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
const nowISO = () => new Date().toISOString();

/* ============================================================
   SEED — dados fictícios na primeira visita
   ============================================================ */
function seed() {
    if (Storage.read('seeded.v1', false)) return;

    const clientes = [
        { id: 'cl_1', nome: 'Ana Paula Ribeiro',  contato: '(27) 99811-1001', email: 'ana.ribeiro@exemplo.com', documento: '000.111.222-33', observacoes: 'Prefere contato por WhatsApp.', dataCadastro: '2025-08-14', status: 'ativo' },
        { id: 'cl_2', nome: 'Bruno Cardoso',      contato: '(27) 99811-1002', email: 'bruno.cardoso@exemplo.com', documento: '111.222.333-44', observacoes: '', dataCadastro: '2025-09-02', status: 'ativo' },
        { id: 'cl_3', nome: 'Carla Menezes',      contato: '(27) 99811-1003', email: 'carla.menezes@exemplo.com', documento: '222.333.444-55', observacoes: 'Cliente recorrente.', dataCadastro: '2025-06-20', status: 'ativo' },
        { id: 'cl_4', nome: 'Diego Farias',       contato: '(27) 99811-1004', email: 'diego.farias@exemplo.com', documento: '333.444.555-66', observacoes: '', dataCadastro: '2025-10-05', status: 'inativo' },
        { id: 'cl_5', nome: 'Eduarda Lopes',      contato: '(27) 99811-1005', email: 'eduarda.lopes@exemplo.com', documento: '444.555.666-77', observacoes: 'Indicada pela Ana.', dataCadastro: '2025-11-18', status: 'ativo' }
    ];

    const profissionais = [
        { id: 'pr_1', nome: 'Mariana Alves',    contato: '(27) 99777-2001', especialidades: 'Consultoria, Suporte', disponibilidade: 'Seg a Sex · 08h–18h', status: 'ativo', observacoes: '' },
        { id: 'pr_2', nome: 'Rafael Teixeira',  contato: '(27) 99777-2002', especialidades: 'Instalação, Manutenção', disponibilidade: 'Seg a Sáb · 09h–17h', status: 'ativo', observacoes: '' },
        { id: 'pr_3', nome: 'Juliana Prado',    contato: '(27) 99777-2003', especialidades: 'Atendimento geral', disponibilidade: 'Ter a Sex · 13h–19h', status: 'ativo', observacoes: '' }
    ];

    const servicos = [
        { id: 'sv_1', nome: 'Consultoria Inicial',   descricao: 'Reunião inicial de levantamento de necessidades.', duracao: 60, status: 'ativo', profissionais: ['pr_1'], observacoes: '' },
        { id: 'sv_2', nome: 'Instalação Padrão',     descricao: 'Instalação e configuração em ambiente padrão.', duracao: 90, status: 'ativo', profissionais: ['pr_2'], observacoes: '' },
        { id: 'sv_3', nome: 'Manutenção Preventiva', descricao: 'Revisão periódica programada.', duracao: 45, status: 'ativo', profissionais: ['pr_2'], observacoes: '' },
        { id: 'sv_4', nome: 'Suporte Avançado',      descricao: 'Atendimento especializado de suporte.', duracao: 60, status: 'ativo', profissionais: ['pr_1','pr_3'], observacoes: '' }
    ];

    const canais = [
        { id: 'cn_1', nome: 'WhatsApp',            tipo: 'mensagem',     status: 'ativo', observacoes: '' },
        { id: 'cn_2', nome: 'Telefone',            tipo: 'ligacao',      status: 'ativo', observacoes: '' },
        { id: 'cn_3', nome: 'E-mail',              tipo: 'email',        status: 'ativo', observacoes: '' },
        { id: 'cn_4', nome: 'Site',                tipo: 'formulario',   status: 'ativo', observacoes: '' },
        { id: 'cn_5', nome: 'Atendimento Presencial', tipo: 'presencial', status: 'ativo', observacoes: '' }
    ];

    const hoje = new Date();
    const isoHoje = toDateInput(hoje);
    const ontem = new Date(hoje); ontem.setDate(ontem.getDate() - 1);
    const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);
    const em3 = new Date(hoje); em3.setDate(em3.getDate() + 3);

    const agendamentos = [
        { id: 'ag_1', clienteId: 'cl_1', servicoId: 'sv_1', profissionalId: 'pr_1', data: isoHoje,    hora: '09:00', status: 'agendado', canalId: 'cn_1', observacoes: '' },
        { id: 'ag_2', clienteId: 'cl_3', servicoId: 'sv_2', profissionalId: 'pr_2', data: isoHoje,    hora: '14:00', status: 'agendado', canalId: 'cn_2', observacoes: '' },
        { id: 'ag_3', clienteId: 'cl_2', servicoId: 'sv_4', profissionalId: 'pr_1', data: toDateInput(ontem), hora: '10:30', status: 'nao_compareceu', canalId: 'cn_3', observacoes: 'Cliente avisou que não poderá comparecer.' },
        { id: 'ag_4', clienteId: 'cl_5', servicoId: 'sv_3', profissionalId: 'pr_2', data: toDateInput(amanha), hora: '11:00', status: 'agendado', canalId: 'cn_1', observacoes: '' },
        { id: 'ag_5', clienteId: 'cl_1', servicoId: 'sv_4', profissionalId: 'pr_3', data: toDateInput(em3),   hora: '15:30', status: 'agendado', canalId: 'cn_4', observacoes: '' }
    ];

    const atendimentos = [
        { id: 'at_1', clienteId: 'cl_1', servicoId: 'sv_1', profissionalId: 'pr_1', data: isoHoje,    hora: '09:00', canalId: 'cn_1', status: 'agendado',   observacoes: [] },
        { id: 'at_2', clienteId: 'cl_3', servicoId: 'sv_2', profissionalId: 'pr_2', data: isoHoje,    hora: '14:00', canalId: 'cn_2', status: 'agendado',   observacoes: [] },
        { id: 'at_3', clienteId: 'cl_2', servicoId: 'sv_4', profissionalId: 'pr_1', data: toDateInput(ontem), hora: '10:30', canalId: 'cn_3', status: 'nao_compareceu', observacoes: [{ texto: 'Cliente não compareceu. Reagendar.', autor: 'Recepção', timestamp: nowISO() }] },
        { id: 'at_4', clienteId: 'cl_5', servicoId: 'sv_3', profissionalId: 'pr_2', data: toDateInput(amanha), hora: '11:00', canalId: 'cn_1', status: 'agendado',   observacoes: [] },
        { id: 'at_5', clienteId: 'cl_1', servicoId: 'sv_4', profissionalId: 'pr_3', data: toDateInput(em3),   hora: '15:30', canalId: 'cn_4', status: 'agendado',   observacoes: [] },
        { id: 'at_6', clienteId: 'cl_3', servicoId: 'sv_1', profissionalId: 'pr_1', data: toDateInput(ontem), hora: '16:00', canalId: 'cn_3', status: 'atendido',       observacoes: [{ texto: 'Atendimento concluído com sucesso.', autor: 'Mariana Alves', timestamp: nowISO() }] },
        { id: 'at_7', clienteId: 'cl_4', servicoId: 'sv_2', profissionalId: 'pr_2', data: toDateInput(ontem), hora: '13:00', canalId: 'cn_5', status: 'cancelado',      observacoes: [{ texto: 'Cliente solicitou cancelamento.', autor: 'Recepção', timestamp: nowISO() }] }
    ];

    const comunicacoes = [
        { id: 'co_1', clienteId: 'cl_1', canalId: 'cn_1', assunto: 'Dúvida sobre prazos',         status: 'aguardando',    prioridade: 'alta',  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), observacoes: [] },
        { id: 'co_2', clienteId: 'cl_4', canalId: 'cn_3', assunto: 'Solicitação de orçamento',    status: 'aguardando',    prioridade: 'normal',createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), observacoes: [] },
        { id: 'co_3', clienteId: 'cl_2', canalId: 'cn_2', assunto: 'Reagendamento',               status: 'em_atendimento',prioridade: 'normal',createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), observacoes: [] },
        { id: 'co_4', clienteId: 'cl_5', canalId: 'cn_4', assunto: 'Confirmação de cadastro',     status: 'resolvido',     prioridade: 'baixa', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), observacoes: [] }
    ];

    Storage.write('clientes', clientes);
    Storage.write('profissionais', profissionais);
    Storage.write('servicos', servicos);
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
    getClientes:    () => Storage.read('clientes', []),
    getProfissionais: () => Storage.read('profissionais', []),
    getServicos:    () => Storage.read('servicos', []),
    getCanais:      () => Storage.read('canais', []),
    getAgendamentos: () => Storage.read('agendamentos', []),
    getAtendimentos: () => Storage.read('atendimentos', []),
    getComunicacoes: () => Storage.read('comunicacoes', []),

    setClientes: v => Storage.write('clientes', v),
    setProfissionais: v => Storage.write('profissionais', v),
    setServicos: v => Storage.write('servicos', v),
    setCanais: v => Storage.write('canais', v),
    setAgendamentos: v => Storage.write('agendamentos', v),
    setAtendimentos: v => Storage.write('atendimentos', v),
    setComunicacoes: v => Storage.write('comunicacoes', v)
};

const byId = (arr, id) => arr.find(x => x.id === id) || null;
const clienteNome = id => byId(DB.getClientes(), id)?.nome || '—';
const profissionalNome = id => byId(DB.getProfissionais(), id)?.nome || '—';
const servicoNome = id => byId(DB.getServicos(), id)?.nome || '—';
const canalNome = id => byId(DB.getCanais(), id)?.nome || '—';

/* ============================================================
   Módulos — definição
   ============================================================ */
const MODULES = [
    { id: 'atendimentos',  label: 'Controle de Atendimento', short: 'Atendimentos', icon: 'calendarCheck' },
    { id: 'agendamentos',  label: 'Agendamentos',            short: 'Agendamentos', icon: 'clock' },
    { id: 'canais',        label: 'Canais de Atendimento',   short: 'Canais',       icon: 'inbox' },
    { id: 'clientes',      label: 'Clientes',                short: 'Clientes',     icon: 'users' },
    { id: 'servicos',      label: 'Serviços',                short: 'Serviços',     icon: 'tag' },
    { id: 'profissionais', label: 'Profissionais',           short: 'Profissionais',icon: 'userCheck' },
    { id: 'historico',     label: 'Histórico de Atendimento',short: 'Histórico',    icon: 'history' },
    { id: 'relatorios',    label: 'Relatórios',              short: 'Relatórios',   icon: 'barChart' },
    { id: 'config',        label: 'Configurações',           short: 'Configurações',icon: 'settings' }
];

const ICONS = {
    calendarCheck: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 15 11 17 15 13"/></svg>`,
    clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    inbox: `<svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
    users: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    tag: `<svg viewBox="0 0 24 24"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    userCheck: `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`,
    history: `<svg viewBox="0 0 24 24"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>`,
    barChart: `<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    settings: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
};

/* ============================================================
   Toast / Modal / Confirm
   ============================================================ */
function toast(message, type = 'info', ttl = 3000) {
    const stack = document.getElementById('toastStack');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
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
    overlay.className = 'modal-overlay';
    const sizeClass = size ? ` ${size}` : '';
    overlay.innerHTML = `
        <div class="modal${sizeClass}" role="dialog" aria-modal="true">
            <div class="modal-head">
                <h3>${title}</h3>
                <button class="modal-close" data-close>✕</button>
            </div>
            <div class="modal-body">${bodyHTML}</div>
            ${actions.length ? `<div class="modal-foot">${actions.map((a, i) =>
                `<button class="btn ${a.class || 'btn-secondary'}" data-action="${i}">${a.label}</button>`).join('')}</div>` : ''}
        </div>
    `;
    root.appendChild(overlay);

    const close = () => {
        overlay.style.animation = 'overlayIn 0.15s ease reverse forwards';
        setTimeout(() => overlay.remove(), 150);
    };

    overlay.querySelector('[data-close]').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

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
        const { overlay, close } = openModal({
            title: 'Confirmação',
            bodyHTML: `<p style="font-size:0.95rem;color:var(--gray-700);line-height:1.6;">${message}</p>`,
            actions: [
                { label: cancelLabel, class: 'btn-secondary', onClick: () => { resolve(false); } },
                { label: confirmLabel, class: danger ? 'btn-danger' : 'btn-primary', onClick: () => { resolve(true); } }
            ]
        });
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
    atendimentos: renderAtendimentos,
    agendamentos: renderAgendamentos,
    canais:       renderCanais,
    clientes:     renderClientes,
    servicos:     renderServicos,
    profissionais: renderProfissionais,
    historico:    renderHistorico,
    relatorios:   renderRelatorios,
    config:       renderConfig
};

function navigate(module) {
    location.hash = `#/${module}`;
}

function renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    const { module: active } = parseHash();

    const counts = {
        canais: DB.getComunicacoes().filter(c => c.status === 'aguardando').length
    };

    nav.innerHTML = MODULES.map(m => {
        const badge = counts[m.id] ? `<span class="nav-badge">${counts[m.id]}</span>` : '';
        return `
            <a class="nav-item ${m.id === active ? 'active' : ''}" href="#/${m.id}" data-module="${m.id}">
                <span class="nav-icon">${ICONS[m.icon]}</span>
                <span>${m.label}</span>
                ${badge}
            </a>
        `;
    }).join('');

    nav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            closeSidebar();
        });
    });
}

function renderTopbar() {
    const { module } = parseHash();
    const m = MODULES.find(x => x.id === module) || MODULES[0];
    document.getElementById('topbarCurrent').textContent = m.label;
}

function renderRoute() {
    const { module } = parseHash();
    const m = MODULES.find(x => x.id === module) || MODULES[0];
    const content = document.getElementById('content');
    content.innerHTML = '';
    RENDERERS[m.id](content);
    renderSidebar();
    renderTopbar();
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ============================================================
   Sidebar mobile
   ============================================================ */
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
document.getElementById('menuToggle').addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
});
function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
}
sidebarOverlay.addEventListener('click', closeSidebar);

/* ============================================================
   Helpers de UI
   ============================================================ */
const statusLabel = {
    pendente: 'Pendente',
    agendado: 'Agendado',
    em_atendimento: 'Em atendimento',
    atendido: 'Atendido',
    cancelado: 'Cancelado',
    nao_compareceu: 'Não compareceu',
    aguardando: 'Aguardando',
    em_atendimento_com: 'Em atendimento',
    resolvido: 'Resolvido'
};
const statusBadge = s => `<span class="badge ${s}">${statusLabel[s] || s}</span>`;

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

/* ============================================================
   MÓDULO · CONTROLE DE ATENDIMENTO
   ============================================================ */
let atendimentosFilters = {
    periodo: 'mes',
    status: '',
    clienteId: '',
    profissionalId: '',
    q: ''
};

function atendimentosFiltrados() {
    const list = DB.getAtendimentos();
    const hoje = new Date();
    const { periodo, status, clienteId, profissionalId, q } = atendimentosFilters;

    const ql = q.trim().toLowerCase();

    return list.filter(a => {
        if (periodo === 'hoje') {
            if (a.data !== todayInput()) return false;
        } else if (periodo === 'mes') {
            const d = new Date(a.data + 'T00:00:00');
            if (d.getMonth() !== hoje.getMonth() || d.getFullYear() !== hoje.getFullYear()) return false;
        }
        if (status && a.status !== status) return false;
        if (clienteId && a.clienteId !== clienteId) return false;
        if (profissionalId && a.profissionalId !== profissionalId) return false;
        if (ql) {
            const c = clienteNome(a.clienteId).toLowerCase();
            const p = profissionalNome(a.profissionalId).toLowerCase();
            const s = servicoNome(a.servicoId).toLowerCase();
            if (!c.includes(ql) && !p.includes(ql) && !s.includes(ql)) return false;
        }
        return true;
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function renderAtendimentos(root) {
    const list = atendimentosFiltrados();
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();

    const total = list.length;
    const agendados = list.filter(a => a.status === 'agendado').length;
    const atendidos = list.filter(a => a.status === 'atendido').length;
    const cancelados = list.filter(a => a.status === 'cancelado' || a.status === 'nao_compareceu').length;

    root.innerHTML = `
        <div class="page-head">
            <div>
                <h1>Controle de Atendimento</h1>
                <span class="subtitle">Atendimentos registrados no período selecionado.</span>
            </div>
            <button class="btn btn-primary" id="btnNovoAt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo atendimento
            </button>
        </div>

        <div class="kpi-grid">
            <div class="kpi"><div class="kpi-label">Total no período</div><div class="kpi-value">${total}</div></div>
            <div class="kpi"><div class="kpi-label">Agendados</div><div class="kpi-value blue">${agendados}</div></div>
            <div class="kpi"><div class="kpi-label">Atendidos</div><div class="kpi-value green">${atendidos}</div></div>
            <div class="kpi"><div class="kpi-label">Cancelados / Não compareceu</div><div class="kpi-value red">${cancelados}</div></div>
        </div>

        <div class="toolbar">
            <div class="toolbar-search">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="atQ" placeholder="Buscar por cliente, profissional ou serviço..." value="${atendimentosFilters.q}">
            </div>
            <select class="toolbar-select" id="atPeriodo">
                <option value="mes"  ${atendimentosFilters.periodo === 'mes' ? 'selected' : ''}>Este mês</option>
                <option value="hoje" ${atendimentosFilters.periodo === 'hoje' ? 'selected' : ''}>Hoje</option>
                <option value="all"  ${atendimentosFilters.periodo === 'all' ? 'selected' : ''}>Todos</option>
            </select>
            <select class="toolbar-select" id="atStatus">
                <option value="">Todos os status</option>
                ${['agendado','atendido','cancelado','nao_compareceu'].map(s => `<option value="${s}" ${atendimentosFilters.status === s ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}
            </select>
            <select class="toolbar-select" id="atCliente">
                <option value="">Todos os clientes</option>
                ${clientes.map(c => `<option value="${c.id}" ${atendimentosFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
            </select>
            <select class="toolbar-select" id="atProf">
                <option value="">Todos os profissionais</option>
                ${profissionais.map(p => `<option value="${p.id}" ${atendimentosFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
            </select>
        </div>

        <div class="table-card">
            <div class="table-wrap">
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

    renderAtendimentosRows();

    document.getElementById('atQ').addEventListener('input', e => {
        atendimentosFilters.q = e.target.value;
        renderAtendimentosRows();
    });
    ['atPeriodo', 'atStatus', 'atCliente', 'atProf'].forEach((id, i) => {
        document.getElementById(id).addEventListener('change', e => {
            const keys = ['periodo', 'status', 'clienteId', 'profissionalId'];
            atendimentosFilters[keys[i]] = e.target.value;
            renderAtendimentosRows();
        });
    });
    document.getElementById('btnNovoAt').addEventListener('click', () => openAtendimentoModal());
}

function renderAtendimentosRows() {
    const tbody = document.getElementById('atBody');
    const list = atendimentosFiltrados();

    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="9">${emptyState('Nenhum atendimento encontrado', 'Ajuste os filtros acima ou crie um novo atendimento.')}</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(a => {
        const concluido = a.status === 'atendido';
        const cancelado = a.status === 'cancelado' || a.status === 'nao_compareceu';
        return `
            <tr data-id="${a.id}">
                <td style="text-align:center;">
                    <label class="checkbox ${concluido ? 'checked' : ''}" title="${concluido ? 'Marcar como pendente' : 'Marcar como atendido'}">
                        <input type="checkbox" data-toggle="${a.id}" ${concluido ? 'checked' : ''} ${cancelado ? 'disabled' : ''}>
                    </label>
                </td>
                <td class="row-strong">${fmtDate(a.data)}</td>
                <td>${a.hora}</td>
                <td>${clienteNome(a.clienteId)}</td>
                <td>${servicoNome(a.servicoId)}</td>
                <td>${profissionalNome(a.profissionalId)}</td>
                <td><span class="chip">${canalNome(a.canalId)}</span></td>
                <td>${statusBadge(a.status)}</td>
                <td>
                    <div class="td-actions">
                        <button class="btn-icon" data-view="${a.id}" title="Ver detalhes">
                            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="btn-icon" data-edit="${a.id}" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </button>
                        <button class="btn-icon" data-cancel="${a.id}" title="Cancelar">
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('[data-toggle]').forEach(cb => {
        cb.addEventListener('change', e => {
            const id = cb.dataset.toggle;
            toggleAtendimento(id, e.target.checked);
        });
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
    renderAtendimentosRows();
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
    renderAtendimentosRows();
    toast('Atendimento cancelado.', 'error');
}

function viewAtendimento(id) {
    const a = DB.getAtendimentos().find(x => x.id === id);
    if (!a) return;

    const obs = a.observacoes || [];
    const obsHTML = obs.length
        ? `<div class="observations-list">${obs.map(o => `
            <div class="observation-item">
                <span class="observation-meta">${fmtDateTime(o.timestamp)} · ${o.autor || '—'}</span>
                <div class="observation-text">${o.texto}</div>
            </div>
        `).join('')}</div>`
        : '<p style="color:var(--gray-500);font-size:0.85rem;">Nenhuma observação registrada.</p>';

    openModal({
        title: `Atendimento · ${clienteNome(a.clienteId)}`,
        size: 'lg',
        bodyHTML: `
            <div class="tabs">
                <button class="tab active" data-tab="dados">Dados</button>
                <button class="tab" data-tab="obs">Observações</button>
            </div>
            <div data-pane="dados">
                <div class="detail-list">
                    <div class="detail-row"><div class="lbl">Data</div><div class="val">${fmtDate(a.data)}</div></div>
                    <div class="detail-row"><div class="lbl">Hora</div><div class="val">${a.hora}</div></div>
                    <div class="detail-row"><div class="lbl">Cliente</div><div class="val">${clienteNome(a.clienteId)}</div></div>
                    <div class="detail-row"><div class="lbl">Serviço</div><div class="val">${servicoNome(a.servicoId)}</div></div>
                    <div class="detail-row"><div class="lbl">Profissional</div><div class="val">${profissionalNome(a.profissionalId)}</div></div>
                    <div class="detail-row"><div class="lbl">Canal</div><div class="val">${canalNome(a.canalId)}</div></div>
                    <div class="detail-row"><div class="lbl">Status</div><div class="val">${statusBadge(a.status)}</div></div>
                </div>
            </div>
            <div data-pane="obs" style="display:none;">
                ${obsHTML}
                <div style="margin-top:1rem;">
                    <label style="display:block;font-size:0.78rem;font-weight:500;color:var(--gray-700);margin-bottom:0.35rem;">Nova observação</label>
                    <textarea id="newObs" rows="3" style="width:100%;padding:0.62rem 0.8rem;border:1px solid var(--gray-300);border-radius:6px;font-size:0.875rem;font-family:inherit;resize:vertical;" placeholder="Escreva uma observação..."></textarea>
                    <button class="btn btn-primary btn-sm" id="addObs" style="margin-top:0.6rem;">Adicionar observação</button>
                </div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'btn-secondary' }]
    });

    document.querySelectorAll('.tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('[data-pane]').forEach(p => p.style.display = 'none');
            document.querySelector(`[data-pane="${tab.dataset.tab}"]`).style.display = 'block';
        });
    });

    document.getElementById('addObs').addEventListener('click', () => {
        const txt = document.getElementById('newObs').value.trim();
        if (!txt) { toast('Digite uma observação.', 'warning'); return; }
        const all = DB.getAtendimentos();
        const ix = all.findIndex(x => x.id === id);
        all[ix].observacoes = [...(all[ix].observacoes || []), { texto: txt, autor: 'Operador', timestamp: nowISO() }];
        DB.setAtendimentos(all);
        toast('Observação registrada.', 'success');
        document.querySelector('.modal-overlay')?.remove();
        viewAtendimento(id);
    });
}

function openAtendimentoModal(editId) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const servicos = DB.getServicos();
    const canais = DB.getCanais();

    const a = editId ? DB.getAtendimentos().find(x => x.id === editId) : null;

    openModal({
        title: a ? 'Editar atendimento' : 'Novo atendimento',
        size: 'lg',
        bodyHTML: `
            <form id="formAt" class="form-grid">
                <div class="field">
                    <label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(c => `<option value="${c.id}" ${a?.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Serviço <span class="req">*</span></label>
                    <select name="servicoId" required>
                        <option value="">Selecione</option>
                        ${servicos.map(s => `<option value="${s.id}" ${a?.servicoId === s.id ? 'selected' : ''}>${s.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Profissional <span class="req">*</span></label>
                    <select name="profissionalId" required>
                        <option value="">Selecione</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${a?.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Canal</label>
                    <select name="canalId">
                        <option value="">Selecione</option>
                        ${canais.map(c => `<option value="${c.id}" ${a?.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Data <span class="req">*</span></label>
                    <input type="date" name="data" required value="${a?.data || todayInput()}">
                </div>
                <div class="field">
                    <label>Hora <span class="req">*</span></label>
                    <input type="time" name="hora" required value="${a?.hora || '09:00'}">
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: a ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: (overlay) => {
                const form = overlay.querySelector('#formAt');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());

                if (!a && conflitoHorario(data.profissionalId, data.data, data.hora)) {
                    toast('Já existe um agendamento neste horário para o profissional selecionado.', 'error');
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
                renderAtendimentosRows();
                return true;
            }}
        ]
    });
}

function conflitoHorario(profissionalId, data, hora, ignorarId = null) {
    const ags = DB.getAgendamentos().filter(a => a.status !== 'cancelado' && a.id !== ignorarId);
    const ats = DB.getAtendimentos().filter(a => a.status !== 'cancelado');
    const ocupadoAg = ags.some(a => a.profissionalId === profissionalId && a.data === data && a.hora === hora);
    const ocupadoAt = ats.some(a => a.profissionalId === profissionalId && a.data === data && a.hora === hora);
    return ocupadoAg || ocupadoAt;
}

/* ============================================================
   MÓDULO · AGENDAMENTOS
   ============================================================ */
let agendamentosFilters = { periodo: 'mes', status: '', clienteId: '', profissionalId: '', q: '' };

function agendamentosFiltrados() {
    const list = DB.getAgendamentos();
    const hoje = new Date();
    const { periodo, status, clienteId, profissionalId, q } = agendamentosFilters;
    const ql = q.trim().toLowerCase();

    return list.filter(a => {
        if (periodo === 'hoje') {
            if (a.data !== todayInput()) return false;
        } else if (periodo === 'mes') {
            const d = new Date(a.data + 'T00:00:00');
            if (d.getMonth() !== hoje.getMonth() || d.getFullYear() !== hoje.getFullYear()) return false;
        } else if (periodo === 'proximos') {
            if (a.data < todayInput()) return false;
        }
        if (status && a.status !== status) return false;
        if (clienteId && a.clienteId !== clienteId) return false;
        if (profissionalId && a.profissionalId !== profissionalId) return false;
        if (ql) {
            if (!clienteNome(a.clienteId).toLowerCase().includes(ql) &&
                !profissionalNome(a.profissionalId).toLowerCase().includes(ql) &&
                !servicoNome(a.servicoId).toLowerCase().includes(ql)) return false;
        }
        return true;
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function renderAgendamentos(root) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();

    root.innerHTML = `
        <div class="page-head">
            <div>
                <h1>Agendamentos</h1>
                <span class="subtitle">Crie e gerencie agendamentos. O sistema bloqueia horários já reservados.</span>
            </div>
            <button class="btn btn-primary" id="btnNovoAg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo agendamento
            </button>
        </div>

        <div class="toolbar">
            <div class="toolbar-search">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="agQ" placeholder="Buscar por cliente, profissional ou serviço..." value="${agendamentosFilters.q}">
            </div>
            <select class="toolbar-select" id="agPeriodo">
                <option value="mes"      ${agendamentosFilters.periodo === 'mes' ? 'selected' : ''}>Este mês</option>
                <option value="hoje"     ${agendamentosFilters.periodo === 'hoje' ? 'selected' : ''}>Hoje</option>
                <option value="proximos" ${agendamentosFilters.periodo === 'proximos' ? 'selected' : ''}>Próximos</option>
                <option value="all"      ${agendamentosFilters.periodo === 'all' ? 'selected' : ''}>Todos</option>
            </select>
            <select class="toolbar-select" id="agStatus">
                <option value="">Todos os status</option>
                ${['agendado','atendido','cancelado','nao_compareceu'].map(s => `<option value="${s}" ${agendamentosFilters.status === s ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}
            </select>
            <select class="toolbar-select" id="agCliente">
                <option value="">Todos os clientes</option>
                ${clientes.map(c => `<option value="${c.id}" ${agendamentosFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
            </select>
            <select class="toolbar-select" id="agProf">
                <option value="">Todos os profissionais</option>
                ${profissionais.map(p => `<option value="${p.id}" ${agendamentosFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
            </select>
        </div>

        <div class="table-card">
            <div class="table-wrap">
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

    renderAgendamentosRows();

    document.getElementById('agQ').addEventListener('input', e => { agendamentosFilters.q = e.target.value; renderAgendamentosRows(); });
    ['agPeriodo','agStatus','agCliente','agProf'].forEach((id, i) => {
        document.getElementById(id).addEventListener('change', e => {
            const keys = ['periodo','status','clienteId','profissionalId'];
            agendamentosFilters[keys[i]] = e.target.value;
            renderAgendamentosRows();
        });
    });
    document.getElementById('btnNovoAg').addEventListener('click', () => openAgendamentoModal());
}

function renderAgendamentosRows() {
    const tbody = document.getElementById('agBody');
    const list = agendamentosFiltrados();
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="8">${emptyState('Nenhum agendamento', 'Crie um novo agendamento ou ajuste os filtros.')}</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(a => `
        <tr data-id="${a.id}">
            <td class="row-strong">${fmtDate(a.data)}</td>
            <td>${a.hora}</td>
            <td>${clienteNome(a.clienteId)}</td>
            <td>${servicoNome(a.servicoId)}</td>
            <td>${profissionalNome(a.profissionalId)}</td>
            <td><span class="chip">${canalNome(a.canalId)}</span></td>
            <td>${statusBadge(a.status)}</td>
            <td>
                <div class="td-actions">
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

    renderAgendamentosRows();
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
    renderAgendamentosRows();
    toast('Agendamento cancelado.', 'error');
}

function openAgendamentoModal(editId) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const servicos = DB.getServicos();
    const canais = DB.getCanais();
    const config = Storage.read('config.funcionamento', { inicio: '08:00', fim: '18:00', intervaloMin: 30 });

    const a = editId ? DB.getAgendamentos().find(x => x.id === editId) : null;

    const slots = gerarSlots(config.inicio, config.fim, config.intervaloMin);

    openModal({
        title: a ? 'Editar agendamento' : 'Novo agendamento',
        size: 'lg',
        bodyHTML: `
            <form id="formAg" class="form-grid">
                <div class="field">
                    <label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(c => `<option value="${c.id}" ${a?.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Serviço <span class="req">*</span></label>
                    <select name="servicoId" required>
                        <option value="">Selecione</option>
                        ${servicos.map(s => `<option value="${s.id}" ${a?.servicoId === s.id ? 'selected' : ''}>${s.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Profissional <span class="req">*</span></label>
                    <select name="profissionalId" required id="agProfSel">
                        <option value="">Selecione</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${a?.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Canal</label>
                    <select name="canalId">
                        <option value="">Selecione</option>
                        ${canais.map(c => `<option value="${c.id}" ${a?.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Data <span class="req">*</span></label>
                    <input type="date" name="data" required id="agData" value="${a?.data || todayInput()}">
                </div>
                <div class="field full">
                    <label>Horário <span class="req">*</span></label>
                    <div class="slots-grid" id="agSlots"></div>
                    <input type="hidden" name="hora" id="agHora" value="${a?.hora || ''}">
                    <span class="hint">Verde disponível · Vermelho ocupado</span>
                </div>
                <div class="field full">
                    <label>Observações</label>
                    <textarea name="observacoes" placeholder="Anotações internas do agendamento...">${a?.observacoes || ''}</textarea>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: a ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formAg');
                const hora = overlay.querySelector('#agHora').value;
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
                } else {
                    list.push({ id: uid('ag'), ...data, status: 'agendado' });
                    // Cria atendimento correspondente
                    const ats = DB.getAtendimentos();
                    ats.push({
                        id: uid('at'),
                        clienteId: data.clienteId,
                        servicoId: data.servicoId,
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
                renderAgendamentosRows();
                return true;
            }}
        ]
    });

    const slotsEl = document.getElementById('agSlots');
    const horaInput = document.getElementById('agHora');
    const profSel = document.getElementById('agProfSel');
    const dataInput = document.getElementById('agData');

    function renderSlots() {
        const profissionalId = profSel.value;
        const data = dataInput.value;
        const ags = DB.getAgendamentos().filter(x => x.status !== 'cancelado');
        const ats = DB.getAtendimentos().filter(x => x.status !== 'cancelado');
        const hoje = todayInput();

        slotsEl.innerHTML = slots.map(s => {
            const ocupado = (profissionalId && data) && (
                ags.some(x => x.profissionalId === profissionalId && x.data === data && x.hora === s) ||
                ats.some(x => x.profissionalId === profissionalId && x.data === data && x.hora === s)
            );
            const passado = data < hoje;
            const cls = ['slot'];
            if (ocupado) cls.push('busy');
            if (passado) cls.push('past');
            if (horaInput.value === s) cls.push('selected');
            return `<button type="button" class="${cls.join(' ')}" data-slot="${s}" ${ocupado || passado ? 'disabled' : ''}>${s}</button>`;
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

/* ============================================================
   MÓDULO · CANAIS DE ATENDIMENTO
   ============================================================ */
function renderCanais(root) {
    const canais = DB.getCanais();
    const comunicacoes = DB.getComunicacoes().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    root.innerHTML = `
        <div class="page-head">
            <div>
                <h1>Canais de Atendimento</h1>
                <span class="subtitle">Solicitações recebidas por canais. As mais antigas têm prioridade.</span>
            </div>
            <button class="btn btn-primary" id="btnNovoCom">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nova comunicação
            </button>
        </div>

        <div class="kpi-grid">
            <div class="kpi"><div class="kpi-label">Aguardando</div><div class="kpi-value amber">${comunicacoes.filter(c => c.status === 'aguardando').length}</div><div class="kpi-foot">Mais antigas primeiro</div></div>
            <div class="kpi"><div class="kpi-label">Em atendimento</div><div class="kpi-value blue">${comunicacoes.filter(c => c.status === 'em_atendimento').length}</div></div>
            <div class="kpi"><div class="kpi-label">Resolvidas</div><div class="kpi-value green">${comunicacoes.filter(c => c.status === 'resolvido').length}</div></div>
            <div class="kpi"><div class="kpi-label">Canais ativos</div><div class="kpi-value">${canais.filter(c => c.status === 'ativo').length}</div></div>
        </div>

        <div class="tabs">
            <button class="tab active" data-ctab="fila">Fila de solicitações</button>
            <button class="tab" data-ctab="config">Configurar canais</button>
        </div>

        <div data-cpane="fila">
            <div class="table-card">
                <div class="table-wrap">
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
                        <tbody id="comBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div data-cpane="config" style="display:none;">
            <div class="table-card">
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th style="text-align:right;">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="cnBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    renderComRows(comunicacoes);
    renderCanaisRows(canais);

    document.querySelectorAll('.tabs .tab[data-ctab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tabs .tab[data-ctab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('[data-cpane]').forEach(p => p.style.display = 'none');
            document.querySelector(`[data-cpane="${tab.dataset.ctab}"]`).style.display = 'block';
        });
    });
    document.getElementById('btnNovoCom').addEventListener('click', () => openComunicacaoModal());
}

function renderComRows(comunicacoes) {
    const tbody = document.getElementById('comBody');
    if (!comunicacoes.length) {
        tbody.innerHTML = `<tr><td colspan="7">${emptyState('Sem solicitações', 'Nenhuma comunicação aguardando.')}</td></tr>`;
        return;
    }
    tbody.innerHTML = comunicacoes.map(c => {
        const ageMin = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 60000);
        const aging = ageMin > 60 * 24 ? `${Math.floor(ageMin / (60 * 24))}d` : ageMin > 60 ? `${Math.floor(ageMin / 60)}h` : `${ageMin}min`;
        return `
            <tr data-id="${c.id}">
                <td>${c.prioridade === 'alta' ? '🔴 Alta' : c.prioridade === 'baixa' ? '🟢 Baixa' : '🟡 Normal'}</td>
                <td>${aging}</td>
                <td class="row-strong">${clienteNome(c.clienteId)}</td>
                <td><span class="chip">${canalNome(c.canalId)}</span></td>
                <td>${c.assunto}</td>
                <td>${statusBadge(c.status)}</td>
                <td>
                    <div class="td-actions">
                        <button class="btn-icon" data-view="${c.id}" title="Ver"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg></button>
                        <button class="btn-icon" data-edit="${c.id}" title="Editar"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
                        <button class="btn-icon" data-done="${c.id}" title="Marcar como resolvida"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewComunicacao(b.dataset.view)));
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openComunicacaoModal(b.dataset.edit)));
    tbody.querySelectorAll('[data-done]').forEach(b => b.addEventListener('click', () => resolveComunicacao(b.dataset.done)));
}

function renderCanaisRows(canais) {
    const tbody = document.getElementById('cnBody');
    if (!canais.length) {
        tbody.innerHTML = `<tr><td colspan="4">${emptyState('Sem canais', 'Cadastre o primeiro canal.')}</td></tr>`;
        return;
    }
    tbody.innerHTML = canais.map(c => `
        <tr data-id="${c.id}">
            <td class="row-strong">${c.nome}</td>
            <td><span class="chip">${c.tipo}</span></td>
            <td>${c.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</td>
            <td>
                <div class="td-actions">
                    <button class="btn-icon" data-edit="${c.id}" title="Editar"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
                    <button class="btn-icon" data-del="${c.id}" title="Remover"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/></svg></button>
                </div>
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openCanalModal(b.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
        const ok = await confirmDialog('Remover este canal?');
        if (!ok) return;
        DB.setCanais(DB.getCanais().filter(x => x.id !== b.dataset.del));
        renderCanais(document.getElementById('content'));
        toast('Canal removido.', 'error');
    }));
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
        size: 'lg',
        bodyHTML: `
            <div class="detail-list">
                <div class="detail-row"><div class="lbl">Cliente</div><div class="val">${clienteNome(c.clienteId)}</div></div>
                <div class="detail-row"><div class="lbl">Canal</div><div class="val">${canalNome(c.canalId)}</div></div>
                <div class="detail-row"><div class="lbl">Assunto</div><div class="val">${c.assunto}</div></div>
                <div class="detail-row"><div class="lbl">Recebida em</div><div class="val">${fmtDateTime(c.createdAt)}</div></div>
                <div class="detail-row"><div class="lbl">Prioridade</div><div class="val">${c.prioridade}</div></div>
                <div class="detail-row"><div class="lbl">Status</div><div class="val">${statusBadge(c.status)}</div></div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'btn-secondary' }]
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
                <div class="field">
                    <label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(cl => `<option value="${cl.id}" ${c?.clienteId === cl.id ? 'selected' : ''}>${cl.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Canal <span class="req">*</span></label>
                    <select name="canalId" required>
                        <option value="">Selecione</option>
                        ${canais.map(cn => `<option value="${cn.id}" ${c?.canalId === cn.id ? 'selected' : ''}>${cn.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="field full">
                    <label>Assunto <span class="req">*</span></label>
                    <input type="text" name="assunto" required value="${c?.assunto || ''}">
                </div>
                <div class="field">
                    <label>Prioridade</label>
                    <select name="prioridade">
                        ${['baixa','normal','alta'].map(p => `<option value="${p}" ${c?.prioridade === p ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Status</label>
                    <select name="status">
                        ${['aguardando','em_atendimento','resolvido'].map(s => `<option value="${s}" ${c?.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formCom');
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

function openCanalModal(editId) {
    const c = editId ? DB.getCanais().find(x => x.id === editId) : null;
    openModal({
        title: c ? 'Editar canal' : 'Novo canal',
        bodyHTML: `
            <form id="formCn" class="form-grid">
                <div class="field full">
                    <label>Nome <span class="req">*</span></label>
                    <input type="text" name="nome" required value="${c?.nome || ''}">
                </div>
                <div class="field">
                    <label>Tipo</label>
                    <select name="tipo">
                        ${['mensagem','ligacao','email','formulario','presencial'].map(t => `<option value="${t}" ${c?.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Status</label>
                    <select name="status">
                        <option value="ativo" ${c?.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${c?.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formCn');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getCanais();
                if (c) {
                    const idx = list.findIndex(x => x.id === c.id);
                    list[idx] = { ...list[idx], ...data };
                } else {
                    list.push({ id: uid('cn'), ...data, observacoes: '' });
                }
                DB.setCanais(list);
                toast(c ? 'Canal atualizado.' : 'Canal criado.', 'success');
                renderCanais(document.getElementById('content'));
                return true;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · CLIENTES
   ============================================================ */
let clientesQ = '';
function renderClientes(root) {
    root.innerHTML = `
        <div class="page-head">
            <div>
                <h1>Clientes</h1>
                <span class="subtitle">Cadastro, histórico e relacionamento.</span>
            </div>
            <button class="btn btn-primary" id="btnNovoCli">Novo cliente</button>
        </div>

        <div class="toolbar">
            <div class="toolbar-search">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" id="cliQ" placeholder="Buscar por nome, contato ou e-mail..." value="${clientesQ}">
            </div>
        </div>

        <div class="table-card">
            <div class="table-wrap">
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
        const ql = clientesQ.trim().toLowerCase();
        const list = DB.getClientes().filter(c => {
            if (!ql) return true;
            return c.nome.toLowerCase().includes(ql) || (c.contato || '').toLowerCase().includes(ql) || (c.email || '').toLowerCase().includes(ql);
        });

        const atendimentos = DB.getAtendimentos();

        if (!list.length) { tbody.innerHTML = `<tr><td colspan="7">${emptyState('Nenhum cliente', 'Cadastre o primeiro cliente.')}</td></tr>`; return; }

        tbody.innerHTML = list.map(c => {
            const ats = atendimentos.filter(a => a.clienteId === c.id && a.status === 'atendido');
            const ultimo = ats.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora))[0];
            return `
                <tr>
                    <td class="row-strong">${c.nome}</td>
                    <td>${c.contato || '—'}</td>
                    <td>${c.email || '—'}</td>
                    <td>${ultimo ? `${fmtDate(ultimo.data)} · ${servicoNome(ultimo.servicoId)}` : '—'}</td>
                    <td>${fmtDate(c.dataCadastro)}</td>
                    <td>${c.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</td>
                    <td><div class="td-actions">
                        <button class="btn-icon" data-hist="${c.id}" title="Histórico"><svg viewBox="0 0 24 24"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg></button>
                        <button class="btn-icon" data-edit="${c.id}" title="Editar"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
                    </div></td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openClienteModal(b.dataset.edit)));
        tbody.querySelectorAll('[data-hist]').forEach(b => b.addEventListener('click', () => viewHistoricoCliente(b.dataset.hist)));
    };

    render();
    document.getElementById('cliQ').addEventListener('input', e => { clientesQ = e.target.value; render(); });
    document.getElementById('btnNovoCli').addEventListener('click', () => openClienteModal());
}

function openClienteModal(editId) {
    const c = editId ? DB.getClientes().find(x => x.id === editId) : null;
    openModal({
        title: c ? 'Editar cliente' : 'Novo cliente',
        bodyHTML: `
            <form id="formCli" class="form-grid">
                <div class="field full"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${c?.nome || ''}"></div>
                <div class="field"><label>Contato</label><input type="text" name="contato" value="${c?.contato || ''}"></div>
                <div class="field"><label>E-mail</label><input type="email" name="email" value="${c?.email || ''}"></div>
                <div class="field"><label>Documento</label><input type="text" name="documento" value="${c?.documento || ''}"></div>
                <div class="field"><label>Status</label><select name="status"><option value="ativo" ${c?.status === 'ativo' ? 'selected' : ''}>Ativo</option><option value="inativo" ${c?.status === 'inativo' ? 'selected' : ''}>Inativo</option></select></div>
                <div class="field full"><label>Observações</label><textarea name="observacoes">${c?.observacoes || ''}</textarea></div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formCli');
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
    const ats = DB.getAtendimentos().filter(a => a.clienteId === id).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
    const coms = DB.getComunicacoes().filter(x => x.clienteId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const atsHTML = ats.length ? ats.map(a => `
        <div class="timeline-item">
            <span class="timeline-time">${fmtDate(a.data)} · ${a.hora}</span>
            <div class="timeline-title">${servicoNome(a.servicoId)}</div>
            <div class="timeline-desc">${profissionalNome(a.profissionalId)} · ${statusLabel[a.status] || a.status}</div>
        </div>
    `).join('') : '<p style="color:var(--gray-500);font-size:0.85rem;">Sem atendimentos registrados.</p>';

    const comsHTML = coms.length ? coms.map(c => `
        <div class="timeline-item">
            <span class="timeline-time">${fmtDateTime(c.createdAt)}</span>
            <div class="timeline-title">${c.assunto}</div>
            <div class="timeline-desc">${canalNome(c.canalId)} · ${statusLabel[c.status] || c.status}</div>
        </div>
    `).join('') : '<p style="color:var(--gray-500);font-size:0.85rem;">Sem comunicações.</p>';

    openModal({
        title: `Histórico · ${c.nome}`,
        size: 'lg',
        bodyHTML: `
            <div class="tabs">
                <button class="tab active" data-h="at">Atendimentos</button>
                <button class="tab" data-h="co">Comunicações</button>
                <button class="tab" data-h="info">Dados</button>
            </div>
            <div data-hp="at"><div class="timeline">${atsHTML}</div></div>
            <div data-hp="co" style="display:none;"><div class="timeline">${comsHTML}</div></div>
            <div data-hp="info" style="display:none;">
                <div class="detail-list">
                    <div class="detail-row"><div class="lbl">Nome</div><div class="val">${c.nome}</div></div>
                    <div class="detail-row"><div class="lbl">Contato</div><div class="val">${c.contato || '—'}</div></div>
                    <div class="detail-row"><div class="lbl">E-mail</div><div class="val">${c.email || '—'}</div></div>
                    <div class="detail-row"><div class="lbl">Documento</div><div class="val">${c.documento || '—'}</div></div>
                    <div class="detail-row"><div class="lbl">Cadastro</div><div class="val">${fmtDate(c.dataCadastro)}</div></div>
                    <div class="detail-row"><div class="lbl">Observações</div><div class="val">${c.observacoes || '—'}</div></div>
                </div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'btn-secondary' }]
    });

    document.querySelectorAll('.tabs .tab[data-h]').forEach(tab => tab.addEventListener('click', () => {
        document.querySelectorAll('.tabs .tab[data-h]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('[data-hp]').forEach(p => p.style.display = 'none');
        document.querySelector(`[data-hp="${tab.dataset.h}"]`).style.display = 'block';
    }));
}

/* ============================================================
   MÓDULO · SERVIÇOS
   ============================================================ */
function renderServicos(root) {
    const servicos = DB.getServicos();
    const profissionais = DB.getProfissionais();

    root.innerHTML = `
        <div class="page-head">
            <div><h1>Serviços</h1><span class="subtitle">Serviços oferecidos pela empresa.</span></div>
            <button class="btn btn-primary" id="btnNovoServ">Novo serviço</button>
        </div>

        <div class="table-card">
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Serviço</th><th>Duração</th><th>Profissionais</th><th>Status</th><th style="text-align:right;">Ações</th></tr></thead>
                    <tbody id="servBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = document.getElementById('servBody');
    if (!servicos.length) { tbody.innerHTML = `<tr><td colspan="5">${emptyState('Sem serviços', 'Cadastre o primeiro serviço.')}</td></tr>`; }
    else {
        tbody.innerHTML = servicos.map(s => `
            <tr>
                <td class="row-strong">${s.nome}<div style="font-size:0.78rem;color:var(--gray-500);font-weight:400;margin-top:2px;">${s.descricao || ''}</div></td>
                <td>${s.duracao} min</td>
                <td>${(s.profissionais || []).map(id => profissionalNome(id)).join(', ') || '—'}</td>
                <td>${s.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</td>
                <td><div class="td-actions">
                    <button class="btn-icon" data-edit="${s.id}" title="Editar"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
                </div></td>
            </tr>
        `).join('');
        tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openServicoModal(b.dataset.edit)));
    }

    document.getElementById('btnNovoServ').addEventListener('click', () => openServicoModal());
}

function openServicoModal(editId) {
    const s = editId ? DB.getServicos().find(x => x.id === editId) : null;
    const pro = DB.getProfissionais();
    openModal({
        title: s ? 'Editar serviço' : 'Novo serviço',
        bodyHTML: `
            <form id="formServ" class="form-grid">
                <div class="field full"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${s?.nome || ''}"></div>
                <div class="field full"><label>Descrição</label><textarea name="descricao">${s?.descricao || ''}</textarea></div>
                <div class="field"><label>Duração (min)</label><input type="number" name="duracao" min="5" step="5" value="${s?.duracao || 30}"></div>
                <div class="field"><label>Status</label><select name="status"><option value="ativo" ${s?.status === 'ativo' ? 'selected' : ''}>Ativo</option><option value="inativo" ${s?.status === 'inativo' ? 'selected' : ''}>Inativo</option></select></div>
                <div class="field full"><label>Profissionais habilitados</label>
                    <select name="profissionais" multiple size="4" style="height:auto;padding:0.35rem;">
                        ${pro.map(p => `<option value="${p.id}" ${(s?.profissionais || []).includes(p.id) ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: s ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formServ');
                if (!form.reportValidity()) return false;
                const fd = new FormData(form);
                const profissionaisSel = Array.from(overlay.querySelector('select[name="profissionais"]').selectedOptions).map(o => o.value);
                const data = {
                    nome: fd.get('nome'),
                    descricao: fd.get('descricao'),
                    duracao: Number(fd.get('duracao')) || 30,
                    status: fd.get('status'),
                    profissionais: profissionaisSel
                };
                const list = DB.getServicos();
                if (s) { const i = list.findIndex(x => x.id === s.id); list[i] = { ...list[i], ...data }; }
                else { list.push({ id: uid('sv'), ...data, observacoes: '' }); }
                DB.setServicos(list);
                toast(s ? 'Serviço atualizado.' : 'Serviço criado.', 'success');
                renderServicos(document.getElementById('content'));
                return true;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · PROFISSIONAIS
   ============================================================ */
function renderProfissionais(root) {
    const list = DB.getProfissionais();
    root.innerHTML = `
        <div class="page-head">
            <div><h1>Profissionais</h1><span class="subtitle">Responsáveis pelos atendimentos.</span></div>
            <button class="btn btn-primary" id="btnNovoProf">Novo profissional</button>
        </div>
        <div class="table-card">
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Nome</th><th>Contato</th><th>Especialidades</th><th>Disponibilidade</th><th>Status</th><th style="text-align:right;">Ações</th></tr></thead>
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
                <td class="row-strong">${p.nome}</td>
                <td>${p.contato || '—'}</td>
                <td>${p.especialidades || '—'}</td>
                <td>${p.disponibilidade || '—'}</td>
                <td>${p.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</td>
                <td><div class="td-actions">
                    <button class="btn-icon" data-edit="${p.id}" title="Editar"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>
                </div></td>
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
                <div class="field full"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${p?.nome || ''}"></div>
                <div class="field"><label>Contato</label><input type="text" name="contato" value="${p?.contato || ''}"></div>
                <div class="field"><label>Status</label><select name="status"><option value="ativo" ${p?.status === 'ativo' ? 'selected' : ''}>Ativo</option><option value="inativo" ${p?.status === 'inativo' ? 'selected' : ''}>Inativo</option></select></div>
                <div class="field full"><label>Especialidades</label><input type="text" name="especialidades" value="${p?.especialidades || ''}"></div>
                <div class="field full"><label>Disponibilidade</label><input type="text" name="disponibilidade" value="${p?.disponibilidade || ''}"></div>
                <div class="field full"><label>Observações</label><textarea name="observacoes">${p?.observacoes || ''}</textarea></div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'btn-secondary' },
            { label: p ? 'Atualizar' : 'Salvar', class: 'btn-primary', close: false, onClick: overlay => {
                const form = overlay.querySelector('#formProf');
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
    const atendimentos = DB.getAtendimentos().filter(a => a.status === 'atendido' || a.status === 'cancelado' || a.status === 'nao_compareceu');
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();

    root.innerHTML = `
        <div class="page-head">
            <div><h1>Histórico de Atendimento</h1><span class="subtitle">Atendimentos já realizados ou encerrados.</span></div>
        </div>

        <div class="toolbar">
            <select class="toolbar-select" id="hiCli"><option value="">Todos os clientes</option>${clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}</select>
            <select class="toolbar-select" id="hiProf"><option value="">Todos os profissionais</option>${profissionais.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}</select>
        </div>

        <div class="table-card">
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Data</th><th>Hora</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Canal</th><th>Status</th></tr></thead>
                    <tbody id="hiBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const render = () => {
        const cId = document.getElementById('hiCli').value;
        const pId = document.getElementById('hiProf').value;
        const list = atendimentos.filter(a => (!cId || a.clienteId === cId) && (!pId || a.profissionalId === pId))
            .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
        const tbody = document.getElementById('hiBody');
        if (!list.length) tbody.innerHTML = `<tr><td colspan="7">${emptyState('Sem histórico', 'Nenhum atendimento encerrado com estes filtros.')}</td></tr>`;
        else tbody.innerHTML = list.map(a => `
            <tr>
                <td class="row-strong">${fmtDate(a.data)}</td>
                <td>${a.hora}</td>
                <td>${clienteNome(a.clienteId)}</td>
                <td>${servicoNome(a.servicoId)}</td>
                <td>${profissionalNome(a.profissionalId)}</td>
                <td><span class="chip">${canalNome(a.canalId)}</span></td>
                <td>${statusBadge(a.status)}</td>
            </tr>
        `).join('');
    };
    render();
    document.getElementById('hiCli').addEventListener('change', render);
    document.getElementById('hiProf').addEventListener('change', render);
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
        porServico[a.servicoId] = (porServico[a.servicoId] || 0) + 1;
    });

    const maxProf = Math.max(1, ...Object.values(porProf));
    const maxCanal = Math.max(1, ...Object.values(porCanal));

    const bar = (label, val, max) => `
        <div class="report-bar">
            <span class="label">${label}</span>
            <div class="track"><div class="fill" style="width:${(val / max) * 100}%"></div></div>
            <span class="value">${val}</span>
        </div>
    `;

    root.innerHTML = `
        <div class="page-head"><div><h1>Relatórios</h1><span class="subtitle">Indicadores consolidados da operação.</span></div></div>

        <div class="kpi-grid">
            <div class="kpi"><div class="kpi-label">Total de atendimentos</div><div class="kpi-value">${total}</div></div>
            <div class="kpi"><div class="kpi-label">Concluídos</div><div class="kpi-value green">${atendidos}</div></div>
            <div class="kpi"><div class="kpi-label">Cancelados</div><div class="kpi-value red">${cancelados}</div></div>
            <div class="kpi"><div class="kpi-label">Não compareceu</div><div class="kpi-value amber">${naoComp}</div></div>
            <div class="kpi"><div class="kpi-label">Agendamentos</div><div class="kpi-value blue">${agendamentos.length}</div></div>
        </div>

        <div class="table-card" style="padding:1.5rem;">
            <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:1rem;">Atendimentos por profissional</h3>
            <div class="report-bars">${Object.entries(porProf).map(([id, v]) => bar(profissionalNome(id), v, maxProf)).join('') || '<span style="color:var(--gray-500);font-size:0.85rem;">Sem dados.</span>'}</div>
        </div>

        <div class="table-card" style="padding:1.5rem;margin-top:1rem;">
            <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:1rem;">Atendimentos por canal</h3>
            <div class="report-bars">${Object.entries(porCanal).map(([id, v]) => bar(canalNome(id), v, maxCanal)).join('') || '<span style="color:var(--gray-500);font-size:0.85rem;">Sem dados.</span>'}</div>
        </div>

        <div class="table-card" style="padding:1.5rem;margin-top:1rem;">
            <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:1rem;">Serviços mais realizados</h3>
            <div class="report-bars">
                ${Object.entries(porServico).sort((a,b)=>b[1]-a[1]).map(([id, v]) => bar(servicoNome(id), v, Math.max(1, ...Object.values(porServico)))).join('') || '<span style="color:var(--gray-500);font-size:0.85rem;">Sem dados.</span>'}
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
        <div class="page-head">
            <div><h1>Configurações</h1><span class="subtitle">Horários, disponibilidade e preferências gerais.</span></div>
            <button class="btn btn-primary" id="saveConfig">Salvar alterações</button>
        </div>

        <div class="table-card" style="padding:1.75rem;">
            <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:1rem;">Horário de funcionamento</h3>
            <div class="form-grid">
                <div class="field"><label>Início</label><input type="time" id="cfgIni" value="${config.inicio}"></div>
                <div class="field"><label>Fim</label><input type="time" id="cfgFim" value="${config.fim}"></div>
                <div class="field"><label>Intervalo entre horários (min)</label><input type="number" min="5" step="5" id="cfgInt" value="${config.intervaloMin}"></div>
                <div class="field full"><label>Dias úteis</label>
                    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.35rem;">
                        ${dias.map((d, i) => `<label style="display:inline-flex;align-items:center;gap:0.35rem;background:var(--gray-100);padding:6px 10px;border-radius:6px;cursor:pointer;font-size:0.82rem;"><input type="checkbox" data-dia="${i}" ${config.diasUteis.includes(i) ? 'checked' : ''}> ${d}</label>`).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div class="table-card" style="padding:1.75rem;margin-top:1rem;">
            <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.35rem;">Dados da demonstração</h3>
            <p style="font-size:0.85rem;color:var(--gray-500);margin-bottom:1rem;">Restaurar apaga todas as alterações e recarrega o seed original.</p>
            <button class="btn btn-secondary" id="resetDemo">Restaurar dados de demonstração</button>
        </div>
    `;

    document.getElementById('saveConfig').addEventListener('click', () => {
        const ini = document.getElementById('cfgIni').value;
        const fim = document.getElementById('cfgFim').value;
        const int = Number(document.getElementById('cfgInt').value) || 30;
        const diasSel = Array.from(document.querySelectorAll('[data-dia]:checked')).map(x => Number(x.dataset.dia));
        Storage.write('config.funcionamento', { inicio: ini, fim, intervaloMin: int, diasUteis: diasSel });
        toast('Configurações salvas.', 'success');
    });

    document.getElementById('resetDemo').addEventListener('click', async () => {
        const ok = await confirmDialog('Restaurar os dados originais da demonstração? Suas alterações serão perdidas.');
        if (!ok) return;
        localStorage.removeItem(Storage.prefix + 'seeded.v1');
        location.reload();
    });
}

/* ============================================================
   START
   ============================================================ */
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) location.hash = '#/atendimentos';
    renderRoute();
});
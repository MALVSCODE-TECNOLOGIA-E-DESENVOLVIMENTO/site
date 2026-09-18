/* ============================================================
   Sistema de Atendimento · MALVSCODE
   Versão MOBILE
   ============================================================ */

const WHATSAPP_NUMBER = '5527998201003';
const WHATSAPP_MESSAGE =
    'Olá! Vi o projeto "Sistema de Atendimento" no site da MALVSCODE e gostaria de conversar sobre algo parecido.';
document.getElementById('whatsappFloat').href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/* ============================================================
   STORAGE (mesmo prefixo do desktop — compartilha dados)
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

const uid = (prefix = 'id') =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
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
   SEED (mesmo do desktop)
   ============================================================ */
function seed() {
    if (Storage.read('seeded.v6', false)) return;

    const clientes = [
        { id: 'ME-0001', nome: 'Ana Paula Ribeiro', contato: '(27) 99811-1001', email: 'ana.ribeiro@exemplo.com', observacoes: [], dataCadastro: '2025-08-14' },
        { id: 'ME-0002', nome: 'Bruno Cardoso',     contato: '(27) 99811-1002', email: 'bruno.cardoso@exemplo.com', observacoes: [], dataCadastro: '2025-09-02' },
        { id: 'ME-0003', nome: 'Carla Menezes',     contato: '(27) 99811-1003', email: 'carla.menezes@exemplo.com', observacoes: [], dataCadastro: '2025-06-20' },
        { id: 'ME-0004', nome: 'Diego Farias',      contato: '(27) 99811-1004', email: 'diego.farias@exemplo.com', observacoes: [], dataCadastro: '2025-10-05' },
        { id: 'ME-0005', nome: 'Eduarda Lopes',     contato: '(27) 99811-1005', email: 'eduarda.lopes@exemplo.com', observacoes: [], dataCadastro: '2025-11-18' }
    ];

    const profissionais = [
        { id: 'pr_1', nome: 'Mariana Alves',   contato: '(27) 99777-2001', usuario: 'mariana.alves', senha: '••••••', especialidades: 'Consultoria, Suporte', disponibilidade: 'Seg a Sex · 08h–18h', status: 'ativo', observacoes: [] },
        { id: 'pr_2', nome: 'Rafael Teixeira', contato: '(27) 99777-2002', usuario: 'rafael.teixeira', senha: '••••••', especialidades: 'Instalação, Manutenção', disponibilidade: 'Seg a Sáb · 09h–17h', status: 'ativo', observacoes: [] },
        { id: 'pr_3', nome: 'Juliana Prado',   contato: '(27) 99777-2003', usuario: 'juliana.prado', senha: '••••••', especialidades: 'Atendimento geral', disponibilidade: 'Ter a Sex · 13h–19h', status: 'ativo', observacoes: [] }
    ];

    const canais = [
        { id: 'cn_1', nome: 'WhatsApp',   tipo: 'mensagem',   status: 'ativo', observacoes: '' },
        { id: 'cn_2', nome: 'Telefone',   tipo: 'ligacao',    status: 'ativo', observacoes: '' },
        { id: 'cn_3', nome: 'E-mail',     tipo: 'email',      status: 'ativo', observacoes: '' },
        { id: 'cn_4', nome: 'Site',       tipo: 'formulario', status: 'ativo', observacoes: '' },
        { id: 'cn_5', nome: 'Presencial', tipo: 'presencial', status: 'ativo', observacoes: '' }
    ];

    const hoje = new Date();
    const isoHoje = toDateInput(hoje);
    const ontem = new Date(hoje); ontem.setDate(ontem.getDate() - 1);
    const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);
    const em3 = new Date(hoje); em3.setDate(em3.getDate() + 3);
    const em7 = new Date(hoje); em7.setDate(em7.getDate() + 7);

    const agendamentos = [
        { id: 'ag_1', codigo: 'ME-0001', clienteId: 'ME-0001', clienteNome: 'Ana Paula Ribeiro', clienteContato: '(27) 99811-1001', clienteEmail: 'ana.ribeiro@exemplo.com', servicoNome: 'Consultoria Inicial',   profissionalId: 'pr_1', data: isoHoje,            hora: '09:00', status: 'agendado',  canalId: 'cn_1', observacoes: [] },
        { id: 'ag_2', codigo: 'ME-0002', clienteId: 'ME-0003', clienteNome: 'Carla Menezes',     clienteContato: '(27) 99811-1003', clienteEmail: 'carla.menezes@exemplo.com', servicoNome: 'Instalação Padrão',     profissionalId: 'pr_2', data: isoHoje,            hora: '14:00', status: 'agendado',  canalId: 'cn_2', observacoes: [] },
        { id: 'ag_3', codigo: 'ME-0003', clienteId: 'ME-0002', clienteNome: 'Bruno Cardoso',     clienteContato: '(27) 99811-1002', clienteEmail: 'bruno.cardoso@exemplo.com', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_1', data: toDateInput(ontem), hora: '10:30', status: 'cancelado', canalId: 'cn_3', observacoes: [{ texto: 'Cliente avisou que não poderá comparecer.', autor: 'Recepção', timestamp: nowISO() }] },
        { id: 'ag_4', codigo: 'ME-0004', clienteId: 'ME-0005', clienteNome: 'Eduarda Lopes',     clienteContato: '(27) 99811-1005', clienteEmail: 'eduarda.lopes@exemplo.com', servicoNome: 'Manutenção Preventiva', profissionalId: 'pr_2', data: toDateInput(amanha),hora: '11:00', status: 'agendado',  canalId: 'cn_1', observacoes: [] },
        { id: 'ag_5', codigo: 'ME-0005', clienteId: 'ME-0001', clienteNome: 'Ana Paula Ribeiro', clienteContato: '(27) 99811-1001', clienteEmail: 'ana.ribeiro@exemplo.com', servicoNome: 'Suporte Avançado',      profissionalId: 'pr_3', data: toDateInput(em3),   hora: '15:30', status: 'agendado',  canalId: 'cn_4', observacoes: [] },
        { id: 'ag_6', codigo: 'ME-0006', clienteId: 'ME-0003', clienteNome: 'Carla Menezes',     clienteContato: '(27) 99811-1003', clienteEmail: 'carla.menezes@exemplo.com', servicoNome: 'Consultoria Inicial',   profissionalId: 'pr_1', data: toDateInput(em7),   hora: '10:00', status: 'agendado',  canalId: 'cn_1', observacoes: [] }
    ];

    const atendimentos = agendamentos.map((ag, i) => ({
        id: `at_${i+1}`,
        agendamentoId: ag.id,
        codigo: ag.codigo,
        clienteId: ag.clienteId,
        clienteNome: ag.clienteNome,
        servicoNome: ag.servicoNome,
        profissionalId: ag.profissionalId,
        data: ag.data,
        hora: ag.hora,
        canalId: ag.canalId,
        status: ag.status,
        observacoes: [...(ag.observacoes || [])]
    }));

    atendimentos.push({
        id: 'at_extra_1', agendamentoId: null, codigo: null,
        clienteId: 'ME-0003', clienteNome: 'Carla Menezes',
        servicoNome: 'Consultoria Inicial', profissionalId: 'pr_1',
        data: toDateInput(ontem), hora: '16:00', canalId: 'cn_3',
        status: 'atendido',
        observacoes: [{ texto: 'Atendimento concluído com sucesso.', autor: 'Mariana Alves', timestamp: nowISO() }]
    });

    atendimentos.push({
        id: 'at_extra_2', agendamentoId: null, codigo: null,
        clienteId: null, clienteNome: 'Visitante — atendimento avulso',
        servicoNome: 'Instalação Padrão', profissionalId: 'pr_2',
        data: toDateInput(ontem), hora: '13:00', canalId: 'cn_5',
        status: 'cancelado',
        observacoes: [{ texto: 'Cliente solicitou cancelamento.', autor: 'Recepção', timestamp: nowISO() }]
    });

    const clientesRef = clientes;
    const carla = clientesRef.find(c => c.id === 'ME-0003');
    carla.observacoes = [
        { texto: 'Atendimento concluído com sucesso.', autor: 'Mariana Alves', timestamp: nowISO() }
    ];

    const comunicacoes = [
        { id: 'co_1', clienteId: 'ME-0001', canalId: 'cn_1', assunto: 'Dúvida sobre prazos',      status: 'aguardando', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),  concluidoAt: null },
        { id: 'co_2', clienteId: 'ME-0004', canalId: 'cn_3', assunto: 'Solicitação de orçamento', status: 'aguardando', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), concluidoAt: null },
        { id: 'co_3', clienteId: 'ME-0002', canalId: 'cn_2', assunto: 'Reagendamento',            status: 'aguardando', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),  concluidoAt: null },
        { id: 'co_4', clienteId: 'ME-0005', canalId: 'cn_4', assunto: 'Confirmação de cadastro',  status: 'atendido',   createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), concluidoAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString() },
        { id: 'co_5', clienteId: 'ME-0003', canalId: 'cn_1', assunto: 'Confirmação de horário',   status: 'aguardando', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), concluidoAt: null }
    ];

    Storage.write('clientes', clientes);
    Storage.write('profissionais', profissionais);
    Storage.write('canais', canais);
    Storage.write('agendamentos', agendamentos);
    Storage.write('atendimentos', atendimentos);
    Storage.write('comunicacoes', comunicacoes);
    Storage.write('seeded.v6', true);
}
seed();

/* ============================================================
   DB
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
    { id: 'atendimentos',  label: 'Atendimentos',  icon: 'calendarCheck', primary: true },
    { id: 'agendamentos',  label: 'Agendamentos',  icon: 'clock',         primary: true },
    { id: 'canais',        label: 'Canais',        icon: 'inbox',         primary: true },
    { id: 'clientes',      label: 'Clientes',      icon: 'users',         primary: true },
    { id: 'profissionais', label: 'Profissionais', icon: 'userCheck' },
    { id: 'historico',     label: 'Histórico',     icon: 'history' },
    { id: 'relatorios',    label: 'Relatórios',    icon: 'barChart' },
    { id: 'config',        label: 'Configurações', icon: 'settings' }
];

const ICONS = {
    calendarCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 15 11 17 15 13"/></svg>`,
    clock:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    inbox:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
    users:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    userCheck:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`,
    history:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>`,
    barChart:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    settings:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
};

const ICON_PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const ICON_ALERT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ICON_CHAT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const ICON_DOC  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`;
const ICON_EDIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`;
const ICON_TRASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`;
const ICON_X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const ICON_FILTER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`;
const ICON_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICON_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const statusLabel = { pendente: 'Pendente', agendado: 'Agendado', atendido: 'Atendido', cancelado: 'Cancelado', aguardando: 'Aguardando' };
const statusBadge = s => `<span class="badge ${s}">${statusLabel[s] || s}</span>`;

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
window.currentMonth = new Date();
let currentModule = 'atendimentos';
let atendFilters  = { status: '', clienteId: '', profissionalId: '', q: '' };
let agFilters     = { status: '', clienteId: '', profissionalId: '', q: '' };
let cnFilters     = { canalId: '', status: '', clienteId: '' };
let hiFilters     = { clienteId: '', profissionalId: '', q: '' };
let cliQ          = '';

/* ============================================================
   Toast / Modal / Confirm (mobile)
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

function openModal({ title, bodyHTML, actions = [], closableByOverlay = true, isConfirm = false }) {
    const root = document.getElementById('modalRoot');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    overlay.innerHTML = `
        <div class="modal-content${isConfirm ? ' confirm-modal-content' : ''}" role="dialog" aria-modal="true">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="close-modal" data-close aria-label="Fechar">${ICON_X}</button>
            </div>
            <div class="modal-body${isConfirm ? ' confirm-modal-body' : ''}">${bodyHTML}</div>
            ${actions.length ? `<div class="modal-actions${isConfirm ? ' confirm-modal-actions' : ''}">${actions.map((a, i) =>
                `<button class="${a.class || 'secondary'}" data-action="${i}">${a.label}</button>`).join('')}</div>` : ''}
        </div>
    `;
    root.appendChild(overlay);

    const close = () => {
        overlay.style.animation = 'fadeOut 0.15s ease forwards';
        setTimeout(() => overlay.remove(), 150);
    };
    overlay.querySelector('[data-close]').addEventListener('click', close);
    overlay.addEventListener('click', e => {
        if (e.target === overlay && closableByOverlay) close();
    });

    overlay.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.action);
            const act = actions[idx];
            if (act?.onClick) {
                const keepOpen = act.onClick(overlay, close);
                if (keepOpen !== false && act.close !== false) close();
            } else {
                close();
            }
        });
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

    return { overlay, close };
}

function confirmDialog(message, { confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' } = {}) {
    return new Promise(resolve => {
        const { overlay } = openModal({
            title: '',
            closableByOverlay: false,
            isConfirm: true,
            bodyHTML: `<h3 class="confirm-modal-title">${message}</h3>`,
            actions: [
                { label: cancelLabel, class: 'confirm-nao', onClick: () => resolve(false) },
                { label: confirmLabel, class: 'confirm-sim', onClick: () => resolve(true) }
            ]
        });
    });
}

/* ============================================================
   NAV
   ============================================================ */
function renderBottomNav() {
    document.querySelectorAll('.bottom-nav-item[data-module]').forEach(el => {
        el.classList.toggle('active', el.dataset.module === currentModule);
    });
    const aguardando = DB.getComunicacoes().filter(c => c.status === 'aguardando').length;
    const badge = document.getElementById('canaisBadge');
    if (aguardando > 0) {
        badge.textContent = aguardando;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function renderDrawerNav() {
    const nav = document.getElementById('drawerNav');
    const aguardando = DB.getComunicacoes().filter(c => c.status === 'aguardando').length;
    nav.innerHTML = MODULES.map(m => {
        const badge = (m.id === 'canais' && aguardando)
            ? `<span class="drawer-nav-badge">${aguardando}</span>` : '';
        return `
            <a class="drawer-nav-item ${m.id === currentModule ? 'active' : ''}" href="#/${m.id}">
                ${ICONS[m.icon]}
                <span>${m.label}</span>
                ${badge}
            </a>
        `;
    }).join('');
}

function openDrawer() {
    document.getElementById('drawer').classList.add('open');
    document.getElementById('drawerOverlay').classList.add('open');
}
function closeDrawer() {
    document.getElementById('drawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('open');
}

/* ============================================================
   ROTEADOR
   ============================================================ */
function parseHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    return { module: raw || 'atendimentos' };
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

function renderRoute() {
    const { module } = parseHash();
    const m = MODULES.find(x => x.id === module) || MODULES[0];
    currentModule = m.id;
    document.getElementById('headerTitle').textContent = m.label;

    const headerAction = document.getElementById('headerActionBtn');
    headerAction.innerHTML = '';
    headerAction.onclick = null;
    if (m.id === 'atendimentos') {
        headerAction.style.visibility = 'hidden';
    } else if (m.id === 'agendamentos') {
        headerAction.style.visibility = 'visible';
        headerAction.innerHTML = ICON_PLUS;
        headerAction.onclick = () => openAgendamentoModal();
    } else if (m.id === 'canais') {
        headerAction.style.visibility = 'visible';
        headerAction.innerHTML = ICON_PLUS;
        headerAction.onclick = () => openComunicacaoModal();
    } else if (m.id === 'clientes') {
        headerAction.style.visibility = 'visible';
        headerAction.innerHTML = ICON_PLUS;
        headerAction.onclick = () => openClienteModal();
    } else if (m.id === 'profissionais') {
        headerAction.style.visibility = 'visible';
        headerAction.innerHTML = ICON_PLUS;
        headerAction.onclick = () => openProfissionalModal();
    } else {
        headerAction.style.visibility = 'hidden';
    }

    const main = document.getElementById('appMain');
    main.innerHTML = '';
    main.scrollTop = 0;
    RENDERERS[m.id](main);
    renderBottomNav();
    renderDrawerNav();
}

/* ============================================================
   HELPERS
   ============================================================ */
function emptyState(title, text) {
    return `<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg></div><h3>${title}</h3><p>${text}</p></div>`;
}

function monthNavHTML() {
    const ref = window.currentMonth;
    return `
        <div class="month-nav">
            <button class="month-nav-btn" data-month-prev>${ICON_LEFT}</button>
            <div class="month-nav-label">${MONTH_NAMES[ref.getMonth()]} ${ref.getFullYear()}</div>
            <button class="month-nav-btn" data-month-next>${ICON_RIGHT}</button>
        </div>
    `;
}

function bindMonthNav(root) {
    root.querySelectorAll('[data-month-prev]').forEach(b => b.addEventListener('click', () => {
        const d = new Date(window.currentMonth); d.setMonth(d.getMonth() - 1, 1);
        window.currentMonth = d; renderRoute();
    }));
    root.querySelectorAll('[data-month-next]').forEach(b => b.addEventListener('click', () => {
        const d = new Date(window.currentMonth); d.setMonth(d.getMonth() + 1, 1);
        window.currentMonth = d; renderRoute();
    }));
}

function statsHTML(items) {
    return `<div class="stats-strip">${items.map(i => `
        <div class="stat-mini ${i.tone || 'default'}">
            <div class="stat-mini-value">${i.value}</div>
            <div class="stat-mini-label">${i.label}</div>
        </div>
    `).join('')}</div>`;
}

function searchRowHTML({ id, placeholder, filtersOpen = false }) {
    return `
        <div class="search-row">
            <div class="search-input-wrap">
                ${ICON_SEARCH}
                <input type="text" id="${id}" placeholder="${placeholder}">
            </div>
            <button class="filter-toggle-btn${filtersOpen ? ' has-filters' : ''}" data-filter-toggle>
                ${ICON_FILTER}
            </button>
        </div>
    `;
}

function bindFilterToggle(root) {
    root.querySelectorAll('[data-filter-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = root.querySelector('.filters-panel');
            if (panel) panel.classList.toggle('open');
        });
    });
}

function metaRow(label, value) {
    return `<div class="card-item-meta-row"><span class="meta-label">${label}</span><span class="meta-value">${value}</span></div>`;
}

function infoRow(label, value) {
    return `<div class="info-row"><span class="info-row-label">${label}</span><span class="info-row-value">${value}</span></div>`;
}

/* ============================================================
   MÓDULO · ATENDIMENTOS
   ============================================================ */
function atendimentosFiltrados() {
    const list = DB.getAtendimentos();
    const ref = window.currentMonth;
    const { status, clienteId, profissionalId, q } = atendFilters;
    const ql = q.trim().toLowerCase();
    return list.filter(a => {
        const d = new Date(a.data + 'T00:00:00');
        if (d.getMonth() !== ref.getMonth() || d.getFullYear() !== ref.getFullYear()) return false;
        if (status && a.status !== status) return false;
        if (clienteId && a.clienteId !== clienteId) return false;
        if (profissionalId && a.profissionalId !== profissionalId) return false;
        if (ql) {
            const hay = ((a.codigo || '') + ' ' + clienteNome(a.clienteId) + ' ' + (a.clienteNome || '') + ' ' + profissionalNome(a.profissionalId) + ' ' + (a.servicoNome || '')).toLowerCase();
            if (!hay.includes(ql)) return false;
        }
        return true;
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function codigoDoAtendimento(a) {
    if (a.codigo) return a.codigo;
    if (!a.agendamentoId) return null;
    const ag = DB.getAgendamentos().find(x => x.id === a.agendamentoId);
    return ag?.codigo || null;
}
function nomeDoAtendimento(a) {
    if (a.clienteId) {
        const cl = byId(DB.getClientes(), a.clienteId);
        if (cl) return cl.nome;
    }
    return a.clienteNome || 'Atendimento avulso';
}
function temObservacoes(a) { return (a.observacoes || []).length > 0; }

function renderAtendimentos(root) {
    const list = atendimentosFiltrados();
    const total = list.length;
    const agendados = list.filter(a => a.status === 'agendado').length;
    const atendidos = list.filter(a => a.status === 'atendido').length;
    const cancelados = list.filter(a => a.status === 'cancelado').length;
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const hasFilters = !!(atendFilters.status || atendFilters.clienteId || atendFilters.profissionalId);

    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Acompanhe os atendimentos do mês. Cancelamentos são feitos aqui.</p>

            ${statsHTML([
                { value: total, label: 'Total', tone: 'default' },
                { value: agendados, label: 'Agendados', tone: 'info' },
                { value: atendidos, label: 'Atendidos', tone: 'success' },
                { value: cancelados, label: 'Cancelados', tone: 'danger' }
            ])}

            ${monthNavHTML()}

            ${searchRowHTML({ id: 'atSearch', placeholder: 'Pesquisar…', filtersOpen: hasFilters })}
            <div class="filters-panel${hasFilters ? ' open' : ''}">
                <div class="filter-field">
                    <label>Status</label>
                    <select id="atStatus">
                        <option value="">Todos</option>
                        ${['agendado','atendido','cancelado'].map(s => `<option value="${s}" ${atendFilters.status === s ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-field">
                    <label>Cliente</label>
                    <select id="atCliente">
                        <option value="">Todos</option>
                        ${clientes.map(c => `<option value="${c.id}" ${atendFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-field">
                    <label>Profissional</label>
                    <select id="atProf">
                        <option value="">Todos</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${atendFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filters-actions">
                    <button class="btn-clear-filters" id="atClearFilters">Limpar</button>
                </div>
            </div>

            <div class="cards-list" id="atCards"></div>
        </div>
    `;

    renderAtendCards();
    bindMonthNav(root);
    bindFilterToggle(root);

    document.getElementById('atSearch').value = atendFilters.q;
    document.getElementById('atSearch').addEventListener('input', e => {
        atendFilters.q = e.target.value; renderAtendCards();
    });
    document.getElementById('atStatus').addEventListener('change', e => { atendFilters.status = e.target.value; renderAtendCards(); });
    document.getElementById('atCliente').addEventListener('change', e => { atendFilters.clienteId = e.target.value; renderAtendCards(); });
    document.getElementById('atProf').addEventListener('change', e => { atendFilters.profissionalId = e.target.value; renderAtendCards(); });
    document.getElementById('atClearFilters').addEventListener('click', () => {
        atendFilters = { status: '', clienteId: '', profissionalId: '', q: '' };
        renderAtendimentos(root);
    });
}

function renderAtendCards() {
    const container = document.getElementById('atCards');
    if (!container) return;
    const list = atendimentosFiltrados();
    if (!list.length) {
        container.innerHTML = emptyState('Nenhum atendimento', 'Ajuste os filtros ou crie agendamentos para este mês.');
        return;
    }
    container.innerHTML = list.map(a => {
        const concluido = a.status === 'atendido';
        const cancelado = a.status === 'cancelado';
        const codigo = codigoDoAtendimento(a);
        const nome = nomeDoAtendimento(a);
        const cls = concluido ? 'status-atendido' : cancelado ? 'status-cancelado' : '';

        const checkbox = cancelado
            ? `<span style="width:28px;"></span>`
            : `<label class="card-item-checkbox">
                <input type="checkbox" ${concluido ? 'checked' : ''} data-toggle="${a.id}">
                <span class="cb-box"></span>
               </label>`;

        const obsBtn = temObservacoes(a)
            ? `<button class="card-action-btn alert" data-chat="${a.id}">${ICON_ALERT} Obs</button>`
            : `<button class="card-action-btn" data-chat="${a.id}">${ICON_CHAT} Obs</button>`;

        const cancelBtn = (!concluido && !cancelado)
            ? `<button class="card-action-btn danger" data-cancel="${a.id}">${ICON_X} Cancelar</button>`
            : '';

        return `
            <div class="card-item ${cls}">
                <div class="card-item-top">
                    ${checkbox}
                    <span class="card-item-id">${codigo || '—'}</span>
                    <span class="card-item-status">${statusBadge(a.status)}</span>
                </div>
                <div class="card-item-title">${nome}</div>
                <div class="card-item-subtitle">${a.servicoNome || '—'}</div>
                <div class="card-item-meta">
                    ${metaRow('Data', `${fmtDate(a.data)} · ${a.hora}`)}
                    ${metaRow('Profissional', profissionalNome(a.profissionalId))}
                </div>
                <div class="card-item-actions">
                    <button class="card-action-btn primary" data-view="${a.id}">${ICON_DOC} Ver</button>
                    ${obsBtn}
                    ${cancelBtn}
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('[data-toggle]').forEach(cb => {
        cb.addEventListener('change', e => toggleAtendimento(cb.dataset.toggle, e.target.checked));
    });
    container.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewAtendimento(b.dataset.view, 'dados')));
    container.querySelectorAll('[data-chat]').forEach(b => b.addEventListener('click', () => viewAtendimento(b.dataset.chat, 'obs')));
    container.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => cancelarAtendimento(b.dataset.cancel)));
}

function toggleAtendimento(id, checked) {
    const ats = DB.getAtendimentos();
    const idx = ats.findIndex(x => x.id === id);
    if (idx < 0) return;
    const novoStatus = checked ? 'atendido' : 'agendado';
    ats[idx].status = novoStatus;
    DB.setAtendimentos(ats);
    if (ats[idx].agendamentoId) {
        const ags = DB.getAgendamentos();
        const iag = ags.findIndex(x => x.id === ats[idx].agendamentoId);
        if (iag >= 0) { ags[iag].status = novoStatus; DB.setAgendamentos(ags); }
    }
    renderAtendCards();
    toast(checked ? 'Marcado como atendido.' : 'Reaberto.', 'success');
}

async function cancelarAtendimento(id) {
    const ats = DB.getAtendimentos();
    const idx = ats.findIndex(x => x.id === id);
    if (idx < 0) return;
    const a = ats[idx];
    const ok = await confirmDialog('Cancelar este atendimento? O status será refletido no agendamento.');
    if (!ok) return;
    ats[idx].status = 'cancelado';
    DB.setAtendimentos(ats);
    if (a.agendamentoId) {
        const ags = DB.getAgendamentos();
        const iag = ags.findIndex(x => x.id === a.agendamentoId);
        if (iag >= 0) { ags[iag].status = 'cancelado'; DB.setAgendamentos(ags); }
    }
    renderAtendCards();
    toast('Atendimento cancelado.', 'error');
}

function viewAtendimento(id, abaAtiva = 'dados') {
    const a = DB.getAtendimentos().find(x => x.id === id);
    if (!a) return;
    const codigo = codigoDoAtendimento(a);
    const nome = nomeDoAtendimento(a);
    const obs = a.observacoes || [];
    const obsHTML = obs.length
        ? obs.map(o => `
            <div class="obs-item">
                <div class="obs-item-date">${fmtDateTime(o.timestamp)} · ${o.autor || '—'}</div>
                <div class="obs-item-text">${o.texto}</div>
            </div>
        `).join('')
        : '<p style="color:var(--text-secondary);font-size:0.88rem;text-align:center;padding:1rem;">Nenhuma observação registrada.</p>';

    const { overlay } = openModal({
        title: `${codigo || '—'} · ${nome}`,
        bodyHTML: `
            <div class="tabs-nav">
                <button class="tab-btn ${abaAtiva === 'dados' ? 'active' : ''}" data-tab="dados">Dados</button>
                <button class="tab-btn ${abaAtiva === 'obs' ? 'active' : ''}" data-tab="obs">Observações</button>
            </div>
            <div class="tab-content ${abaAtiva === 'dados' ? 'active' : ''}" data-pane="dados">
                <div class="info-section">
                    <h4>Informações</h4>
                    ${infoRow('ID', codigo || '—')}
                    ${infoRow('Data', fmtDate(a.data))}
                    ${infoRow('Hora', a.hora)}
                    ${infoRow('Cliente', nome)}
                    ${infoRow('Serviço', a.servicoNome || '—')}
                    ${infoRow('Profissional', profissionalNome(a.profissionalId))}
                    ${infoRow('Status', statusBadge(a.status))}
                </div>
            </div>
            <div class="tab-content ${abaAtiva === 'obs' ? 'active' : ''}" data-pane="obs">
                <div class="info-section">
                    <h4>Observações</h4>
                    ${obsHTML}
                    <div class="obs-new">
                        <textarea id="newObs" placeholder="Escreva uma observação…"></textarea>
                        <button class="obs-add-btn" id="addObsBtn">
                            ${ICON_PLUS} Adicionar observação
                        </button>
                    </div>
                </div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'secondary' }]
    });

    overlay.querySelector('#addObsBtn').addEventListener('click', () => {
        const txt = overlay.querySelector('#newObs').value.trim();
        if (!txt) { toast('Digite uma observação.', 'warning'); return; }
        propagarObservacao({
            atendimentoId: id,
            agendamentoId: a.agendamentoId,
            clienteId: a.clienteId,
            texto: txt
        });
        toast('Observação registrada.', 'success');
        overlay.remove();
        renderRoute();
        viewAtendimento(id, 'obs');
    });
}

function propagarObservacao({ agendamentoId, atendimentoId, clienteId, texto, autor = 'Operador' }) {
    const nova = { texto, autor, timestamp: nowISO() };
    if (atendimentoId) {
        const ats = DB.getAtendimentos();
        const i = ats.findIndex(x => x.id === atendimentoId);
        if (i >= 0) { ats[i].observacoes = [...(ats[i].observacoes || []), nova]; DB.setAtendimentos(ats); }
    }
    if (agendamentoId) {
        const ags = DB.getAgendamentos();
        const i = ags.findIndex(x => x.id === agendamentoId);
        if (i >= 0) { ags[i].observacoes = [...(ags[i].observacoes || []), nova]; DB.setAgendamentos(ags); }
    }
    if (clienteId) {
        const cs = DB.getClientes();
        const i = cs.findIndex(x => x.id === clienteId);
        if (i >= 0) { cs[i].observacoes = [...(cs[i].observacoes || []), nova]; DB.setClientes(cs); }
    }
}

/* ============================================================
   MÓDULO · AGENDAMENTOS
   ============================================================ */
function agendamentosFiltrados() {
    const list = DB.getAgendamentos();
    const ref = window.currentMonth;
    const { status, clienteId, profissionalId, q } = agFilters;
    const ql = q.trim().toLowerCase();
    return list.filter(a => {
        const d = new Date(a.data + 'T00:00:00');
        if (d.getMonth() !== ref.getMonth() || d.getFullYear() !== ref.getFullYear()) return false;
        if (status && a.status !== status) return false;
        if (clienteId && a.clienteId !== clienteId) return false;
        if (profissionalId && a.profissionalId !== profissionalId) return false;
        if (ql) {
            const hay = ((a.codigo || '') + ' ' + (a.clienteNome || '') + ' ' + profissionalNome(a.profissionalId) + ' ' + (a.servicoNome || '')).toLowerCase();
            if (!hay.includes(ql)) return false;
        }
        return true;
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

function renderAgendamentos(root) {
    const list = agendamentosFiltrados();
    const agendados = list.filter(a => a.status === 'agendado').length;
    const atendidos = list.filter(a => a.status === 'atendido').length;
    const cancelados = list.filter(a => a.status === 'cancelado').length;
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const hasFilters = !!(agFilters.status || agFilters.clienteId || agFilters.profissionalId);

    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Crie e edite agendamentos. Cancelamentos são feitos em Atendimentos.</p>

            ${statsHTML([
                { value: agendados, label: 'Agendados', tone: 'info' },
                { value: atendidos, label: 'Atendidos', tone: 'success' },
                { value: cancelados, label: 'Cancelados', tone: 'danger' }
            ])}

            ${monthNavHTML()}
            ${searchRowHTML({ id: 'agSearch', placeholder: 'Pesquisar…', filtersOpen: hasFilters })}
            <div class="filters-panel${hasFilters ? ' open' : ''}">
                <div class="filter-field">
                    <label>Status</label>
                    <select id="agStatus">
                        <option value="">Todos</option>
                        ${['agendado','atendido','cancelado'].map(s => `<option value="${s}" ${agFilters.status === s ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-field">
                    <label>Cliente</label>
                    <select id="agCliente">
                        <option value="">Todos</option>
                        ${clientes.map(c => `<option value="${c.id}" ${agFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-field">
                    <label>Profissional</label>
                    <select id="agProf">
                        <option value="">Todos</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${agFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filters-actions">
                    <button class="btn-clear-filters" id="agClearFilters">Limpar</button>
                </div>
            </div>

            <div class="cards-list" id="agCards"></div>
        </div>
    `;

    renderAgendCards();
    bindMonthNav(root);
    bindFilterToggle(root);

    document.getElementById('agSearch').value = agFilters.q;
    document.getElementById('agSearch').addEventListener('input', e => { agFilters.q = e.target.value; renderAgendCards(); });
    document.getElementById('agStatus').addEventListener('change', e => { agFilters.status = e.target.value; renderAgendCards(); });
    document.getElementById('agCliente').addEventListener('change', e => { agFilters.clienteId = e.target.value; renderAgendCards(); });
    document.getElementById('agProf').addEventListener('change', e => { agFilters.profissionalId = e.target.value; renderAgendCards(); });
    document.getElementById('agClearFilters').addEventListener('click', () => {
        agFilters = { status: '', clienteId: '', profissionalId: '', q: '' };
        renderAgendamentos(root);
    });
}

function renderAgendCards() {
    const container = document.getElementById('agCards');
    if (!container) return;
    const list = agendamentosFiltrados();
    if (!list.length) {
        container.innerHTML = emptyState('Nenhum agendamento', 'Crie um novo agendamento ou ajuste os filtros.');
        return;
    }
    container.innerHTML = list.map(a => {
        const nome = a.clienteId
            ? (byId(DB.getClientes(), a.clienteId)?.nome || a.clienteNome || '—')
            : (a.clienteNome || '—');
        const concluido = a.status === 'atendido';
        const cancelado = a.status === 'cancelado';
        const cls = concluido ? 'status-atendido' : cancelado ? 'status-cancelado' : '';

        const editBtn = !cancelado
            ? `<button class="card-action-btn primary" data-edit="${a.id}">${ICON_EDIT} Editar</button>`
            : '';

        return `
            <div class="card-item ${cls}">
                <div class="card-item-top">
                    <span class="card-item-id">${a.codigo || '—'}</span>
                    <span class="card-item-status">${statusBadge(a.status)}</span>
                </div>
                <div class="card-item-title">${nome}</div>
                <div class="card-item-subtitle">${a.servicoNome || '—'}</div>
                <div class="card-item-meta">
                    ${metaRow('Data', `${fmtDate(a.data)} · ${a.hora}`)}
                    ${metaRow('Profissional', profissionalNome(a.profissionalId))}
                    ${metaRow('Canal', canalNome(a.canalId))}
                </div>
                <div class="card-item-actions">
                    ${editBtn}
                </div>
            </div>
        `;
    }).join('');
    container.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openAgendamentoModal(b.dataset.edit)));
}

function openAgendamentoModal(editId) {
    const profissionais = DB.getProfissionais();
    const canais = DB.getCanais().filter(c => c.status === 'ativo');
    const a = editId ? DB.getAgendamentos().find(x => x.id === editId) : null;
    const slots = gerarSlots('08:00', '18:00', 30);
    const nomeAtual    = a?.clienteNome || (a?.clienteId ? (byId(DB.getClientes(), a.clienteId)?.nome || '') : '');
    const contatoAtual = a?.clienteContato || (a?.clienteId ? (byId(DB.getClientes(), a.clienteId)?.contato || '') : '');
    const emailAtual   = a?.clienteEmail || (a?.clienteId ? (byId(DB.getClientes(), a.clienteId)?.email || '') : '');

    const { overlay } = openModal({
        title: a ? `Editar ${a.codigo}` : 'Novo agendamento',
        bodyHTML: `
            <form id="formAg">
                <div class="form-group"><label>Nome do cliente <span class="req">*</span></label><input type="text" name="clienteNome" required value="${nomeAtual}" placeholder="Nome do cliente"></div>
                <div class="form-group"><label>Contato</label><input type="text" name="clienteContato" value="${contatoAtual}" placeholder="Telefone/WhatsApp"></div>
                <div class="form-group"><label>E-mail</label><input type="email" name="clienteEmail" value="${emailAtual}" placeholder="email@exemplo.com"></div>
                <div class="form-group"><label>Serviço <span class="req">*</span></label><input type="text" name="servicoNome" required value="${a?.servicoNome || ''}" placeholder="Ex: Consultoria Inicial"></div>
                <div class="form-group"><label>Profissional <span class="req">*</span></label>
                    <select name="profissionalId" required id="agProfSel">
                        <option value="">Selecione</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${a?.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Canal</label>
                    <select name="canalId">
                        <option value="">Selecione</option>
                        ${canais.map(c => `<option value="${c.id}" ${a?.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Data <span class="req">*</span></label><input type="date" name="data" required id="agData" value="${a?.data || todayInput()}"></div>
                <div class="form-group"><label>Horário <span class="req">*</span></label>
                    <div class="slots-grid" id="agSlots"></div>
                    <input type="hidden" name="hora" id="agHora" value="${a?.hora || ''}">
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: a ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: async (ov, close) => {
                const form = ov.querySelector('#formAg');
                const hora = ov.querySelector('#agHora').value;
                if (!hora) { toast('Selecione um horário.', 'warning'); return false; }
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                data.hora = hora;
                if (conflitoHorario(data.profissionalId, data.data, data.hora, a?.id)) {
                    toast('Horário indisponível.', 'error'); return false;
                }

                let clienteEncontrado = encontrarClienteExistente({ nome: data.clienteNome, contato: data.clienteContato, email: data.clienteEmail });
                let clienteId = clienteEncontrado ? clienteEncontrado.id : null;
                let clienteAvulso = false;
                if (!clienteEncontrado) {
                    const querCadastrar = await confirmDialog('Deseja cadastrar este cliente?', { confirmLabel: 'Sim', cancelLabel: 'Não' });
                    if (querCadastrar) {
                        const codigoAg = a?.codigo || nextAgendamentoCodigo();
                        const clientes = DB.getClientes();
                        clientes.push({
                            id: codigoAg,
                            nome: data.clienteNome.trim(),
                            contato: (data.clienteContato || '').trim(),
                            email: (data.clienteEmail || '').trim(),
                            observacoes: [],
                            dataCadastro: todayInput()
                        });
                        DB.setClientes(clientes);
                        clienteId = codigoAg;
                    } else clienteAvulso = true;
                }

                const list = DB.getAgendamentos();
                const ats = DB.getAtendimentos();
                if (a) {
                    const idx = list.findIndex(x => x.id === a.id);
                    list[idx] = { ...list[idx], ...data, clienteId, clienteNome: data.clienteNome, clienteContato: data.clienteContato, clienteEmail: data.clienteEmail };
                    const iat = ats.findIndex(x => x.agendamentoId === a.id);
                    if (iat >= 0) {
                        ats[iat] = { ...ats[iat], clienteId, clienteNome: data.clienteNome, servicoNome: data.servicoNome, profissionalId: data.profissionalId, canalId: data.canalId, data: data.data, hora: data.hora };
                    }
                } else {
                    const codigo = nextAgendamentoCodigo();
                    const novoId = uid('ag');
                    list.push({ id: novoId, codigo, clienteId, clienteNome: data.clienteNome, clienteContato: data.clienteContato, clienteEmail: data.clienteEmail, clienteAvulso, servicoNome: data.servicoNome, profissionalId: data.profissionalId, canalId: data.canalId, data: data.data, hora: data.hora, status: 'agendado', observacoes: [] });
                    ats.push({ id: uid('at'), agendamentoId: novoId, codigo, clienteId, clienteNome: data.clienteNome, servicoNome: data.servicoNome, profissionalId: data.profissionalId, canalId: data.canalId, data: data.data, hora: data.hora, status: 'agendado', observacoes: [] });
                }
                DB.setAgendamentos(list);
                DB.setAtendimentos(ats);
                toast(a ? 'Agendamento atualizado.' : 'Agendamento criado.', 'success');
                close();
                renderRoute();
                return false;
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
        const ags = DB.getAgendamentos().filter(x => x.status !== 'cancelado' && x.id !== a?.id);
        const ats = DB.getAtendimentos().filter(x => x.status !== 'cancelado' && x.status !== 'atendido' && x.agendamentoId !== a?.id);
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
        slotsEl.querySelectorAll('.slot').forEach(b => b.addEventListener('click', () => {
            horaInput.value = b.dataset.slot; renderSlots();
        }));
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
    const ats = DB.getAtendimentos().filter(a => a.status !== 'cancelado' && a.status !== 'atendido');
    return ags.some(a => a.profissionalId === profissionalId && a.data === data && a.hora === hora) ||
           ats.some(a => a.profissionalId === profissionalId && a.data === data && a.hora === hora);
}

function encontrarClienteExistente({ nome, contato, email }) {
    const clientes = DB.getClientes();
    const n = (nome || '').trim().toLowerCase();
    const c = (contato || '').trim().toLowerCase();
    const e = (email || '').trim().toLowerCase();
    if (n) { const x = clientes.find(cl => (cl.nome || '').trim().toLowerCase() === n); if (x) return x; }
    if (c) { const x = clientes.find(cl => (cl.contato || '').trim().toLowerCase() === c); if (x) return x; }
    if (e) { const x = clientes.find(cl => (cl.email || '').trim().toLowerCase() === e); if (x) return x; }
    return null;
}

function nextAgendamentoCodigo() {
    const list = DB.getAgendamentos();
    let max = 0;
    list.forEach(a => {
        const m = String(a.codigo || '').match(/ME-(\d+)/);
        if (m) max = Math.max(max, Number(m[1]));
    });
    return `ME-${String(max + 1).padStart(4, '0')}`;
}

/* ============================================================
   MÓDULO · CANAIS
   ============================================================ */
function filtrarComunicacoes() {
    const ref = window.currentMonth;
    return DB.getComunicacoes()
        .filter(c => {
            const d = new Date(c.createdAt);
            if (d.getMonth() !== ref.getMonth() || d.getFullYear() !== ref.getFullYear()) return false;
            if (cnFilters.canalId && c.canalId !== cnFilters.canalId) return false;
            if (cnFilters.status && c.status !== cnFilters.status) return false;
            if (cnFilters.clienteId && c.clienteId !== cnFilters.clienteId) return false;
            return true;
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function renderCanais(root) {
    const todas = DB.getComunicacoes();
    const filtradas = filtrarComunicacoes();
    const total = todas.length;
    const aguardando = todas.filter(c => c.status === 'aguardando').length;
    const atendidas = todas.filter(c => c.status === 'atendido').length;
    const canais = DB.getCanais();
    const clientes = DB.getClientes();
    const hasFilters = !!(cnFilters.canalId || cnFilters.status || cnFilters.clienteId);

    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Solicitações recebidas por canais.</p>

            ${statsHTML([
                { value: total, label: 'Total', tone: 'default' },
                { value: aguardando, label: 'Aguardando', tone: 'danger' },
                { value: atendidas, label: 'Atendidos', tone: 'success' }
            ])}

            ${monthNavHTML()}
            <div class="search-row">
                <div class="search-input-wrap">
                    ${ICON_SEARCH}
                    <input type="text" id="cnSearch" placeholder="Pesquisar…">
                </div>
                <button class="filter-toggle-btn${hasFilters ? ' has-filters' : ''}" data-filter-toggle>
                    ${ICON_FILTER}
                </button>
            </div>
            <div class="filters-panel${hasFilters ? ' open' : ''}">
                <div class="filter-field">
                    <label>Canal</label>
                    <select id="cnCanal">
                        <option value="">Todos</option>
                        ${canais.map(c => `<option value="${c.id}" ${cnFilters.canalId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-field">
                    <label>Status</label>
                    <select id="cnStatus">
                        <option value="">Todos</option>
                        <option value="aguardando" ${cnFilters.status === 'aguardando' ? 'selected' : ''}>Aguardando</option>
                        <option value="atendido"   ${cnFilters.status === 'atendido'   ? 'selected' : ''}>Atendido</option>
                    </select>
                </div>
                <div class="filter-field">
                    <label>Cliente</label>
                    <select id="cnCliente">
                        <option value="">Todos</option>
                        ${clientes.map(c => `<option value="${c.id}" ${cnFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filters-actions">
                    <button class="btn-clear-filters" id="cnClearFilters">Limpar</button>
                </div>
            </div>

            <div class="cards-list" id="cnCards"></div>
        </div>
    `;

    renderCanaisCards(filtradas);
    bindMonthNav(root);
    bindFilterToggle(root);

    document.getElementById('cnSearch').addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        renderCanaisCards(filtrarComunicacoes().filter(c =>
            (c.assunto + ' ' + clienteNome(c.clienteId)).toLowerCase().includes(q)
        ));
    });
    document.getElementById('cnCanal').addEventListener('change', e => { cnFilters.canalId = e.target.value; renderCanaisCards(filtrarComunicacoes()); });
    document.getElementById('cnStatus').addEventListener('change', e => { cnFilters.status = e.target.value; renderCanaisCards(filtrarComunicacoes()); });
    document.getElementById('cnCliente').addEventListener('change', e => { cnFilters.clienteId = e.target.value; renderCanaisCards(filtrarComunicacoes()); });
    document.getElementById('cnClearFilters').addEventListener('click', () => {
        cnFilters = { canalId: '', status: '', clienteId: '' };
        renderCanais(root);
    });
}

function renderCanaisCards(comunicacoes) {
    const container = document.getElementById('cnCards');
    if (!container) return;
    if (!comunicacoes.length) {
        container.innerHTML = emptyState('Sem comunicações', 'Nenhuma comunicação com estes filtros.');
        return;
    }
    container.innerHTML = comunicacoes.map(c => {
        const concluido = c.status === 'atendido';
        const cls = concluido ? 'status-cancelado' : '';
        const checkbox = `
            <label class="card-item-checkbox">
                <input type="checkbox" ${concluido ? 'checked' : ''} data-cn-toggle="${c.id}">
                <span class="cb-box"></span>
            </label>`;
        return `
            <div class="card-item ${cls}">
                <div class="card-item-top">
                    ${checkbox}
                    <span class="card-item-id">${fmtDateTime(c.createdAt)}</span>
                    <span class="card-item-status">${statusBadge(c.status)}</span>
                </div>
                <div class="card-item-title">${clienteNome(c.clienteId)}</div>
                <div class="card-item-subtitle">${c.assunto}</div>
                <div class="card-item-meta">
                    ${metaRow('Canal', canalNome(c.canalId))}
                    ${c.concluidoAt ? metaRow('Concluído', fmtDateTime(c.concluidoAt)) : ''}
                </div>
                <div class="card-item-actions">
                    <button class="card-action-btn primary" data-view="${c.id}">${ICON_DOC} Ver</button>
                    <button class="card-action-btn" data-edit="${c.id}">${ICON_EDIT} Editar</button>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('[data-cn-toggle]').forEach(cb => {
        cb.addEventListener('change', e => {
            const id = cb.dataset.cnToggle;
            if (e.target.checked) { cb.checked = false; confirmarConclusao(id); }
            else {
                const list = DB.getComunicacoes();
                const idx = list.findIndex(x => x.id === id);
                if (idx >= 0) {
                    list[idx].status = 'aguardando'; list[idx].concluidoAt = null;
                    DB.setComunicacoes(list);
                    renderCanaisCards(filtrarComunicacoes());
                    toast('Comunicação reaberta.', 'warning');
                }
            }
        });
    });
    container.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewComunicacao(b.dataset.view)));
    container.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openComunicacaoModal(b.dataset.edit)));
}

function confirmarConclusao(id) {
    confirmDialog('Confirmar o atendimento deste contato?', { confirmLabel: 'Confirmar' })
    .then(confirmado => {
        if (!confirmado) return;
        const list = DB.getComunicacoes();
        const idx = list.findIndex(x => x.id === id);
        if (idx < 0) return;
        list[idx].status = 'atendido';
        list[idx].concluidoAt = nowISO();
        DB.setComunicacoes(list);
        renderCanaisCards(filtrarComunicacoes());
        renderBottomNav();
        toast('Contato marcado como atendido.', 'success');
    });
}

function viewComunicacao(id) {
    const c = DB.getComunicacoes().find(x => x.id === id);
    if (!c) return;
    openModal({
        title: c.assunto,
        bodyHTML: `
            <div class="info-section">
                <h4>Informações</h4>
                ${infoRow('Cliente', clienteNome(c.clienteId))}
                ${infoRow('Canal', canalNome(c.canalId))}
                ${infoRow('Assunto', c.assunto)}
                ${infoRow('Recebida em', fmtDateTime(c.createdAt))}
                ${infoRow('Concluída em', c.concluidoAt ? fmtDateTime(c.concluidoAt) : '—')}
                ${infoRow('Status', statusBadge(c.status))}
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
            <form id="formCom">
                <div class="form-group"><label>Cliente <span class="req">*</span></label>
                    <select name="clienteId" required>
                        <option value="">Selecione</option>
                        ${clientes.map(cl => `<option value="${cl.id}" ${c?.clienteId === cl.id ? 'selected' : ''}>${cl.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Canal <span class="req">*</span></label>
                    <select name="canalId" required>
                        <option value="">Selecione</option>
                        ${canais.map(cn => `<option value="${cn.id}" ${c?.canalId === cn.id ? 'selected' : ''}>${cn.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Assunto <span class="req">*</span></label><input type="text" name="assunto" required value="${c?.assunto || ''}"></div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: (ov, close) => {
                const form = ov.querySelector('#formCom');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getComunicacoes();
                if (c) {
                    const idx = list.findIndex(x => x.id === c.id);
                    list[idx] = { ...list[idx], clienteId: data.clienteId, canalId: data.canalId, assunto: data.assunto };
                } else {
                    list.push({ id: uid('co'), clienteId: data.clienteId, canalId: data.canalId, assunto: data.assunto, status: 'aguardando', createdAt: nowISO(), concluidoAt: null });
                }
                DB.setComunicacoes(list);
                toast(c ? 'Comunicação atualizada.' : 'Comunicação registrada.', 'success');
                close();
                renderRoute();
                return false;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · CLIENTES
   ============================================================ */
function renderClientes(root) {
    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Cadastro e contato dos clientes.</p>
            <div class="search-row">
                <div class="search-input-wrap">
                    ${ICON_SEARCH}
                    <input type="text" id="cliSearch" placeholder="Buscar por nome, ID, contato ou e-mail…" value="${cliQ}">
                </div>
            </div>
            <div class="cards-list" id="cliCards"></div>
        </div>
    `;

    const render = () => {
        const container = document.getElementById('cliCards');
        const ql = cliQ.trim().toLowerCase();
        const list = DB.getClientes().filter(c => {
            if (!ql) return true;
            return (c.id || '').toLowerCase().includes(ql)
                || c.nome.toLowerCase().includes(ql)
                || (c.contato || '').toLowerCase().includes(ql)
                || (c.email || '').toLowerCase().includes(ql);
        });
        if (!list.length) {
            container.innerHTML = emptyState('Nenhum cliente', 'Cadastre o primeiro cliente.');
            return;
        }
        const atendimentos = DB.getAtendimentos();
        container.innerHTML = list.map(c => {
            const ats = atendimentos.filter(a => a.clienteId === c.id && a.status === 'atendido');
            const ultimo = ats.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora))[0];
            return `
                <div class="card-item">
                    <div class="card-item-top">
                        <span class="card-item-id">${c.id}</span>
                    </div>
                    <div class="card-item-title">${c.nome}</div>
                    <div class="card-item-meta">
                        ${c.contato ? metaRow('Contato', c.contato) : ''}
                        ${c.email ? metaRow('E-mail', c.email) : ''}
                        ${metaRow('Cadastro', fmtDate(c.dataCadastro))}
                        ${ultimo ? metaRow('Último atend.', fmtDate(ultimo.data)) : ''}
                    </div>
                    <div class="card-item-actions">
                        <button class="card-action-btn primary" data-hist="${c.id}">${ICON_DOC} Histórico</button>
                        <button class="card-action-btn" data-edit="${c.id}">${ICON_EDIT} Editar</button>
                        <button class="card-action-btn danger" data-del="${c.id}">${ICON_TRASH}</button>
                    </div>
                </div>
            `;
        }).join('');
        container.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openClienteModal(b.dataset.edit)));
        container.querySelectorAll('[data-hist]').forEach(b => b.addEventListener('click', () => viewHistoricoCliente(b.dataset.hist)));
        container.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => excluirCliente(b.dataset.del)));
    };

    render();
    document.getElementById('cliSearch').addEventListener('input', e => { cliQ = e.target.value; render(); });
}

function openClienteModal(editId) {
    const c = editId ? DB.getClientes().find(x => x.id === editId) : null;
    openModal({
        title: c ? 'Editar cliente' : 'Novo cliente',
        bodyHTML: `
            <form id="formCli">
                <div class="form-group"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${c?.nome || ''}"></div>
                <div class="form-group"><label>Contato</label><input type="text" name="contato" value="${c?.contato || ''}" placeholder="Telefone/WhatsApp"></div>
                <div class="form-group"><label>E-mail</label><input type="email" name="email" value="${c?.email || ''}"></div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: c ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: (ov, close) => {
                const form = ov.querySelector('#formCli');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getClientes();
                if (c) {
                    const i = list.findIndex(x => x.id === c.id);
                    list[i] = { ...list[i], ...data };
                } else {
                    const codigo = nextAgendamentoCodigo();
                    list.push({ id: codigo, ...data, observacoes: [], dataCadastro: todayInput() });
                }
                DB.setClientes(list);
                toast(c ? 'Cliente atualizado.' : 'Cliente criado.', 'success');
                close();
                renderRoute();
                return false;
            }}
        ]
    });
}

async function excluirCliente(id) {
    const ok = await confirmDialog('Excluir este cliente?');
    if (!ok) return;
    DB.setClientes(DB.getClientes().filter(x => x.id !== id));
    renderRoute();
    toast('Cliente excluído.', 'error');
}

function viewHistoricoCliente(id) {
    const c = DB.getClientes().find(x => x.id === id);
    if (!c) return;
    const ats = DB.getAtendimentos().filter(a => a.clienteId === id).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
    const coms = DB.getComunicacoes().filter(x => x.clienteId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const atsHTML = ats.length
        ? ats.map(a => `<div class="obs-item"><div class="obs-item-date">${fmtDate(a.data)} · ${a.hora}</div><div class="obs-item-text"><strong>${a.servicoNome || '—'}</strong><br>${profissionalNome(a.profissionalId)} · ${statusLabel[a.status] || a.status}</div></div>`).join('')
        : '<p style="color:var(--text-secondary);font-size:0.88rem;text-align:center;padding:1rem;">Sem atendimentos.</p>';
    const comsHTML = coms.length
        ? coms.map(c => `<div class="obs-item"><div class="obs-item-date">${fmtDateTime(c.createdAt)}</div><div class="obs-item-text"><strong>${c.assunto}</strong><br>${canalNome(c.canalId)} · ${statusLabel[c.status] || c.status}</div></div>`).join('')
        : '<p style="color:var(--text-secondary);font-size:0.88rem;text-align:center;padding:1rem;">Sem comunicações.</p>';

    openModal({
        title: `Histórico · ${c.nome}`,
        bodyHTML: `
            <div class="tabs-nav">
                <button class="tab-btn active" data-tab="at">Atendimentos</button>
                <button class="tab-btn" data-tab="co">Comunicações</button>
                <button class="tab-btn" data-tab="info">Dados</button>
            </div>
            <div class="tab-content active" data-pane="at">${atsHTML}</div>
            <div class="tab-content" data-pane="co">${comsHTML}</div>
            <div class="tab-content" data-pane="info">
                <div class="info-section">
                    <h4>Dados</h4>
                    ${infoRow('ID', c.id)}
                    ${infoRow('Nome', c.nome)}
                    ${infoRow('Contato', c.contato || '—')}
                    ${infoRow('E-mail', c.email || '—')}
                    ${infoRow('Cadastro', fmtDate(c.dataCadastro))}
                </div>
            </div>
        `,
        actions: [{ label: 'Fechar', class: 'secondary' }]
    });
}

/* ============================================================
   MÓDULO · PROFISSIONAIS
   ============================================================ */
function renderProfissionais(root) {
    const list = DB.getProfissionais();
    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Responsáveis pelos atendimentos.</p>
            <div class="cards-list" id="profCards"></div>
        </div>
    `;
    const container = document.getElementById('profCards');
    if (!list.length) {
        container.innerHTML = emptyState('Sem profissionais', 'Cadastre o primeiro.');
        return;
    }
    container.innerHTML = list.map(p => `
        <div class="card-item">
            <div class="card-item-top">
                <span class="card-item-status">${p.status === 'ativo' ? '<span class="badge atendido">Ativo</span>' : '<span class="badge cancelado">Inativo</span>'}</span>
            </div>
            <div class="card-item-title">${p.nome}</div>
            <div class="card-item-subtitle">${p.especialidades || '—'}</div>
            <div class="card-item-meta">
                ${p.usuario ? metaRow('Usuário', p.usuario) : ''}
                ${p.contato ? metaRow('Contato', p.contato) : ''}
                ${p.disponibilidade ? metaRow('Disponib.', p.disponibilidade) : ''}
            </div>
            <div class="card-item-actions">
                <button class="card-action-btn primary" data-edit="${p.id}">${ICON_EDIT} Editar</button>
            </div>
        </div>
    `).join('');
    container.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openProfissionalModal(b.dataset.edit)));
}

function openProfissionalModal(editId) {
    const p = editId ? DB.getProfissionais().find(x => x.id === editId) : null;
    openModal({
        title: p ? 'Editar profissional' : 'Novo profissional',
        bodyHTML: `
            <form id="formProf">
                <div class="form-group"><label>Nome <span class="req">*</span></label><input type="text" name="nome" required value="${p?.nome || ''}"></div>
                <div class="form-group"><label>Usuário</label><input type="text" name="usuario" value="${p?.usuario || ''}"></div>
                <div class="form-group"><label>Contato</label><input type="text" name="contato" value="${p?.contato || ''}"></div>
                <div class="form-group"><label>Especialidades</label><input type="text" name="especialidades" value="${p?.especialidades || ''}"></div>
                <div class="form-group"><label>Disponibilidade</label><input type="text" name="disponibilidade" value="${p?.disponibilidade || ''}"></div>
                <div class="form-group"><label>Status</label>
                    <select name="status">
                        <option value="ativo" ${p?.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${p?.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </div>
            </form>
        `,
        actions: [
            { label: 'Cancelar', class: 'secondary' },
            { label: p ? 'Atualizar' : 'Salvar', class: 'success', close: false, onClick: (ov, close) => {
                const form = ov.querySelector('#formProf');
                if (!form.reportValidity()) return false;
                const data = Object.fromEntries(new FormData(form).entries());
                const list = DB.getProfissionais();
                if (p) {
                    const i = list.findIndex(x => x.id === p.id);
                    list[i] = { ...list[i], ...data };
                } else {
                    list.push({ id: uid('pr'), ...data, observacoes: [] });
                }
                DB.setProfissionais(list);
                toast(p ? 'Profissional atualizado.' : 'Profissional criado.', 'success');
                close();
                renderRoute();
                return false;
            }}
        ]
    });
}

/* ============================================================
   MÓDULO · HISTÓRICO
   ============================================================ */
function historicoFiltrado() {
    const ref = window.currentMonth;
    return DB.getAtendimentos()
        .filter(a => a.clienteId && byId(DB.getClientes(), a.clienteId))
        .filter(a => a.status === 'atendido' || a.status === 'cancelado')
        .filter(a => {
            const d = new Date(a.data + 'T00:00:00');
            return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
        })
        .filter(a => (!hiFilters.clienteId || a.clienteId === hiFilters.clienteId))
        .filter(a => (!hiFilters.profissionalId || a.profissionalId === hiFilters.profissionalId))
        .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
}

function renderHistorico(root) {
    const clientes = DB.getClientes();
    const profissionais = DB.getProfissionais();
    const hasFilters = !!(hiFilters.clienteId || hiFilters.profissionalId);

    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Atendimentos encerrados no mês.</p>
            ${monthNavHTML()}
            <div class="search-row">
                <div class="search-input-wrap">${ICON_SEARCH}<input type="text" id="hiSearch" placeholder="Pesquisar…"></div>
                <button class="filter-toggle-btn${hasFilters ? ' has-filters' : ''}" data-filter-toggle>${ICON_FILTER}</button>
            </div>
            <div class="filters-panel${hasFilters ? ' open' : ''}">
                <div class="filter-field"><label>Cliente</label>
                    <select id="hiCli"><option value="">Todos</option>
                        ${clientes.map(c => `<option value="${c.id}" ${hiFilters.clienteId === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-field"><label>Profissional</label>
                    <select id="hiProf"><option value="">Todos</option>
                        ${profissionais.map(p => `<option value="${p.id}" ${hiFilters.profissionalId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="filters-actions"><button class="btn-clear-filters" id="hiClear">Limpar</button></div>
            </div>
            <div class="cards-list" id="hiCards"></div>
        </div>
    `;

    renderHistoricoCards();
    bindMonthNav(root);
    bindFilterToggle(root);

    document.getElementById('hiSearch').addEventListener('input', e => { hiFilters.q = e.target.value; renderHistoricoCards(); });
    document.getElementById('hiCli').addEventListener('change', e => { hiFilters.clienteId = e.target.value; renderHistoricoCards(); });
    document.getElementById('hiProf').addEventListener('change', e => { hiFilters.profissionalId = e.target.value; renderHistoricoCards(); });
    document.getElementById('hiClear').addEventListener('click', () => {
        hiFilters = { clienteId: '', profissionalId: '', q: '' };
        renderHistorico(root);
    });
}

function renderHistoricoCards() {
    const container = document.getElementById('hiCards');
    if (!container) return;
    let list = historicoFiltrado();
    if (hiFilters.q) {
        const ql = hiFilters.q.toLowerCase();
        list = list.filter(a => (clienteNome(a.clienteId) + ' ' + (a.servicoNome || '')).toLowerCase().includes(ql));
    }
    if (!list.length) {
        container.innerHTML = emptyState('Sem histórico', 'Nenhum atendimento encerrado.');
        return;
    }
    container.innerHTML = list.map(a => {
        const codigo = codigoDoAtendimento(a) || '—';
        const obsBtn = temObservacoes(a)
            ? `<button class="card-action-btn alert" data-chat="${a.id}">${ICON_ALERT} Obs</button>`
            : `<button class="card-action-btn" data-chat="${a.id}">${ICON_CHAT} Obs</button>`;
        return `
            <div class="card-item">
                <div class="card-item-top">
                    <span class="card-item-id">${codigo}</span>
                    <span class="card-item-status">${statusBadge(a.status)}</span>
                </div>
                <div class="card-item-title">${clienteNome(a.clienteId)}</div>
                <div class="card-item-subtitle">${a.servicoNome || '—'}</div>
                <div class="card-item-meta">
                    ${metaRow('Data', `${fmtDate(a.data)} · ${a.hora}`)}
                    ${metaRow('Profissional', profissionalNome(a.profissionalId))}
                    ${metaRow('Canal', canalNome(a.canalId))}
                </div>
                <div class="card-item-actions">
                    ${obsBtn}
                </div>
            </div>
        `;
    }).join('');
    container.querySelectorAll('[data-chat]').forEach(b => b.addEventListener('click', () => viewAtendimento(b.dataset.chat, 'obs')));
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
    const semCadastro = atendimentos.filter(a => !a.clienteId).length;

    const porProf = {}, porCanal = {}, porServico = {};
    atendimentos.forEach(a => {
        porProf[a.profissionalId] = (porProf[a.profissionalId] || 0) + 1;
        porCanal[a.canalId] = (porCanal[a.canalId] || 0) + 1;
        const s = a.servicoNome || 'Outros';
        porServico[s] = (porServico[s] || 0) + 1;
    });

    const renderBars = (obj, labelFn) => {
        const entries = Object.entries(obj).sort((a, b) => b[1] - a[1]);
        if (!entries.length) return '<p style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:0.5rem;">Sem dados.</p>';
        const max = Math.max(...entries.map(([, v]) => v));
        return entries.map(([k, v]) => `
            <div class="report-row">
                <div class="report-row-head">
                    <span class="report-row-label">${labelFn(k)}</span>
                    <span class="report-row-value">${v}</span>
                </div>
                <div class="report-row-track"><div class="report-row-fill" style="width:${(v / max) * 100}%"></div></div>
            </div>
        `).join('');
    };

    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Indicadores consolidados.</p>
            ${statsHTML([
                { value: total, label: 'Atendimentos', tone: 'default' },
                { value: atendidos, label: 'Concluídos', tone: 'success' },
                { value: cancelados, label: 'Cancelados', tone: 'danger' },
                { value: semCadastro, label: 'S/ cadastro', tone: 'warning' }
            ])}
            <div class="report-section">
                <h4>Atendimentos por profissional</h4>
                ${renderBars(porProf, profissionalNome)}
            </div>
            <div class="report-section">
                <h4>Atendimentos por canal</h4>
                ${renderBars(porCanal, canalNome)}
            </div>
            <div class="report-section">
                <h4>Serviços mais realizados</h4>
                ${renderBars(porServico, s => s)}
            </div>
        </div>
    `;
}

/* ============================================================
   MÓDULO · CONFIGURAÇÕES
   ============================================================ */
function renderConfig(root) {
    root.innerHTML = `
        <div class="page">
            <p class="page-subtitle">Preferências gerais e restauração.</p>
            <div class="info-section">
                <h4>Dados da demonstração</h4>
                <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:1rem;line-height:1.6;">Restaurar apaga todas as alterações feitas nesta demonstração e recarrega os dados iniciais.</p>
                <button class="obs-add-btn danger" id="resetDemo" style="background:var(--danger-color);">Restaurar dados</button>
            </div>
        </div>
    `;
    document.getElementById('resetDemo').addEventListener('click', async () => {
        const ok = await confirmDialog('Restaurar os dados originais? Suas alterações serão perdidas.', { confirmLabel: 'Restaurar' });
        if (!ok) return;
        Storage.clearAll();
        location.reload();
    });
}

/* ============================================================
   START
   ============================================================ */
function setupIntro() {
    document.getElementById('startBtn').addEventListener('click', () => {
        document.getElementById('introScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        if (!location.hash) location.hash = '#/atendimentos';
        renderRoute();
    });
}

function setupUI() {
    document.getElementById('headerMenuBtn').addEventListener('click', openDrawer);
    document.getElementById('drawerCloseBtn').addEventListener('click', closeDrawer);
    document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);
    document.getElementById('navMoreBtn').addEventListener('click', openDrawer);
    document.querySelectorAll('.drawer-nav-item').forEach(a => a.addEventListener('click', closeDrawer));
}

window.addEventListener('hashchange', () => {
    const app = document.getElementById('appScreen');
    if (app && !app.classList.contains('hidden')) renderRoute();
});

window.addEventListener('DOMContentLoaded', () => {
    setupIntro();
    setupUI();
});

/* ============================================================
   Sistema de Atendimento · MALVSCODE
   ============================================================ */

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
   SEED (v6)
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
    { id: 'profissionais', label: 'Profissionais',            short: 'Profissionais', icon: 'userCheck' },
    { id: 'atendimentos',  label: 'Controle de Atendimento',  short: 'Atendimentos',  icon: 'calendarCheck' },
    { id: 'agendamentos',  label: 'Agendamentos',             short: 'Agendamentos',  icon: 'clock' },
    { id: 'canais',        label: 'Canais de Atendimento',    short: 'Canais',        icon: 'inbox' },
    { id: 'clientes',      label: 'Clientes',                 short: 'Clientes',      icon: 'users' },
    { id: 'historico',     label: 'Histórico de Atendimento', short: 'Histórico',     icon: 'history' },
    { id: 'relatorios',    label: 'Relatórios',               short: 'Relatórios',    icon: 'barChart' },
    { id: 'config',        label: 'Configurações',            short: 'Configurações', icon: 'settings' }
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

const ICON_ALERT = `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ICON_CHAT = `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const ICON_DOC  = `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`;
const ICON_PDF  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

window.currentMonth = new Date();
window.setCurrentMonth = function (d) {
    window.currentMonth = d;
    const el = document.getElementById('currentMonth');
    if (el) el.textContent = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    const app = document.getElementById('appScreen');
    if (app && !app.classList.contains('hidden')) renderRoute();
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

function openModal({ title, bodyHTML, actions = [], size = '', neutral = false, closableByOverlay = true }) {
    const root = document.getElementById('modalRoot');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    const sizeClass = size ? ` ${size}` : '';
    const neutralClass = neutral ? ' modal-neutral' : '';
    overlay.innerHTML = `
        <div class="modal-content${sizeClass}${neutralClass}" role="dialog" aria-modal="true">
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
        overlay.style.animation = 'fadeOut 0.15

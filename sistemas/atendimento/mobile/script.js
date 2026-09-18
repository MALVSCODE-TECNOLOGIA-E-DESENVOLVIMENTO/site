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
        { id: 'ag_2', codigo: 'ME-0002', clienteId: 'ME-0003', clienteNome: 'Carla Mene

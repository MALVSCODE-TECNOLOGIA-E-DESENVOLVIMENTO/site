// Cursor glow
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

// Hamburger
const ham = document.getElementById('hamburger');
const links = document.getElementById('navLinks');
const langSelector = document.getElementById('langSelector');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  links.classList.toggle('open');
  if (!links.classList.contains('open')) {
    langSelector.classList.remove('open');
  }
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  links.classList.remove('open');
  langSelector.classList.remove('open');
}));

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── BACKGROUND ANIMADO COM PALAVRAS ──
const words = [
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Node.js', 'Python', 'Docker', 'Kubernetes', 'AWS', 'GCP',
  'Linux', 'Git', 'GitHub', 'APIs', 'REST', 'GraphQL', 'SQL',
  'PostgreSQL', 'MongoDB', 'Firebase', 'Vercel', 'Render',
  'Full Stack', 'Front-end', 'Back-end', 'Cloud', 'DevOps',
  'Performance', 'Escalabilidade', 'Responsivo', 'UX/UI', 'Agile',
  'Scrum', 'JWT', 'WebSockets', 'SSR', 'SPA', 'MALVSCODE'
];

const bgWords = document.getElementById('bgWords');

function createFloatingWords() {
  const count = 80;
  for (let i = 0; i < count; i++) {
    const word = document.createElement('span');
    word.className = 'word';
    word.textContent = words[Math.floor(Math.random() * words.length)];
    word.style.left = Math.random() * 100 + '%';
    word.style.top = Math.random() * 100 + '%';
    word.style.animationDuration = (20 + Math.random() * 30) + 's';
    word.style.animationDelay = (Math.random() * 20) + 's';
    word.style.fontSize = (0.5 + Math.random() * 0.8) + 'rem';
    word.style.opacity = 0.1 + Math.random() * 0.3;
    bgWords.appendChild(word);
  }
}
createFloatingWords();

// ══════════════════════════════════════════════════════════
// ── CARROSSEL DE MÓDULOS — INFINITO + SWIPE + AUTOPLAY ──
// ══════════════════════════════════════════════════════════
const modulosTrack     = document.getElementById('modulosTrack');
const modulosPrevBtn   = document.getElementById('modulosPrev');
const modulosNextBtn   = document.getElementById('modulosNext');
const modulosDots      = document.getElementById('modulosDots');

const originalModuloCards = Array.from(modulosTrack.children);
const totalModulos = originalModuloCards.length;

// Clona o conjunto original antes e depois para loop infinito
const beforeFrag = document.createDocumentFragment();
originalModuloCards.forEach(card => beforeFrag.appendChild(card.cloneNode(true)));
modulosTrack.insertBefore(beforeFrag, modulosTrack.firstChild);

const afterFrag = document.createDocumentFragment();
originalModuloCards.forEach(card => afterFrag.appendChild(card.cloneNode(true)));
modulosTrack.appendChild(afterFrag);

let cardIndex = totalModulos;
let modulosPerView = getModulosPerView();
let autoModuloInterval;
let modulosGap = 22;

function getModulosPerView() {
  if (window.innerWidth <= 600) return 1;    // celular → 1 card
  if (window.innerWidth <= 1024) return 2;   // tablet → 2 cards
  return 3;                                   // desktop → 3 cards
}

function readCssGap() {
  const styles = getComputedStyle(modulosTrack);
  const g = parseFloat(styles.columnGap || styles.gap || '0');
  return isNaN(g) ? 0 : g;
}

function getCardWidth() {
  const card = modulosTrack.querySelector('.modulo-card');
  if (!card) return 0;
  return card.getBoundingClientRect().width;
}

function getStep() {
  return getCardWidth() + modulosGap;
}

function updateDots() {
  const totalDots = Math.ceil(totalModulos / modulosPerView);
  let rel = (cardIndex - totalModulos) % totalModulos;
  if (rel < 0) rel += totalModulos;
  const activeDot = Math.min(totalDots - 1, Math.round(rel / modulosPerView) % totalDots);
  document.querySelectorAll('.modulos-carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeDot);
  });
}

function setTrackPosition(instant) {
  modulosGap = readCssGap();
  const step = getStep();
  if (instant) modulosTrack.style.transition = 'none';
  modulosTrack.style.transform = `translateX(${-step * cardIndex}px)`;
  if (instant) {
    void modulosTrack.offsetHeight;
    modulosTrack.style.transition = '';
  }
  updateDots();
}

function createModulosDots() {
  modulosDots.innerHTML = '';
  const totalDots = Math.ceil(totalModulos / modulosPerView);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'modulos-carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      cardIndex = totalModulos + (i * modulosPerView);
      setTrackPosition(false);
      resetModulosAutoSlide();
    });
    modulosDots.appendChild(dot);
  }
}

function wrapIfNeeded() {
  if (cardIndex >= totalModulos * 2) {
    cardIndex -= totalModulos;
    setTrackPosition(true);
  } else if (cardIndex < totalModulos) {
    cardIndex += totalModulos;
    setTrackPosition(true);
  }
}
modulosTrack.addEventListener('transitionend', wrapIfNeeded);

function nextModulo() {
  modulosPerView = getModulosPerView();
  cardIndex += modulosPerView;
  setTrackPosition(false);
}

function prevModulo() {
  modulosPerView = getModulosPerView();
  cardIndex -= modulosPerView;
  setTrackPosition(false);
}

function resetModulosAutoSlide() {
  clearInterval(autoModuloInterval);
  autoModuloInterval = setInterval(nextModulo, 6000);
}

modulosPrevBtn.addEventListener('click', () => {
  prevModulo();
  resetModulosAutoSlide();
});

modulosNextBtn.addEventListener('click', () => {
  nextModulo();
  resetModulosAutoSlide();
});

// Swipe
let modTouchStartX = 0;
let modIsSwiping = false;

modulosTrack.addEventListener('touchstart', (e) => {
  modTouchStartX = e.changedTouches[0].screenX;
  modIsSwiping = true;
  clearInterval(autoModuloInterval);
}, { passive: true });

modulosTrack.addEventListener('touchend', (e) => {
  if (!modIsSwiping) return;
  modIsSwiping = false;
  const touchEndX = e.changedTouches[0].screenX;
  const diff = modTouchStartX - touchEndX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) nextModulo();
    else prevModulo();
  }
  resetModulosAutoSlide();
});

let modulosResizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(modulosResizeTimeout);
  modulosResizeTimeout = setTimeout(() => {
    const newPerView = getModulosPerView();
    if (newPerView !== modulosPerView) {
      modulosPerView = newPerView;
      cardIndex = totalModulos; // reancora
      createModulosDots();
      setTrackPosition(true);
    } else {
      setTrackPosition(true);
    }
  }, 120);
});

createModulosDots();
setTimeout(() => {
  setTrackPosition(true);
  resetModulosAutoSlide();
}, 150);

// ── MODAL ──
const modalData = {
  modulo1: { title: 'Sistema Interno Empresarial', desc: 'Sistema completo para gestão empresarial com controle de estoque, vendas, relatórios e muito mais. Ideal para empresas que buscam organizar seus processos internos de forma eficiente e integrada.' },
  modulo2: { title: 'Controle de Frete', desc: 'Gerencie fretes, rotas, custos e entregas com eficiência e rastreabilidade completa. Perfeito para empresas de logística e transportes.' },
  modulo3: { title: 'Contas a Pagar', desc: 'Controle total de contas a pagar, vencimentos, fluxo de caixa e conciliação bancária. Mantenha as finanças da sua empresa em ordem.' },
  modulo4: { title: 'Contas a Receber', desc: 'Gerencie recebimentos, clientes, prazos e acompanhe o fluxo de caixa da sua empresa. Tenha visibilidade total das suas finanças.' },
  modulo5: { title: 'Tabela de Preços', desc: 'Gerencie tabelas de preços, promoções, descontos e atualizações em tempo real. Ideal para comércios e empresas com muitos produtos.' },
  modulo6: { title: 'Estoque', desc: 'Controle de inventário, movimentações, alertas de estoque baixo e relatórios gerenciais. Mantenha seu estoque sempre atualizado.' },
  modulo7: { title: 'Login e Autenticação', desc: 'Sistema seguro de login, autenticação JWT, recuperação de senha e níveis de acesso. Garanta a segurança da sua aplicação.' },
  modulo8: { title: 'Jornada Acadêmica', desc: 'Plataforma para gerenciamento de cursos, alunos, turmas e acompanhamento acadêmico. Ideal para instituições de ensino.' },
  modulo9: { title: 'Fornecedores', desc: 'Gerencie fornecedores, contratos, avaliações e histórico de compras. Perfeito para empresas que precisam controlar sua cadeia de suprimentos.' },
  modulo10: { title: 'Transportadoras', desc: 'Gerencie transportadoras, contratos, rotas e acompanhamento de entregas. Ideal para empresas de logística.' }
};

const modalTopics = [
  'Esta é uma demonstração do módulo.',
  'O cliente pode solicitar ajustes e novas funcionalidades durante o planejamento.',
  'Personalize conforme as necessidades do seu negócio.'
];

function openModal(moduloId) {
  const data = modalData[moduloId];
  if (!data) return;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').textContent = data.desc;

  const topicsContainer = document.getElementById('modalTopics');
  topicsContainer.innerHTML = '';
  modalTopics.forEach(topic => {
    const line = document.createElement('p');
    line.className = 'modal-topic-line';
    line.textContent = '- ' + topic;
    topicsContainer.appendChild(line);
  });

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ── LANGUAGE SYSTEM ──
const langCurrent = document.getElementById('langCurrent');
const langLabels = { pt: 'PT-BR', en: 'EN', es: 'ES' };

langCurrent.addEventListener('click', (e) => {
  e.stopPropagation();
  langSelector.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!langSelector.contains(e.target)) {
    langSelector.classList.remove('open');
  }
});

function buildPtFromDOM() {
  const pt = {};
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (!(key in pt)) {
      pt[key] = el.innerHTML.trim();
    }
  });
  return pt;
}

const translations = {
  pt: buildPtFromDOM(),
  en: {
    'nav-sobre': 'About Us',
    'nav-sistemas': 'Systems',
    'nav-sites': 'Websites',
    'nav-contato': 'Contact',
    'hero-tag': 'Software that drives business',
    'hero-title1': 'The future starts',
    'hero-title2': 'in one bit.',
    'hero-role': '<strong>Cloud Architecture</strong> · Information Security<br>Web Systems · APIs · Scalable Solutions<br><span style="color:var(--blue-b)">—</span> MALVSCODE',
    'btn-projetos': 'View Projects',
    'btn-contato': 'Contact Us',
    'sistemas-label': 'Developed Systems',
    'sistemas-title': 'Projects & <span>Web Systems</span>',
    'modulo1-nome': 'Business Management System',
    'modulo1-desc': 'Complete business management system with inventory, sales, reports and much more.',
    'modulo2-nome': 'Freight Control',
    'modulo2-desc': 'Manage freight, routes, costs and deliveries with efficiency and complete traceability.',
    'modulo3-nome': 'Accounts Payable',
    'modulo3-desc': 'Total control of accounts payable, due dates, cash flow and bank reconciliation.',
    'modulo4-nome': 'Accounts Receivable',
    'modulo4-desc': 'Manage receipts, customers, deadlines and monitor your company\'s cash flow.',
    'modulo5-nome': 'Price List',
    'modulo5-desc': 'Manage price lists, promotions, discounts and real-time updates.',
    'modulo6-nome': 'Inventory',
    'modulo6-desc': 'Inventory control, movements, low stock alerts and management reports.',
    'modulo7-nome': 'Login & Authentication',
    'modulo7-desc': 'Secure login system, JWT authentication, password recovery and access levels.',
    'modulo8-nome': 'Academic Journey',
    'modulo8-desc': 'Platform for managing courses, students, classes and academic tracking.',
    'modulo9-nome': 'Suppliers',
    'modulo9-desc': 'Manage suppliers, contracts, evaluations and purchase history.',
    'modulo10-nome': 'Carriers',
    'modulo10-desc': 'Manage carriers, contracts, routes and delivery tracking.',
    'ver-demo': 'View Demo',
    'sites-label': 'Developed Websites',
    'sites-title': 'Websites & <span>Interfaces</span>',
    'site1-nome': 'Elevate Vision Agency',
    'visitar-site': 'Visit site',
    'contato-label': 'Contact',
    'contato-title': "Let's <span>work together?</span>",
    'contato-sub': 'Open for projects, consulting, and partnerships.<br>Get in touch and let\'s talk about your idea.',
    'telefone': 'WhatsApp / Phone',
    'email': 'E-mail',
    'whatsapp': 'Call on WhatsApp',
    'email-btn': 'Send E-mail',
    'fechar': 'Close'
  },
  es: {
    'nav-sobre': 'La Empresa',
    'nav-sistemas': 'Sistemas',
    'nav-sites': 'Sitios',
    'nav-contato': 'Contacto',
    'hero-tag': 'Software que impulsa negocios',
    'hero-title1': 'El futuro comienza',
    'hero-title2': 'en un bit.',
    'hero-role': '<strong>Arquitectura Cloud</strong> · Seguridad de la Información<br>Sistemas Web · APIs · Soluciones Escalables<br><span style="color:var(--blue-b)">—</span> MALVSCODE',
    'btn-projetos': 'Ver Proyectos',
    'btn-contato': 'Contáctenos',
    'sistemas-label': 'Sistemas desarrollados',
    'sistemas-title': 'Proyectos & <span>Sistemas Web</span>',
    'modulo1-nome': 'Sistema Interno Empresarial',
    'modulo1-desc': 'Sistema completo de gestión empresarial con control de inventario, ventas, informes y más.',
    'modulo2-nome': 'Control de Flete',
    'modulo2-desc': 'Gestione fletes, rutas, costos y entregas con eficiencia y trazabilidad completa.',
    'modulo3-nome': 'Cuentas a Pagar',
    'modulo3-desc': 'Control total de cuentas a pagar, vencimientos, flujo de caja y conciliación bancaria.',
    'modulo4-nome': 'Cuentas a Cobrar',
    'modulo4-desc': 'Gestione cobros, clientes, plazos y monitoree el flujo de caja de su empresa.',
    'modulo5-nome': 'Tabla de Precios',
    'modulo5-desc': 'Gestione tablas de precios, promociones, descuentos y actualizaciones en tiempo real.',
    'modulo6-nome': 'Inventario',
    'modulo6-desc': 'Control de inventario, movimientos, alertas de stock bajo e informes gerenciales.',
    'modulo7-nome': 'Login y Autenticación',
    'modulo7-desc': 'Sistema seguro de login, autenticación JWT, recuperación de contraseña y niveles de acceso.',
    'modulo8-nome': 'Jornada Académica',
    'modulo8-desc': 'Plataforma para gestión de cursos, alumnos, clases y seguimiento académico.',
    'modulo9-nome': 'Proveedores',
    'modulo9-desc': 'Gestione proveedores, contratos, evaluaciones e historial de compras.',
    'modulo10-nome': 'Transportadoras',
    'modulo10-desc': 'Gestione transportadoras, contratos, rutas y seguimiento de entregas.',
    'ver-demo': 'Ver Demo',
    'sites-label': 'Sitios desarrollados',
    'sites-title': 'Sitios web & <span>Interfaces</span>',
    'site1-nome': 'Elevate Vision Agency',
    'visitar-site': 'Visitar sitio',
    'contato-label': 'Contacto',
    'contato-title': '¿Vamos a <span>trabajar juntos?</span>',
    'contato-sub': 'Abiertos a proyectos, consultorías y alianzas.<br>Póngase en contacto y hablemos de su idea.',
    'telefone': 'WhatsApp / Teléfono',
    'email': 'Correo electrónico',
    'whatsapp': 'Llamar por WhatsApp',
    'email-btn': 'Enviar correo',
    'fechar': 'Cerrar'
  }
};

let currentLang = 'pt';

function changeLanguage(lang) {
  currentLang = lang;

  langCurrent.childNodes[0].textContent = langLabels[lang] + ' ';

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (translations[lang] && translations[lang][key] !== undefined) {
      el.innerHTML = translations[lang][key];
    }
  });

  langSelector.classList.remove('open');
}

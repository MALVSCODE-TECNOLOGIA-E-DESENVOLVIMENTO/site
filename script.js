// ── CURSOR GLOW ──
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

// ── HAMBURGER ──
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

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── BACKGROUND ANIMADO ──
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
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
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
    dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
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

modulosTrack.addEventListener('click', (e) => {
  const infoBtn = e.target.closest('.modulo-info-btn');
  if (infoBtn && infoBtn.dataset.modulo) {
    openModal(infoBtn.dataset.modulo);
  }
});

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
      cardIndex = totalModulos;
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
  modulo1: {
    title: 'Sistema Integrado',
    desc: 'Plataforma web que unifica diferentes áreas operacionais em um só painel. Conta com autenticação de usuários, controle de permissões, registro de atividades e módulos independentes que se comunicam entre si.',
    topics: [
      'Autenticação e níveis de acesso',
      'Módulos independentes e integrados',
      'Registro de atividades (log)',
      'Dashboard com visão geral',
      'Personalizável conforme o negócio'
    ]
  },
  modulo2: {
    title: 'Logística',
    desc: 'Ferramenta para registrar e acompanhar transportadoras, cotações de frete e envios. Permite comparar opções, monitorar prazos, acompanhar status em tempo real e registrar confirmações de entrega.',
    topics: [
      'Cadastro de transportadoras',
      'Cotação e comparação de fretes',
      'Acompanhamento de prazos e status',
      'Confirmação de entrega',
      'Histórico de envios'
    ]
  },
  modulo3: {
    title: 'Gestão de Pagamentos',
    desc: 'Organize contas a pagar e a receber, pagamentos realizados e atrasados, além de histórico e relatórios financeiros. Tenha uma visão clara do seu fluxo de caixa em um só lugar.',
    topics: [
      'Contas a pagar e a receber',
      'Alertas de vencimento',
      'Relatórios financeiros',
      'Histórico de pagamentos',
      'Visão de fluxo de caixa'
    ]
  },
  modulo5: {
    title: 'Controle de Preços',
    desc: 'Acompanhe os preços de itens e produtos cotados, compare valores entre fornecedores, identifique as melhores oportunidades e consulte o histórico de variações.',
    topics: [
      'Registro de cotações',
      'Comparação entre fornecedores',
      'Histórico de preços',
      'Identificação de melhores oportunidades',
      'Exportação de dados'
    ]
  },
  modulo6: {
    title: 'Estoque',
    desc: 'Monitore a movimentação de itens e produtos com entradas, saídas, quantidades disponíveis e alertas de estoque baixo. O histórico completo garante rastreabilidade e controle.',
    topics: [
      'Entradas e saídas de itens',
      'Quantidade disponível em tempo real',
      'Alertas de estoque baixo',
      'Histórico de movimentações',
      'Relatórios de inventário'
    ]
  },
  modulo8: {
    title: 'Compras',
    desc: 'Tenha o histórico completo das suas compras organizado por itens, valores, datas, formas de pagamento e fornecedores. Fácil de consultar e comparar.',
    topics: [
      'Registro de compras',
      'Itens, valores e datas',
      'Formas de pagamento',
      'Histórico por fornecedor',
      'Relatórios de compras'
    ]
  },
  modulo9: {
    title: 'Relacionamentos',
    desc: 'Reúna informações de clientes e fornecedores, contatos e histórico de interações em um ambiente único. Ideal para manter o relacionamento comercial organizado.',
    topics: [
      'Cadastro de clientes e fornecedores',
      'Histórico de interações',
      'Contatos centralizados',
      'Observações e anotações',
      'Busca rápida e filtros'
    ]
  }
};

function openModal(moduloId) {
  const data = modalData[moduloId];
  if (!data) return;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').textContent = data.desc;

  const topicsContainer = document.getElementById('modalTopics');
  topicsContainer.innerHTML = '';
  data.topics.forEach(topic => {
    const line = document.createElement('p');
    line.className = 'modal-topic-line';
    line.textContent = '› ' + topic;
    topicsContainer.appendChild(line);
  });

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

const modalOverlayEl = document.getElementById('modalOverlay');
modalOverlayEl.addEventListener('click', closeModal);
modalOverlayEl.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());
document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
  btn.addEventListener('click', closeModal);
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ══════════════════════════════════════════════════════════
// ── SISTEMA DE TRADUÇÃO ──
// PT é lido SEMPRE do HTML atual (nunca sobrescreve suas edições)
// EN/ES ficam em objetos fixos abaixo
// ══════════════════════════════════════════════════════════

// Captura uma cópia "imutável" do PT do HTML no carregamento
const ptOriginal = {};
document.querySelectorAll('[data-key]').forEach(el => {
  const key = el.dataset.key;
  if (!(key in ptOriginal)) {
    ptOriginal[key] = el.innerHTML.trim();
  }
});

// Traduções fixas EN/ES
const translations = {
  en: {
    'nav-sistemas': 'Systems',
    'nav-sites': 'Websites',
    'nav-processo': 'Process',
    'nav-contato': 'Contact',
    'hero-tag': 'Welcome to my portfolio!',
    'hero-title1': 'MALVS',
    'hero-title2': 'CODE',
    'hero-role': '<strong>Full Stack Developer</strong><br>Web Systems · Websites · Scalable Solutions<br>Databases · APIs · Deploy · DNS · Vercel · Render · JSON',
    'btn-projetos': 'View Projects',
    'btn-contato': 'Contact Us',
    'sistemas-label': 'Developed Systems',
    'sistemas-title': 'Projects & <span>Web Systems</span>',
    'modulo1-nome': 'Integrated System',
    'modulo1-desc': 'A web platform that unifies different operational areas into a single dashboard. It features user authentication, role-based access control, activity logging, and independent modules that communicate with each other.',
    'modulo2-nome': 'Logistics',
    'modulo2-desc': 'A tool to register and track carriers, freight quotes, and shipments. It allows comparing options, monitoring deadlines, tracking real-time status, and registering delivery confirmations.',
    'modulo3-nome': 'Payment Management',
    'modulo3-desc': 'Organize accounts payable and receivable, completed and overdue payments, plus history and financial reports. Get a clear view of your cash flow in one place.',
    'modulo5-nome': 'Price Control',
    'modulo5-desc': 'Track prices for quoted items and products, compare values across suppliers, identify the best opportunities, and check price variation history.',
    'modulo6-nome': 'Inventory',
    'modulo6-desc': 'Monitor item and product movements with inbound, outbound, available quantities, and low-stock alerts. The complete history ensures traceability and control.',
    'modulo8-nome': 'Purchases',
    'modulo8-desc': 'Keep a complete purchase history organized by items, values, dates, payment methods, and suppliers. Easy to consult and compare.',
    'modulo9-nome': 'Relationships',
    'modulo9-desc': 'Bring together customer and supplier information, contacts, and interaction history in one environment. Ideal for keeping business relationships organized.',
    'saiba-mais': 'Learn more',
    'sites-label': 'Developed Websites',
    'sites-title': 'Websites & <span>Interfaces</span>',
    'sites-sub': 'Published and in-development projects. New websites will be added soon.',
    'site1-nome': 'Elevate Vision Agency',
    'site-coming-title': 'Next project',
    'site-coming-desc': 'We are looking for new clients to build custom websites. More published projects coming soon.',
    'visitar-site': 'Visit site',
    'processo-label': 'How we work',
    'processo-title': 'From briefing to <span>deploy</span>',
    'processo-sub': 'A clear, transparent process with no surprises — so you know exactly what to expect at each stage.',
    'processo1-title': 'Discovery',
    'processo1-desc': 'We talk about your idea, goals, and needs. I understand your business context before proposing any solution.',
    'processo2-title': 'Planning',
    'processo2-desc': 'We define scope, features, deadlines, and investment. You receive a clear proposal with no fine print.',
    'processo3-title': 'Development',
    'processo3-desc': 'Coding with follow-up. You see progress in real time and can suggest adjustments along the way.',
    'processo4-title': 'Delivery & Deploy',
    'processo4-desc': 'Publishing, domain configuration, DNS, and final tests. Your project is live, working, and ready to use.',
    'processo5-title': 'Support',
    'processo5-desc': 'Post-delivery follow-up, fixes, and continuous evolution. Your system doesn\'t stand still.',
    'contato-label': 'Contact',
    'contato-title': "Let's <span>work together?</span>",
    'contato-sub': 'Open for projects, consulting, and partnerships.<br>Get in touch and let\'s talk about your idea.',
    'telefone': 'WhatsApp / Phone',
    'email': 'E-mail',
    'instagram-label': 'Instagram',
    'github-label': 'GitHub',
    'whatsapp': 'Call on WhatsApp',
    'email-btn': 'Send E-mail',
    'fechar': 'Close'
  },
  es: {
    'nav-sistemas': 'Sistemas',
    'nav-sites': 'Sitios',
    'nav-processo': 'Proceso',
    'nav-contato': 'Contacto',
    'hero-tag': '¡Bienvenido(a) a mi portafolio!',
    'hero-title1': 'MALVS',
    'hero-title2': 'CODE',
    'hero-role': '<strong>Desarrollador Full Stack</strong><br>Sistemas Web · Sitios · Soluciones Escalables<br>Bases de Datos · APIs · Deploy · DNS · Vercel · Render · JSON',
    'btn-projetos': 'Ver Proyectos',
    'btn-contato': 'Contáctenos',
    'sistemas-label': 'Sistemas desarrollados',
    'sistemas-title': 'Proyectos & <span>Sistemas Web</span>',
    'modulo1-nome': 'Sistema Integrado',
    'modulo1-desc': 'Plataforma web que unifica diferentes áreas operativas en un solo panel. Cuenta con autenticación de usuarios, control de permisos, registro de actividades y módulos independientes que se comunican entre sí.',
    'modulo2-nome': 'Logística',
    'modulo2-desc': 'Herramienta para registrar y hacer seguimiento de transportistas, cotizaciones de flete y envíos. Permite comparar opciones, monitorear plazos, seguir el estado en tiempo real y registrar confirmaciones de entrega.',
    'modulo3-nome': 'Gestión de Pagos',
    'modulo3-desc': 'Organice cuentas por pagar y por cobrar, pagos realizados y atrasados, además de historial e informes financieros. Tenga una visión clara de su flujo de caja en un solo lugar.',
    'modulo5-nome': 'Control de Precios',
    'modulo5-desc': 'Haga seguimiento de los precios de artículos y productos cotizados, compare valores entre proveedores, identifique las mejores oportunidades y consulte el historial de variaciones.',
    'modulo6-nome': 'Inventario',
    'modulo6-desc': 'Monitoree el movimiento de artículos y productos con entradas, salidas, cantidades disponibles y alertas de stock bajo. El historial completo garantiza trazabilidad y control.',
    'modulo8-nome': 'Compras',
    'modulo8-desc': 'Mantenga un historial completo de sus compras organizado por artículos, valores, fechas, formas de pago y proveedores. Fácil de consultar y comparar.',
    'modulo9-nome': 'Relaciones',
    'modulo9-desc': 'Reúna información de clientes y proveedores, contactos e historial de interacciones en un solo entorno. Ideal para mantener organizadas las relaciones comerciales.',
    'saiba-mais': 'Saber más',
    'sites-label': 'Sitios desarrollados',
    'sites-title': 'Sitios web & <span>Interfaces</span>',
    'sites-sub': 'Proyectos publicados y en desarrollo. Pronto se agregarán nuevos sitios.',
    'site1-nome': 'Elevate Vision Agency',
    'site-coming-title': 'Próximo proyecto',
    'site-coming-desc': 'Estamos buscando nuevos clientes para desarrollar sitios a medida. Pronto más proyectos publicados aquí.',
    'visitar-site': 'Visitar sitio',
    'processo-label': 'Cómo trabajamos',
    'processo-title': 'Del briefing al <span>deploy</span>',
    'processo-sub': 'Un proceso claro, transparente y sin sorpresas — para que sepa exactamente qué esperar en cada etapa.',
    'processo1-title': 'Descubrimiento',
    'processo1-desc': 'Hablamos sobre su idea, objetivos y necesidades. Entiendo el contexto de su negocio antes de proponer cualquier solución.',
    'processo2-title': 'Planificación',
    'processo2-desc': 'Definimos alcance, funcionalidades, plazos e inversión. Recibe una propuesta clara, sin letra pequeña.',
    'processo3-title': 'Desarrollo',
    'processo3-desc': 'Codificación con seguimiento. Ve el progreso en tiempo real y puede sugerir ajustes en el camino.',
    'processo4-title': 'Entrega & Deploy',
    'processo4-desc': 'Publicación, configuración de dominio, DNS y pruebas finales. Su proyecto en el aire, funcionando y listo para usar.',
    'processo5-title': 'Soporte',
    'processo5-desc': 'Seguimiento post-entrega, correcciones y evolución continua. Su sistema no se queda quieto en el tiempo.',
    'contato-label': 'Contacto',
    'contato-title': '¿Vamos a <span>trabajar juntos?</span>',
    'contato-sub': 'Abiertos a proyectos, consultorías y alianzas.<br>Póngase en contacto y hablemos de su idea.',
    'telefone': 'WhatsApp / Teléfono',
    'email': 'Correo electrónico',
    'instagram-label': 'Instagram',
    'github-label': 'GitHub',
    'whatsapp': 'Llamar por WhatsApp',
    'email-btn': 'Enviar correo',
    'fechar': 'Cerrar'
  }
};

const langCurrent = document.getElementById('langCurrent');
const langLabels = { pt: 'PT-BR', en: 'EN', es: 'ES' };

function applyLanguage(lang) {
  // Atualiza label do botão
  langCurrent.childNodes[0].textContent = langLabels[lang] + ' ';

  // Marca opção ativa
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Aplica textos
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;

    if (lang === 'pt') {
      if (ptOriginal[key] !== undefined) {
        el.innerHTML = ptOriginal[key];
      }
    } else {
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    }
  });
}

langCurrent.addEventListener('click', (e) => {
  e.stopPropagation();
  langSelector.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!langSelector.contains(e.target)) {
    langSelector.classList.remove('open');
  }
});
document.querySelectorAll('.lang-option').forEach(btn => {
  btn.addEventListener('click', () => {
    applyLanguage(btn.dataset.lang);
    langSelector.classList.remove('open');
  });
});

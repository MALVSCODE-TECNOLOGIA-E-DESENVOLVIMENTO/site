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
// ── + PAUSA NO HOVER + FIX DO WRAP INFINITO ──
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
let autoModuloInterval = null;
let modulosGap = 22;
let isTransitioning = false;

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
  const activeDot = Math.min(
    totalDots - 1,
    Math.floor(rel / modulosPerView) % totalDots
  );
  document.querySelectorAll('.modulos-carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeDot);
  });
}

function setTrackPosition(instant) {
  modulosGap = readCssGap();
  const step = getStep();
  isTransitioning = !instant;
  if (instant) modulosTrack.style.transition = 'none';
  modulosTrack.style.transform = `translateX(${-step * cardIndex}px)`;
  if (instant) {
    void modulosTrack.offsetHeight;
    modulosTrack.style.transition = '';
    isTransitioning = false;
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

// ── WRAP INFINITO CORRIGIDO ──
function wrapIfNeeded() {
  if (isTransitioning) return;
  const lowerBound = totalModulos;
  const upperBound = totalModulos * 2;

  if (cardIndex >= upperBound) {
    cardIndex -= totalModulos;
    setTrackPosition(true);
  } else if (cardIndex < lowerBound) {
    cardIndex += totalModulos;
    setTrackPosition(true);
  }
}

modulosTrack.addEventListener('transitionend', (e) => {
  if (e.target !== modulosTrack) return;
  if (e.propertyName !== 'transform') return;
  isTransitioning = false;
  wrapIfNeeded();
});

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

function stopModulosAutoSlide() {
  clearInterval(autoModuloInterval);
  autoModuloInterval = null;
}

modulosPrevBtn.addEventListener('click', () => {
  prevModulo();
  resetModulosAutoSlide();
});

modulosNextBtn.addEventListener('click', () => {
  nextModulo();
  resetModulosAutoSlide();
});

// ── PAUSA NO HOVER ──
const carouselContainer = document.querySelector('.modulos-carousel-container');
carouselContainer.addEventListener('mouseenter', stopModulosAutoSlide);
carouselContainer.addEventListener('mouseleave', resetModulosAutoSlide);

// ── SWIPE ──
let modTouchStartX = 0;
let modIsSwiping = false;

modulosTrack.addEventListener('touchstart', (e) => {
  modTouchStartX = e.changedTouches[0].screenX;
  modIsSwiping = true;
  stopModulosAutoSlide();
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

// ══════════════════════════════════════════════════════════
// ── MODAL — SLIDER DE IMAGENS POR MÓDULO ──
// ══════════════════════════════════════════════════════════
const WHATSAPP_NUMBER = '5527997099444';

const modalData = {
  'sistema-integrado': {
    title: 'Sistema Integrado',
    slides: [
      { img: 'imagens/sistema-integrado/login.png',        caption: 'Tela de acesso ao sistema, com autenticação segura.' },
      { img: 'imagens/sistema-integrado/carregamento.png', caption: 'Tela de carregamento e inicialização do painel.' },
      { img: 'imagens/sistema-integrado/interface.png',    caption: 'Interface principal com visão geral dos módulos.' }
    ]
  },
  'login-autenticacao': {
    title: 'Login e Autenticação',
    slides: [
      { img: 'imagens/login-autenticacao/tela-login.png',    caption: 'Tela de login com validação de credenciais.' },
      { img: 'imagens/login-autenticacao/carregamento.png',  caption: 'Carregamento e verificação de sessão.' }
    ]
  },
  'relacionamentos': {
    title: 'Relacionamentos',
    slides: [
      { img: 'imagens/relacionamentos/clientes.png',                   caption: 'Cadastro e listagem de clientes.' },
      { img: 'imagens/relacionamentos/fornecedores.png',                caption: 'Cadastro e gestão de fornecedores.' },
      { img: 'imagens/relacionamentos/historico-relacionamentos.png',   caption: 'Histórico completo de interações.' }
    ]
  },
  'logistica': {
    title: 'Logística',
    slides: [
      { img: 'imagens/logistica/transportadoras.png',       caption: 'Cadastro e gestão de transportadoras.' },
      { img: 'imagens/logistica/cotacoes.png',              caption: 'Cotação e comparação de fretes.' },
      { img: 'imagens/logistica/controle-frete.png',        caption: 'Acompanhamento de envios e prazos.' },
      { img: 'imagens/logistica/relatorio-logistica.png',   caption: 'Relatórios de logística e desempenho.' }
    ]
  },
  'controle-precos': {
    title: 'Controle de Preços',
    slides: [
      { img: 'imagens/controle-precos/cotacoes.png',         caption: 'Registro de cotações de itens e produtos.' },
      { img: 'imagens/controle-precos/tabela.png',           caption: 'Tabela comparativa de preços por fornecedor.' }
    ]
  },
  'estoque': {
    title: 'Estoque',
    slides: [
      { img: 'imagens/estoque/deposito.png',                 caption: 'Visão do depósito e itens disponíveis.' },
      { img: 'imagens/estoque/relatorio-estoque.png',        caption: 'Relatório de movimentações e inventário.' }
    ]
  },
  'compras': {
    title: 'Compras',
    slides: [
      { img: 'imagens/compras/compras-registradas.png',      caption: 'Compras registradas no sistema.' },
      { img: 'imagens/compras/compras-realizadas.png',       caption: 'Compras realizadas e concluídas.' },
      { img: 'imagens/compras/relatorio-compra.png',         caption: 'Relatório detalhado de compras.' }
    ]
  },
  'gestao-pagamentos': {
    title: 'Gestão de Pagamentos',
    slides: [
      { img: 'imagens/gestao-pagamentos/contas-pagar.png',         caption: 'Contas a pagar e controle de vencimentos.' },
      { img: 'imagens/gestao-pagamentos/contas-receber.png',       caption: 'Contas a receber e acompanhamento.' },
      { img: 'imagens/gestao-pagamentos/registro-financeiro.png',  caption: 'Registro financeiro consolidado.' }
    ]
  }
};

// ── Templates de mensagem por idioma ──
const waMessageTemplates = {
  pt: (title) => `Olá! Vi o sistema "${title}" no site da MALVSCODE e gostaria de algo parecido. Podemos conversar?`,
  en: (title) => `Hi! I saw the "${title}" system on the MALVSCODE website and I'd like something similar. Can we talk?`,
  es: (title) => `¡Hola! Vi el sistema "${title}" en el sitio de MALVSCODE y me gustaría algo parecido. ¿Podemos hablar?`
};

let currentLang = 'pt';

// ── Estado do slider do modal ──
let modalSlides = [];
let modalIndex = 0;
let currentModalTitle = '';

const modalOverlayEl     = document.getElementById('modalOverlay');
const modalTrack         = document.getElementById('modalTrack');
const modalDotsEl        = document.getElementById('modalDots');
const modalCaptionEl     = document.getElementById('modalCaption');
const modalPrevBtn       = document.getElementById('modalPrev');
const modalNextBtn       = document.getElementById('modalNext');
const modalTitleEl       = document.getElementById('modalTitle');
const modalWhatsappBtn   = document.getElementById('modalWhatsappBtn');

function updateWhatsappLink() {
  if (!currentModalTitle) return;
  const template = waMessageTemplates[currentLang] || waMessageTemplates.pt;
  const msg = template(currentModalTitle);
  modalWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function renderModalSlide(instant) {
  if (!modalSlides.length) return;
  const step = modalTrack.parentElement.getBoundingClientRect().width;
  if (instant) modalTrack.style.transition = 'none';
  modalTrack.style.transform = `translateX(${-step * modalIndex}px)`;
  if (instant) {
    void modalTrack.offsetHeight;
    modalTrack.style.transition = '';
  }

  // Caption
  modalCaptionEl.style.opacity = '0';
  setTimeout(() => {
    modalCaptionEl.textContent = modalSlides[modalIndex].caption;
    modalCaptionEl.style.opacity = '1';
  }, 100);

  // Dots
  modalDotsEl.querySelectorAll('.modal-slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === modalIndex);
  });
}

function buildModalSlider(slides) {
  modalTrack.innerHTML = '';
  modalDotsEl.innerHTML = '';

  slides.forEach((slide, i) => {
    const div = document.createElement('div');
    div.className = 'modal-slide';
    const img = document.createElement('img');
    img.src = slide.img;
    img.alt = slide.caption;
    img.loading = 'lazy';
    div.appendChild(img);
    modalTrack.appendChild(div);

    const dot = document.createElement('button');
    dot.className = 'modal-slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
    dot.addEventListener('click', () => {
      modalIndex = i;
      renderModalSlide(false);
    });
    modalDotsEl.appendChild(dot);
  });
}

function openModal(moduloId) {
  const data = modalData[moduloId];
  if (!data) return;

  modalTitleEl.textContent = data.title;
  modalSlides = data.slides.slice();
  modalIndex = 0;
  currentModalTitle = data.title;

  buildModalSlider(modalSlides);
  updateWhatsappLink();

  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    modalTrack.style.transition = 'none';
    modalTrack.style.transform = 'translateX(0px)';
    requestAnimationFrame(() => {
      modalTrack.style.transition = '';
      modalCaptionEl.textContent = modalSlides[0].caption;
    });
  });
}

function closeModal() {
  modalOverlayEl.classList.remove('active');
  document.body.style.overflow = '';
}

modalPrevBtn.addEventListener('click', () => {
  if (!modalSlides.length) return;
  modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length;
  renderModalSlide(false);
});
modalNextBtn.addEventListener('click', () => {
  if (!modalSlides.length) return;
  modalIndex = (modalIndex + 1) % modalSlides.length;
  renderModalSlide(false);
});

// Swipe no modal
let modalTouchStartX = 0;
modalTrack.addEventListener('touchstart', (e) => {
  modalTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });
modalTrack.addEventListener('touchend', (e) => {
  const diff = modalTouchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      modalIndex = (modalIndex + 1) % modalSlides.length;
    } else {
      modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length;
    }
    renderModalSlide(false);
  }
});

modalOverlayEl.addEventListener('click', closeModal);
modalOverlayEl.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());
document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
  btn.addEventListener('click', closeModal);
});
document.addEventListener('keydown', (e) => {
  if (!modalOverlayEl.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') modalNextBtn.click();
  if (e.key === 'ArrowLeft')  modalPrevBtn.click();
});

// Recalcular posição do slide ao redimensionar com modal aberto
window.addEventListener('resize', () => {
  if (modalOverlayEl.classList.contains('active')) {
    renderModalSlide(true);
  }
});

// ══════════════════════════════════════════════════════════
// ── SISTEMA DE TRADUÇÃO ──
// ══════════════════════════════════════════════════════════

// Captura uma cópia "imutável" do PT do HTML no carregamento
const ptOriginal = {};
document.querySelectorAll('[data-key]').forEach(el => {
  const key = el.dataset.key;
  if (!(key in ptOriginal)) {
    ptOriginal[key] = el.innerHTML.trim();
  }
});

const translations = {
  en: {
    'nav-sistemas': 'Systems',
    'nav-sites': 'Websites',
    'nav-processo': 'About',
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
    'modulo-login-nome': 'Login & Authentication',
    'modulo-login-desc': 'A secure access system with user authentication, password recovery, and permission levels. Ensures each person only sees what they are allowed to.',
    'modulo9-nome': 'Relationships',
    'modulo9-desc': 'Bring together customer and supplier information, contacts, and interaction history in one environment. Ideal for keeping business relationships organized.',
    'modulo2-nome': 'Logistics',
    'modulo2-desc': 'A tool to register and track carriers, freight quotes, and shipments. It allows comparing options, monitoring deadlines, tracking real-time status, and registering delivery confirmations.',
    'modulo5-nome': 'Price Control',
    'modulo5-desc': 'Track prices for quoted items and products, compare values across suppliers, identify the best opportunities, and check price variation history.',
    'modulo6-nome': 'Inventory',
    'modulo6-desc': 'Monitor item and product movements with inbound, outbound, available quantities, and low-stock alerts. The complete history ensures traceability and control.',
    'modulo8-nome': 'Purchases',
    'modulo8-desc': 'Keep a complete purchase history organized by items, values, dates, payment methods, and suppliers. Easy to consult and compare.',
    'modulo3-nome': 'Payment Management',
    'modulo3-desc': 'Organize accounts payable and receivable, completed and overdue payments, plus history and financial reports. Get a clear view of your cash flow in one place.',
    'saiba-mais': 'Learn more',
    'quero-projeto': 'I want this project',
    'sites-label': 'Developed Websites',
    'sites-title': 'Websites & <span>Interfaces</span>',
    'sites-sub': 'Published and in-development projects. New websites will be added soon.',
    'site1-nome': 'Elevate Vision Agency',
    'site-coming-title': 'New projects coming soon',
    'site-coming-desc': 'New websites will be launched soon. In the meantime, check out the project above.',
    'visitar-site': 'Visit site',
    'processo-label': 'About my work',
    'processo-title': 'How I <span>work</span>',
    'processo-sub': 'A clear and transparent process, from first contact to ongoing support — so you know exactly what to expect at each stage.',
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
    'modal-note': 'Initial demonstration images. Adjustments can be made as needed.',
    'fechar': 'Close'
  },
  es: {
    'nav-sistemas': 'Sistemas',
    'nav-sites': 'Sitios',
    'nav-processo': 'Sobre',
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
    'modulo-login-nome': 'Login y Autenticación',
    'modulo-login-desc': 'Sistema de acceso seguro con autenticación de usuarios, recuperación de contraseña y niveles de permiso. Garantiza que cada persona vea solo lo que le corresponde.',
    'modulo9-nome': 'Relaciones',
    'modulo9-desc': 'Reúna información de clientes y proveedores, contactos e historial de interacciones en un solo entorno. Ideal para mantener organizadas las relaciones comerciales.',
    'modulo2-nome': 'Logística',
    'modulo2-desc': 'Herramienta para registrar y hacer seguimiento de transportistas, cotizaciones de flete y envíos. Permite comparar opciones, monitorear plazos, seguir el estado en tiempo real y registrar confirmaciones de entrega.',
    'modulo5-nome': 'Control de Precios',
    'modulo5-desc': 'Haga seguimiento de los precios de artículos y productos cotizados, compare valores entre proveedores, identifique las mejores oportunidades y consulte el historial de variaciones.',
    'modulo6-nome': 'Inventario',
    'modulo6-desc': 'Monitoree el movimiento de artículos y productos con entradas, salidas, cantidades disponibles y alertas de stock bajo. El historial completo garantiza trazabilidad y control.',
    'modulo8-nome': 'Compras',
    'modulo8-desc': 'Mantenga un historial completo de sus compras organizado por artículos, valores, fechas, formas de pago y proveedores. Fácil de consultar y comparar.',
    'modulo3-nome': 'Gestión de Pagos',
    'modulo3-desc': 'Organice cuentas por pagar y por cobrar, pagos realizados y atrasados, además de historial e informes financieros. Tenga una visión clara de su flujo de caja en un solo lugar.',
    'saiba-mais': 'Saber más',
    'quero-projeto': 'Quiero este proyecto',
    'sites-label': 'Sitios desarrollados',
    'sites-title': 'Sitios web & <span>Interfaces</span>',
    'sites-sub': 'Proyectos publicados y en desarrollo. Pronto se agregarán nuevos sitios.',
    'site1-nome': 'Elevate Vision Agency',
    'site-coming-title': 'Nuevos proyectos pronto',
    'site-coming-desc': 'Pronto se lanzarán nuevos sitios web. Mientras tanto, vea el proyecto publicado arriba.',
    'visitar-site': 'Visitar sitio',
    'processo-label': 'Sobre mi trabajo',
    'processo-title': 'Cómo <span>trabajo</span>',
    'processo-sub': 'Un proceso claro y transparente, desde el primer contacto hasta el soporte continuo — para que sepa exactamente qué esperar en cada etapa.',
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
    'modal-note': 'Imágenes de demostración inicial. Los ajustes se pueden realizar según sea necesario.',
    'fechar': 'Cerrar'
  }
};

const langCurrent = document.getElementById('langCurrent');
const langLabels = { pt: 'PT-BR', en: 'EN', es: 'ES' };

function applyLanguage(lang) {
  currentLang = lang;

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

  // Atualiza o link do WhatsApp do modal se ele já estiver com um título carregado
  if (currentModalTitle) updateWhatsappLink();
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

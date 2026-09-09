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
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  links.classList.toggle('open');
  const langSelector = document.querySelector('.language-selector');
  langSelector.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  links.classList.remove('open');
  document.querySelector('.language-selector').classList.remove('open');
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

// ── CARROSSEL DE MÓDULOS (INFINITO COM AUTOPLAY) ──
const modulosTrack = document.getElementById('modulosTrack');
const modulosPrev = document.getElementById('modulosPrev');
const modulosNext = document.getElementById('modulosNext');
const modulosDots = document.getElementById('modulosDots');

let currentModulo = 0;
let totalModulos = document.querySelectorAll('.modulo-card').length;
let modulosPerView = 3;
let autoModuloInterval;
let isTransitioning = false;
let userInteracted = false;
let interactionTimeout = null;

// Clonar cards para efeito infinito
function setupInfiniteCarousel() {
  const track = modulosTrack;
  const cards = track.querySelectorAll('.modulo-card');
  const totalCards = cards.length;
  
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[totalCards - 1].cloneNode(true);
  
  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);
  
  const cardWidth = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${cardWidth}px)`;
  
  return totalCards;
}

function getModulosPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function getCardWidth() {
  const card = document.querySelector('.modulo-card');
  return card ? card.offsetWidth + 20 : 320;
}

function updateModulosCarousel(animate = true) {
  if (isTransitioning) return;
  
  modulosPerView = getModulosPerView();
  const cardWidth = getCardWidth();
  
  let displayIndex = currentModulo + 1;
  
  modulosTrack.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
  modulosTrack.style.transform = `translateX(-${displayIndex * cardWidth}px)`;
  
  const dotCount = Math.ceil(totalModulos / modulosPerView);
  document.querySelectorAll('.modulos-carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentModulo % dotCount);
  });
}

function createModulosDots() {
  modulosDots.innerHTML = '';
  const dotCount = Math.ceil(totalModulos / getModulosPerView());
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'modulos-carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      userInteracted = true;
      clearTimeout(interactionTimeout);
      currentModulo = i;
      updateModulosCarousel();
      resetModulosAutoSlide();
      interactionTimeout = setTimeout(() => {
        userInteracted = false;
        resetModulosAutoSlide();
      }, 8000);
    });
    modulosDots.appendChild(dot);
  }
}

function nextModulo() {
  if (isTransitioning) return;
  
  const dotCount = Math.ceil(totalModulos / modulosPerView);
  const cardWidth = getCardWidth();
  const displayIndex = currentModulo + 2;
  
  isTransitioning = true;
  
  currentModulo = (currentModulo + 1) % dotCount;
  updateModulosCarousel(true);
  
  setTimeout(() => {
    if (displayIndex >= totalModulos + 1) {
      isTransitioning = true;
      currentModulo = 0;
      modulosTrack.style.transition = 'none';
      modulosTrack.style.transform = `translateX(-${1 * cardWidth}px)`;
      setTimeout(() => {
        isTransitioning = false;
        updateModulosCarousel(true);
      }, 50);
    } else {
      isTransitioning = false;
    }
  }, 650);
}

function prevModulo() {
  if (isTransitioning) return;
  
  const dotCount = Math.ceil(totalModulos / modulosPerView);
  const cardWidth = getCardWidth();
  const displayIndex = currentModulo + 1;
  
  isTransitioning = true;
  
  currentModulo = (currentModulo - 1 + dotCount) % dotCount;
  updateModulosCarousel(true);
  
  setTimeout(() => {
    if (displayIndex <= 0) {
      isTransitioning = true;
      currentModulo = dotCount - 1;
      modulosTrack.style.transition = 'none';
      modulosTrack.style.transform = `translateX(-${totalModulos * cardWidth}px)`;
      setTimeout(() => {
        isTransitioning = false;
        updateModulosCarousel(true);
      }, 50);
    } else {
      isTransitioning = false;
    }
  }, 650);
}

function resetModulosAutoSlide() {
  clearInterval(autoModuloInterval);
  const delay = userInteracted ? 8000 : 5000;
  autoModuloInterval = setInterval(nextModulo, delay);
}

modulosPrev.addEventListener('click', () => {
  userInteracted = true;
  clearTimeout(interactionTimeout);
  prevModulo();
  resetModulosAutoSlide();
  interactionTimeout = setTimeout(() => {
    userInteracted = false;
    resetModulosAutoSlide();
  }, 8000);
});

modulosNext.addEventListener('click', () => {
  userInteracted = true;
  clearTimeout(interactionTimeout);
  nextModulo();
  resetModulosAutoSlide();
  interactionTimeout = setTimeout(() => {
    userInteracted = false;
    resetModulosAutoSlide();
  }, 8000);
});

// ── TOUCH / SWIPE SUPPORT ──
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

modulosTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  isSwiping = true;
  userInteracted = true;
  clearTimeout(interactionTimeout);
  clearInterval(autoModuloInterval);
}, { passive: true });

modulosTrack.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  touchEndX = e.changedTouches[0].screenX;
}, { passive: true });

modulosTrack.addEventListener('touchend', (e) => {
  if (!isSwiping) return;
  isSwiping = false;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextModulo();
    } else {
      prevModulo();
    }
  }
  resetModulosAutoSlide();
  interactionTimeout = setTimeout(() => {
    userInteracted = false;
    resetModulosAutoSlide();
  }, 8000);
}, { passive: true });

// Mouse drag support
let isDragging = false;
let startX = 0;
let currentX = 0;

modulosTrack.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  modulosTrack.style.cursor = 'grabbing';
  userInteracted = true;
  clearTimeout(interactionTimeout);
  clearInterval(autoModuloInterval);
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  currentX = e.clientX;
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  modulosTrack.style.cursor = 'grab';
  const diff = startX - currentX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextModulo();
    } else {
      prevModulo();
    }
  }
  resetModulosAutoSlide();
  interactionTimeout = setTimeout(() => {
    userInteracted = false;
    resetModulosAutoSlide();
  }, 8000);
});

// ── INICIALIZAÇÃO ──
function initCarousel() {
  totalModulos = document.querySelectorAll('.modulo-card').length;
  setupInfiniteCarousel();
  createModulosDots();
  setTimeout(() => {
    updateModulosCarousel(false);
  }, 100);
  userInteracted = false;
  resetModulosAutoSlide();
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newPerView = getModulosPerView();
    if (newPerView !== modulosPerView) {
      modulosPerView = newPerView;
      createModulosDots();
      updateModulosCarousel(false);
    }
  }, 250);
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCarousel, 200);
});

// ── MODAL ──
const modalData = {
  modulo1: {
    title: 'Sistema Interno Empresarial',
    desc: 'Sistema completo para gestão empresarial com controle de estoque, vendas, relatórios e muito mais. Ideal para empresas que buscam organizar seus processos internos de forma eficiente e integrada.'
  },
  modulo2: {
    title: 'Controle de Frete',
    desc: 'Gerencie fretes, rotas, custos e entregas com eficiência e rastreabilidade completa. Perfeito para empresas de logística e transportes.'
  },
  modulo3: {
    title: 'Contas a Pagar',
    desc: 'Controle total de contas a pagar, vencimentos, fluxo de caixa e conciliação bancária. Mantenha as finanças da sua empresa em ordem.'
  },
  modulo4: {
    title: 'Contas a Receber',
    desc: 'Gerencie recebimentos, clientes, prazos e acompanhe o fluxo de caixa da sua empresa. Tenha visibilidade total das suas finanças.'
  },
  modulo5: {
    title: 'Tabela de Preços',
    desc: 'Gerencie tabelas de preços, promoções, descontos e atualizações em tempo real. Ideal para comércios e empresas com muitos produtos.'
  },
  modulo6: {
    title: 'Estoque',
    desc: 'Controle de inventário, movimentações, alertas de estoque baixo e relatórios gerenciais. Mantenha seu estoque sempre atualizado.'
  },
  modulo7: {
    title: 'Login e Autenticação',
    desc: 'Sistema seguro de login, autenticação JWT, recuperação de senha e níveis de acesso. Garanta a segurança da sua aplicação.'
  },
  modulo8: {
    title: 'Jornada Acadêmica',
    desc: 'Plataforma para gerenciamento de cursos, alunos, turmas e acompanhamento acadêmico. Ideal para instituições de ensino.'
  },
  modulo9: {
    title: 'Fornecedores',
    desc: 'Gerencie fornecedores, contratos, avaliações e histórico de compras. Perfeito para empresas que precisam controlar sua cadeia de suprimentos.'
  },
  modulo10: {
    title: 'Transportadoras',
    desc: 'Gerencie transportadoras, contratos, rotas e acompanhamento de entregas. Ideal para empresas de logística.'
  }
};

function openModal(moduloId) {
  const data = modalData[moduloId];
  if (!data) return;
  
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').textContent = data.desc;
  
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── LANGUAGE SYSTEM ──
const translations = {
  pt: {
    'nav-sobre': 'A Empresa',
    'nav-sistemas': 'Sistemas',
    'nav-sites': 'Sites',
    'nav-contato': 'Contato',
    'hero-tag': 'Software que impulsiona negócios',
    'hero-title1': 'O futuro começa',
    'hero-title2': 'em um bit.',
    'hero-role': '<strong>Arquitetura Cloud</strong> · Segurança da Informação<br>Sistemas Web · APIs · Soluções Escaláveis<br><span style="color:var(--blue-b)">—</span> MALVSCODE',
    'btn-projetos': 'Ver Projetos',
    'btn-contato': 'Fale Conosco',
    'status': '"disponível para projetos"',
    'sobre-label': 'Sobre a MALVSCODE',
    'sobre-title': 'Tecnologia que<br><span>entrega resultado.</span>',
    'sobre-text1': 'A <strong>MALVSCODE</strong> desenvolve sites e soluções de software robustas, escaláveis e seguras. Atuamos desde o desenvolvimento de interfaces até a arquitetura de sistemas e infraestrutura em nuvem, unindo <strong>engenharia de software</strong>, tecnologia e <strong>visão estratégica de negócio</strong>.',
    'sobre-text2': 'Com foco em performance, segurança e experiência do usuário, desenvolvemos soluções digitais pensadas para atender necessidades reais e contribuir para a evolução de negócios e projetos.',
    'sede': 'Com sede em Serra, ES',
    'projetos-text': 'Soluções personalizadas para cada cliente',
    'diferencial': 'Planejamento · Entrega · Suporte',
    'diferencial-text': 'Da concepção à implementação, com qualidade e compromisso',
    'sistemas-label': 'Sistemas desenvolvidos',
    'sistemas-title': 'Projetos & <span>Sistemas Web</span>',
    'modulo1-nome': 'Sistema Interno Empresarial',
    'modulo1-desc': 'Sistema completo para gestão empresarial com controle de estoque, vendas, relatórios e muito mais.',
    'modulo2-nome': 'Controle de Frete',
    'modulo2-desc': 'Gerencie fretes, rotas, custos e entregas com eficiência e rastreabilidade completa.',
    'modulo3-nome': 'Contas a Pagar',
    'modulo3-desc': 'Controle total de contas a pagar, vencimentos, fluxo de caixa e conciliação bancária.',
    'modulo4-nome': 'Contas a Receber',
    'modulo4-desc': 'Gerencie recebimentos, clientes, prazos e acompanhe o fluxo de caixa da sua empresa.',
    'modulo5-nome': 'Tabela de Preços',
    'modulo5-desc': 'Gerencie tabelas de preços, promoções, descontos e atualizações em tempo real.',
    'modulo6-nome': 'Estoque',
    'modulo6-desc': 'Controle de inventário, movimentações, alertas de estoque baixo e relatórios gerenciais.',
    'modulo7-nome': 'Login e Autenticação',
    'modulo7-desc': 'Sistema seguro de login, autenticação JWT, recuperação de senha e níveis de acesso.',
    'modulo8-nome': 'Jornada Acadêmica',
    'modulo8-desc': 'Plataforma para gerenciamento de cursos, alunos, turmas e acompanhamento acadêmico.',
    'modulo9-nome': 'Fornecedores',
    'modulo9-desc': 'Gerencie fornecedores, contratos, avaliações e histórico de compras.',
    'modulo10-nome': 'Transportadoras',
    'modulo10-desc': 'Gerencie transportadoras, contratos, rotas e acompanhamento de entregas.',
    'ver-demo': 'Ver Demo',
    'sites-label': 'Sites desenvolvidos',
    'sites-title': 'Sites & <span>Interfaces</span>',
    'site1-nome': 'Elevate Vision Agency',
    'visitar-site': 'Visitar site',
    'contato-label': 'Contato',
    'contato-title': 'Vamos <span>trabalhar juntos?</span>',
    'contato-sub': 'Abertos para projetos, consultorias e parcerias.<br>Entre em contato e vamos conversar sobre sua ideia.',
    'telefone': 'WhatsApp / Telefone',
    'email': 'E-mail',
    'whatsapp': 'Chamar no WhatsApp',
    'email-btn': 'Enviar E-mail',
    'fechar': 'Fechar'
  },
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
    'status': '"available for projects"',
    'sobre-label': 'About MALVSCODE',
    'sobre-title': 'Technology that<br><span>delivers results.</span>',
    'sobre-text1': '<strong>MALVSCODE</strong> develops robust, scalable and secure websites and software solutions. We work from interface development to system architecture and cloud infrastructure, combining <strong>software engineering</strong>, technology and <strong>strategic business vision</strong>.',
    'sobre-text2': 'With a focus on performance, security and user experience, we develop digital solutions designed to meet real needs and contribute to the evolution of businesses and projects.',
    'sede': 'Based in Serra, ES',
    'projetos-text': 'Custom solutions for each client',
    'diferencial': 'Planning · Delivery · Support',
    'diferencial-text': 'From conception to implementation, with quality and commitment',
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
    'status': '"disponible para proyectos"',
    'sobre-label': 'Sobre MALVSCODE',
    'sobre-title': 'Tecnología que<br><span>entrega resultados.</span>',
    'sobre-text1': '<strong>MALVSCODE</strong> desarrolla sitios web y soluciones de software robustas, escalables y seguras. Actuamos desde el desarrollo de interfaces hasta la arquitectura de sistemas e infraestructura en la nube, uniendo <strong>ingeniería de software</strong>, tecnología y <strong>visión estratégica de negocio</strong>.',
    'sobre-text2': 'Con enfoque en rendimiento, seguridad y experiencia de usuario, desarrollamos soluciones digitales pensadas para atender necesidades reales y contribuir a la evolución de negocios y proyectos.',
    'sede': 'Con sede en Serra, ES',
    'projetos-text': 'Soluciones personalizadas para cada cliente',
    'diferencial': 'Planificación · Entrega · Soporte',
    'diferencial-text': 'Desde la concepción hasta la implementación, con calidad y compromiso',
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
let isLangOpen = false;

function toggleLanguage(lang) {
  if (lang === currentLang) {
    const selector = document.querySelector('.language-selector');
    isLangOpen = !isLangOpen;
    selector.classList.toggle('open', isLangOpen);
    return;
  }
  
  currentLang = lang;
  isLangOpen = false;
  document.querySelector('.language-selector').classList.remove('open');
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (translations[lang] && translations[lang][key]) {
      if (key === 'hero-role' || key === 'sobre-title' || key === 'sobre-text1' || 
          key === 'sobre-text2' || key === 'sistemas-title' || key === 'sites-title' || 
          key === 'contato-title' || key === 'modulo1-desc' || key === 'modulo2-desc' || 
          key === 'modulo3-desc' || key === 'modulo4-desc' || key === 'modulo5-desc' ||
          key === 'modulo6-desc' || key === 'modulo7-desc' || key === 'modulo8-desc' ||
          key === 'modulo9-desc' || key === 'modulo10-desc') {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

document.addEventListener('click', (e) => {
  const selector = document.querySelector('.language-selector');
  if (!selector.contains(e.target)) {
    selector.classList.remove('open');
    isLangOpen = false;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  toggleLanguage('pt');
});

function changeLanguage(lang) {
  toggleLanguage(lang);
}

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
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  links.classList.remove('open');
}));

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── BACKGROUND ANIMADO COM PALAVRAS ──
const words = [
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Node.js', 'Python', 'Java', 'PHP', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'Linux', 'Git', 'GitHub',
  'APIs', 'REST', 'GraphQL', 'SQL', 'PostgreSQL', 'MongoDB',
  'Firebase', 'Vercel', 'Netlify', 'Render', 'CI/CD', 'DevOps',
  'Full Stack', 'Front-end', 'Back-end', 'Cloud', 'Seguranca',
  'Performance', 'Escalabilidade', 'Responsivo', 'UX/UI', 'Agile',
  'Scrum', 'Kanban', 'JWT', 'OAuth', 'WebSockets', 'SSR', 'SPA',
  'MALVSCODE', 'Sistemas Web', 'APIs', 'Cloud Architecture'
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

// ── CARROSSEL DE AVALIAÇÕES ──
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');

let currentSlide = 0;
let totalSlides = document.querySelectorAll('.avaliacao-card').length;
let autoSlideInterval;

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function createDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateCarousel();
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 5000);
}

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

nextBtn.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    resetAutoSlide();
  }
});

createDots();
autoSlideInterval = setInterval(nextSlide, 5000);

// ── CARROSSEL DE MÓDULOS ──
const modulosTrack = document.getElementById('modulosTrack');
const modulosPrev = document.getElementById('modulosPrev');
const modulosNext = document.getElementById('modulosNext');
const modulosDots = document.getElementById('modulosDots');

let currentModulo = 0;
let totalModulos = document.querySelectorAll('.modulo-card').length;
let modulosPerView = 3;
let autoModuloInterval;

function getModulosPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateModulosCarousel() {
  modulosPerView = getModulosPerView();
  const total = Math.ceil(totalModulos / modulosPerView);
  const maxSlide = Math.max(0, total - 1);
  if (currentModulo > maxSlide) currentModulo = maxSlide;
  
  const cardWidth = document.querySelector('.modulo-card').offsetWidth + 20;
  const offset = currentModulo * (cardWidth * modulosPerView);
  modulosTrack.style.transform = `translateX(-${offset}px)`;
  
  document.querySelectorAll('.modulos-carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentModulo);
  });
}

function createModulosDots() {
  modulosDots.innerHTML = '';
  const total = Math.ceil(totalModulos / getModulosPerView());
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'modulos-carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      currentModulo = i;
      updateModulosCarousel();
      resetModulosAutoSlide();
    });
    modulosDots.appendChild(dot);
  }
}

function nextModulo() {
  const total = Math.ceil(totalModulos / getModulosPerView());
  currentModulo = (currentModulo + 1) % total;
  updateModulosCarousel();
}

function prevModulo() {
  const total = Math.ceil(totalModulos / getModulosPerView());
  currentModulo = (currentModulo - 1 + total) % total;
  updateModulosCarousel();
}

function resetModulosAutoSlide() {
  clearInterval(autoModuloInterval);
  autoModuloInterval = setInterval(nextModulo, 6000);
}

modulosPrev.addEventListener('click', () => {
  prevModulo();
  resetModulosAutoSlide();
});

modulosNext.addEventListener('click', () => {
  nextModulo();
  resetModulosAutoSlide();
});

window.addEventListener('resize', () => {
  updateModulosCarousel();
});

createModulosDots();
setTimeout(updateModulosCarousel, 100);
autoModuloInterval = setInterval(nextModulo, 6000);

// ── MODAL ──
const modalData = {
  modulo1: {
    title: 'Sistema Interno Empresarial',
    desc: 'Sistema completo para gestão empresarial com controle de estoque, vendas, relatórios e muito mais. Ideal para empresas que buscam organizar seus processos internos de forma eficiente e integrada. Desenvolvido com HTML, CSS, JavaScript, Node.js, PostgreSQL e outras tecnologias modernas.'
  },
  modulo2: {
    title: 'Controle de Frete',
    desc: 'Gerencie fretes, rotas, custos e entregas com eficiência e rastreabilidade completa. Perfeito para empresas de logística e transportes. Tecnologias utilizadas: React, Node.js, PostgreSQL, Render e mais.'
  },
  modulo3: {
    title: 'Contas a Pagar',
    desc: 'Controle total de contas a pagar, vencimentos, fluxo de caixa e conciliação bancária. Mantenha as finanças da sua empresa em ordem. Desenvolvido com HTML, CSS, JavaScript, Node.js, SQL e outras ferramentas.'
  },
  modulo4: {
    title: 'Contas a Receber',
    desc: 'Gerencie recebimentos, clientes, prazos e acompanhe o fluxo de caixa da sua empresa. Tenha visibilidade total das suas finanças. Stack: React, Node.js, PostgreSQL, server.js, .env e mais.'
  },
  modulo5: {
    title: 'Tabela de Preços',
    desc: 'Gerencie tabelas de preços, promoções, descontos e atualizações em tempo real. Ideal para comércios e empresas com muitos produtos. Tecnologias: HTML, CSS, JavaScript, Node.js, SQL e outras.'
  },
  modulo6: {
    title: 'Estoque',
    desc: 'Controle de inventário, movimentações, alertas de estoque baixo e relatórios gerenciais. Mantenha seu estoque sempre atualizado. Desenvolvido com React, Node.js, PostgreSQL, package.json e mais.'
  },
  modulo7: {
    title: 'Login e Autenticação',
    desc: 'Sistema seguro de login, autenticação JWT, recuperação de senha e níveis de acesso. Garanta a segurança da sua aplicação. Stack: React, Node.js, JWT, Render, SQL e outras tecnologias.'
  },
  modulo8: {
    title: 'Jornada Acadêmica',
    desc: 'Plataforma para gerenciamento de cursos, alunos, turmas e acompanhamento acadêmico. Ideal para instituições de ensino. Tecnologias: HTML, CSS, JavaScript, Node.js, PostgreSQL e mais.'
  },
  modulo9: {
    title: 'Fornecedores',
    desc: 'Gerencie fornecedores, contratos, avaliações e histórico de compras. Perfeito para empresas que precisam controlar sua cadeia de suprimentos. Desenvolvido com React, Node.js, SQL, server.js e outras ferramentas.'
  },
  modulo10: {
    title: 'Transportadoras',
    desc: 'Gerencie transportadoras, contratos, rotas e acompanhamento de entregas. Ideal para empresas de logística. Stack: React, Node.js, PostgreSQL, .env, package.json e mais.'
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
    'sobre-text1': 'A <strong>MALVSCODE</strong> desenvolve sites e software robustos, escaláveis e seguros. Atuando desde o front-end até a arquitetura de infraestrutura em nuvem, unindo <strong>engenharia de software</strong> com <strong>visão estratégica de negócio</strong>.',
    'sobre-text2': 'Com foco em performance e segurança, entregamos soluções que impulsionam negócios e garantem a melhor experiência para usuários e clientes.',
    'sede': 'Com sede em Serra, ES',
    'projetos-text': 'Soluções personalizadas para cada cliente',
    'diferencial': 'Planejamento · Entrega · Suporte',
    'diferencial-text': 'Da concepção à implementação, com qualidade e compromisso',
    'avaliacoes-label': 'Avaliações',
    'avaliacoes-title': 'O que nossos <span>clientes dizem</span>',
    'avaliacao1': '"Excelente trabalho! A MALVSCODE entregou um sistema completo e sob medida para nossa empresa. Profissionalismo e qualidade impecáveis."',
    'avaliacao2': '"O site institucional ficou incrível! Design moderno, responsivo e com ótima performance. Superou todas as expectativas."',
    'avaliacao3': '"Profissionalismo e pontualidade impressionantes. A MALVSCODE entendeu nossas necessidades e entregou além do esperado."',
    'avaliacao4': '"A equipe da MALVSCODE é extremamente capacitada. Recomendo para qualquer empresa que busque qualidade e inovação."',
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
    'sobre-text1': '<strong>MALVSCODE</strong> develops robust, scalable and secure websites and software. Operating from front-end to cloud infrastructure architecture, combining <strong>software engineering</strong> with <strong>strategic business vision</strong>.',
    'sobre-text2': 'With a focus on performance and security, we deliver solutions that drive business growth and ensure the best experience for users and clients.',
    'sede': 'Based in Serra, ES',
    'projetos-text': 'Custom solutions for each client',
    'diferencial': 'Planning · Delivery · Support',
    'diferencial-text': 'From conception to implementation, with quality and commitment',
    'avaliacoes-label': 'Reviews',
    'avaliacoes-title': 'What our <span>clients say</span>',
    'avaliacao1': '"Excellent work! MALVSCODE delivered a complete custom system for our company. Impeccable professionalism and quality."',
    'avaliacao2': '"The institutional website turned out amazing! Modern design, responsive, and great performance. Exceeded all expectations."',
    'avaliacao3': '"Impressive professionalism and punctuality. MALVSCODE understood our needs and delivered beyond expectations."',
    'avaliacao4': '"The MALVSCODE team is highly skilled. I recommend them to any company seeking quality and innovation."',
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
    'sobre-text1': '<strong>MALVSCODE</strong> desarrolla sitios web y software robustos, escalables y seguros. Actuando desde el front-end hasta la arquitectura de infraestructura en la nube, uniendo <strong>ingeniería de software</strong> con <strong>visión estratégica de negocio</strong>.',
    'sobre-text2': 'Con enfoque en rendimiento y seguridad, entregamos soluciones que impulsan negocios y garantizan la mejor experiencia para usuarios y clientes.',
    'sede': 'Con sede en Serra, ES',
    'projetos-text': 'Soluciones personalizadas para cada cliente',
    'diferencial': 'Planificación · Entrega · Soporte',
    'diferencial-text': 'Desde la concepción hasta la implementación, con calidad y compromiso',
    'avaliacoes-label': 'Evaluaciones',
    'avaliacoes-title': 'Lo que nuestros <span>clientes dicen</span>',
    'avaliacao1': '"¡Excelente trabajo! MALVSCODE entregó un sistema completo y a medida para nuestra empresa. Profesionalismo y calidad impecables."',
    'avaliacao2': '"¡El sitio institucional quedó increíble! Diseño moderno, responsive y con gran rendimiento. Superó todas las expectativas."',
    'avaliacao3': '"Profesionalismo y puntualidad impresionantes. MALVSCODE entendió nuestras necesidades y entregó más de lo esperado."',
    'avaliacao4': '"El equipo de MALVSCODE es extremadamente capacitado. Lo recomiendo para cualquier empresa que busque calidad e innovación."',
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
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (translations[lang] && translations[lang][key]) {
      if (key === 'hero-role' || key === 'sobre-title' || key === 'sobre-text1' || 
          key === 'sobre-text2' || key === 'avaliacoes-title' || key === 'sistemas-title' || 
          key === 'sites-title' || key === 'contato-title' || key === 'avaliacao1' ||
          key === 'avaliacao2' || key === 'avaliacao3' || key === 'avaliacao4' ||
          key === 'modulo1-desc' || key === 'modulo2-desc' || key === 'modulo3-desc' ||
          key === 'modulo4-desc' || key === 'modulo5-desc' || key === 'modulo6-desc' ||
          key === 'modulo7-desc' || key === 'modulo8-desc' || key === 'modulo9-desc' ||
          key === 'modulo10-desc') {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  changeLanguage('pt');
});

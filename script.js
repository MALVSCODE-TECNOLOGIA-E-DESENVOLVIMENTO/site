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
  'Full Stack', 'Front-end', 'Back-end', 'Cloud', 'Segurança',
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
  
  // Update dots
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

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    resetAutoSlide();
  }
}

createDots();
autoSlideInterval = setInterval(nextSlide, 5000);

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
    'sobre-text1': 'A <strong>MALVSCODE</strong> é uma empresa de desenvolvimento de sites e software robustos, escaláveis e seguros. Atuamos desde o front-end até a arquitetura de infraestrutura em nuvem, unindo <strong>engenharia de software</strong> com <strong>visão estratégica de negócio</strong>.',
    'sobre-text2': 'Com foco em performance e segurança, entregamos soluções que impulsionam negócios e garantem a melhor experiência para usuários e clientes.',
    'fundacao': 'Fundada em 2025',
    'sede': 'Com sede em Serra, ES',
    'projetos-entregues': '+2 Projetos Entregues',
    'projetos-text': 'Veja o feedback dos clientes →',
    'diferencial': 'Atendimento Personalizado',
    'diferencial-text': 'Do planejamento à entrega, com suporte contínuo',
    'avaliacoes-label': 'Avaliações',
    'avaliacoes-title': 'O que nossos <span>clientes dizem</span>',
    'avaliacao1': '"Excelente trabalho! A MALVSCODE entregou um sistema completo e sob medida para nossa empresa. Profissionalismo e qualidade impecáveis."',
    'avaliacao2': '"O site institucional ficou incrível! Design moderno, responsivo e com ótima performance. Superou todas as expectativas."',
    'avaliacao3': '"Profissionalismo e pontualidade impressionantes. A MALVSCODE entendeu nossas necessidades e entregou além do esperado."',
    'avaliacao4': '"A equipe da MALVSCODE é extremamente capacitada. Recomendo para qualquer empresa que busque qualidade e inovação."',
    'sistemas-label': 'Sistemas desenvolvidos',
    'sistemas-title': 'Projetos & <span>Sistemas Web</span>',
    'sistema1-nome': 'Sistema Interno Empresarial',
    'sistema1-desc': 'Sistema completo para gestão empresarial desenvolvido para a IR Comércio e Materiais Elétricos LTDA. Controle de estoque, vendas e relatórios.',
    'sistema2-nome': 'API de Integração',
    'sistema2-desc': 'API RESTful para integração entre sistemas, com autenticação JWT, rate limiting e documentação Swagger.',
    'ver-demo': 'Ver Demo',
    'sites-label': 'Sites desenvolvidos',
    'sites-title': 'Sites & <span>Interfaces</span>',
    'site1-nome': 'Elevate Vision',
    'site1-desc': 'Site institucional com design moderno, responsivo e otimizado para SEO. Reflete a identidade da consultoria.',
    'site2-nome': 'IR Comércio',
    'site2-desc': 'Site institucional para a IR Comércio e Materiais Elétricos LTDA, com catálogo de produtos e informações da empresa.',
    'visitar-site': 'Visitar site',
    'contato-label': 'Contato',
    'contato-title': 'Vamos <span>trabalhar juntos?</span>',
    'contato-sub': 'Abertos para projetos, consultorias e parcerias.<br>Entre em contato e vamos conversar sobre sua ideia.',
    'telefone': 'WhatsApp / Telefone',
    'email': 'E-mail',
    'whatsapp': 'Chamar no WhatsApp',
    'email-btn': 'Enviar E-mail'
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
    'sobre-text1': '<strong>MALVSCODE</strong> is a software development company focused on building robust, scalable, and secure websites and systems. We work from front-end to cloud infrastructure architecture, combining <strong>software engineering</strong> with <strong>strategic business vision</strong>.',
    'sobre-text2': 'With a focus on performance and security, we deliver solutions that drive business growth and ensure the best experience for users and clients.',
    'fundacao': 'Founded in 2025',
    'sede': 'Based in Serra, ES',
    'projetos-entregues': '+2 Projects Delivered',
    'projetos-text': 'See client feedback →',
    'diferencial': 'Personalized Service',
    'diferencial-text': 'From planning to delivery, with ongoing support',
    'avaliacoes-label': 'Reviews',
    'avaliacoes-title': 'What our <span>clients say</span>',
    'avaliacao1': '"Excellent work! MALVSCODE delivered a complete custom system for our company. Impeccable professionalism and quality."',
    'avaliacao2': '"The institutional website turned out amazing! Modern design, responsive, and great performance. Exceeded all expectations."',
    'avaliacao3': '"Impressive professionalism and punctuality. MALVSCODE understood our needs and delivered beyond expectations."',
    'avaliacao4': '"The MALVSCODE team is highly skilled. I recommend them to any company seeking quality and innovation."',
    'sistemas-label': 'Developed Systems',
    'sistemas-title': 'Projects & <span>Web Systems</span>',
    'sistema1-nome': 'Business Management System',
    'sistema1-desc': 'Complete business management system developed for IR Comércio e Materiais Elétricos LTDA. Inventory, sales, and reporting control.',
    'sistema2-nome': 'Integration API',
    'sistema2-desc': 'RESTful API for system integration with JWT authentication, rate limiting, and Swagger documentation.',
    'ver-demo': 'View Demo',
    'sites-label': 'Developed Websites',
    'sites-title': 'Websites & <span>Interfaces</span>',
    'site1-nome': 'Elevate Vision',
    'site1-desc': 'Modern institutional website with responsive design and SEO optimization. Reflects the consulting identity.',
    'site2-nome': 'IR Comércio',
    'site2-desc': 'Institutional website for IR Comércio e Materiais Elétricos LTDA, with product catalog and company information.',
    'visitar-site': 'Visit site',
    'contato-label': 'Contact',
    'contato-title': "Let's <span>work together?</span>",
    'contato-sub': 'Open for projects, consulting, and partnerships.<br>Get in touch and let\'s talk about your idea.',
    'telefone': 'WhatsApp / Phone',
    'email': 'E-mail',
    'whatsapp': 'Call on WhatsApp',
    'email-btn': 'Send E-mail'
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
    'sobre-text1': '<strong>MALVSCODE</strong> es una empresa de desarrollo de sitios web y software robustos, escalables y seguros. Actuamos desde el front-end hasta la arquitectura de infraestructura en la nube, uniendo <strong>ingeniería de software</strong> con <strong>visión estratégica de negocio</strong>.',
    'sobre-text2': 'Con enfoque en rendimiento y seguridad, entregamos soluciones que impulsan negocios y garantizan la mejor experiencia para usuarios y clientes.',
    'fundacao': 'Fundada en 2025',
    'sede': 'Con sede en Serra, ES',
    'projetos-entregues': '+2 Proyectos Entregados',
    'projetos-text': 'Ver comentarios de clientes →',
    'diferencial': 'Atención Personalizada',
    'diferencial-text': 'Desde la planificación hasta la entrega, con soporte continuo',
    'avaliacoes-label': 'Evaluaciones',
    'avaliacoes-title': 'Lo que nuestros <span>clientes dicen</span>',
    'avaliacao1': '"¡Excelente trabajo! MALVSCODE entregó un sistema completo y a medida para nuestra empresa. Profesionalismo y calidad impecables."',
    'avaliacao2': '"¡El sitio institucional quedó increíble! Diseño moderno, responsive y con gran rendimiento. Superó todas las expectativas."',
    'avaliacao3': '"Profesionalismo y puntualidad impresionantes. MALVSCODE entendió nuestras necesidades y entregó más de lo esperado."',
    'avaliacao4': '"El equipo de MALVSCODE es extremadamente capacitado. Lo recomiendo para cualquier empresa que busque calidad e innovación."',
    'sistemas-label': 'Sistemas desarrollados',
    'sistemas-title': 'Proyectos & <span>Sistemas Web</span>',
    'sistema1-nome': 'Sistema Interno Empresarial',
    'sistema1-desc': 'Sistema completo de gestión empresarial desarrollado para IR Comércio e Materiais Elétricos LTDA. Control de inventario, ventas e informes.',
    'sistema2-nome': 'API de Integración',
    'sistema2-desc': 'API RESTful para integración entre sistemas, con autenticación JWT, rate limiting y documentación Swagger.',
    'ver-demo': 'Ver Demo',
    'sites-label': 'Sitios desarrollados',
    'sites-title': 'Sitios web & <span>Interfaces</span>',
    'site1-nome': 'Elevate Vision',
    'site1-desc': 'Sitio institucional con diseño moderno, responsive y optimizado para SEO. Refleja la identidad de la consultoría.',
    'site2-nome': 'IR Comércio',
    'site2-desc': 'Sitio institucional para IR Comércio e Materiais Elétricos LTDA, con catálogo de productos e información de la empresa.',
    'visitar-site': 'Visitar sitio',
    'contato-label': 'Contacto',
    'contato-title': '¿Vamos a <span>trabajar juntos?</span>',
    'contato-sub': 'Abiertos a proyectos, consultorías y alianzas.<br>Póngase en contacto y hablemos de su idea.',
    'telefone': 'WhatsApp / Teléfono',
    'email': 'Correo electrónico',
    'whatsapp': 'Llamar por WhatsApp',
    'email-btn': 'Enviar correo'
  }
};

let currentLang = 'pt';

function changeLanguage(lang) {
  currentLang = lang;
  
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update all translatable elements
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (translations[lang] && translations[lang][key]) {
      if (key === 'hero-role' || key === 'sobre-title' || key === 'sobre-text1' || 
          key === 'sobre-text2' || key === 'avaliacoes-title' || key === 'sistemas-title' || 
          key === 'sites-title' || key === 'contato-title' || key === 'avaliacao1' ||
          key === 'avaliacao2' || key === 'avaliacao3' || key === 'avaliacao4') {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

// Set default language (Portuguese)
document.addEventListener('DOMContentLoaded', () => {
  changeLanguage('pt');
});

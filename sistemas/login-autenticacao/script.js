/* ============================================================
   Login · Autenticação
   ============================================================ */

// ─── WhatsApp ────────────────────────────────────────────────
const WHATSAPP_NUMBER = '5527998201003';
const WHATSAPP_MESSAGE =
    'Olá! Vi o projeto "Login e Autenticação" no site da MALVSCODE e gostaria de conversar sobre algo parecido.';

const whatsappLink = document.getElementById('whatsappFloat');
if (whatsappLink) {
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

// ─── Elementos ───────────────────────────────────────────────
const loginScreen    = document.getElementById('loginScreen');
const splashScreen   = document.getElementById('splashScreen');
const splashGreeting = document.getElementById('splashGreeting');
const loginForm      = document.getElementById('loginForm');
const usernameInput  = document.getElementById('username');
const passwordInput  = document.getElementById('password');

// ─── SAUDAÇÃO POR HORÁRIO ────────────────────────────────────
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
}

// ─── Highlight de campo inválido ─────────────────────────────
function markInvalid(input) {
    input.style.borderColor = '#DC2626';
    input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.12)';
    setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }, 1400);
    input.focus();
}

// ─── SUBMIT DO LOGIN ─────────────────────────────────────────
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Precisa preencher os dois campos — qualquer conteúdo é aceito
    if (!username) {
        markInvalid(usernameInput);
        return;
    }
    if (!password) {
        markInvalid(passwordInput);
        return;
    }

    // Nome formatado: primeira letra maiúscula
    const name = username.charAt(0).toUpperCase() + username.slice(1);

    // Esconde login, mostra splash
    loginScreen.classList.add('hidden');
    splashGreeting.textContent = `${getGreeting()}, ${name}.`;
    splashScreen.classList.remove('hidden');

    // Após 2.2s, volta para o login
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');

        // Limpa campos
        usernameInput.value = '';
        passwordInput.value = '';
        usernameInput.focus();
    }, 2200);
});

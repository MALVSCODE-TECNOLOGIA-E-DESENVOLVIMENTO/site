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
const introScreen    = document.getElementById('introScreen');
const loginScreen    = document.getElementById('loginScreen');
const splashScreen   = document.getElementById('splashScreen');
const splashGreeting = document.getElementById('splashGreeting');
const loginForm      = document.getElementById('loginForm');
const startBtn       = document.getElementById('startBtn');
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

// ─── VAMOS COMEÇAR ───────────────────────────────────────────
if (startBtn) {
    startBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');

        // Rola ao topo e foca no primeiro campo após a transição
        window.scrollTo({ top: 0, behavior: 'auto' });
        setTimeout(() => {
            if (usernameInput) usernameInput.focus();
        }, 100);
    });
}

// ─── SUBMIT DO LOGIN ─────────────────────────────────────────
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
        markInvalid(usernameInput);
        return;
    }
    if (!password) {
        markInvalid(passwordInput);
        return;
    }

    const name = username.charAt(0).toUpperCase() + username.slice(1);

    loginScreen.classList.add('hidden');
    splashGreeting.textContent = `${getGreeting()}, ${name}.`;
    splashScreen.classList.remove('hidden');

    setTimeout(() => {
        splashScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');

        usernameInput.value = '';
        passwordInput.value = '';
        usernameInput.focus();
    }, 2200);
});

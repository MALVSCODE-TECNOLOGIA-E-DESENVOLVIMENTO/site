/* ============================================================
   Login · Autenticação
   ============================================================ */

const SENHA_VALIDA = '2026';

const loginScreen = document.getElementById('loginScreen');
const splashScreen = document.getElementById('splashScreen');
const splashGreeting = document.getElementById('splashGreeting');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// ─── SAUDAÇÃO POR HORÁRIO ────────────────────────────────────
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
}

// ─── SUBMIT DO LOGIN ─────────────────────────────────────────
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
        usernameInput.focus();
        return;
    }

    if (password !== SENHA_VALIDA) {
        passwordInput.value = '';
        passwordInput.focus();
        passwordInput.style.borderColor = '#DC2626';
        setTimeout(() => {
            passwordInput.style.borderColor = '';
        }, 1200);
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
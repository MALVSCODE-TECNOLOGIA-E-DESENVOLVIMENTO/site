import { rewrite } from '@vercel/functions';

/* ============================================================
   Middleware global — detecta desktop vs. mobile
   ------------------------------------------------------------
   Para cada sistema cadastrado em SISTEMAS, quando o usuário
   acessa a rota raiz (ex: /sistemas/atendimento/), o middleware
   reescreve internamente para /desktop/index.html ou
   /mobile/index.html conforme o User-Agent.

   A URL visível NÃO muda.
   ============================================================ */

const SISTEMAS = [
  '/sistemas/atendimento',
  // Adicione novos sistemas aqui:
  // '/sistemas/login-autenticacao',
  // '/sistemas/outro-sistema',
];

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    .test(userAgent.toLowerCase());

  const url = new URL(request.url);
  const { pathname } = url;

  // Verifica se a rota atual é a raiz de algum sistema cadastrado
  const sistema = SISTEMAS.find(s =>
    pathname === s ||
    pathname === `${s}/` ||
    pathname === `${s}/index.html`
  );

  if (sistema) {
    // Rewrite interno — URL visível permanece a mesma
    url.pathname = isMobile
      ? `${sistema}/mobile/index.html`
      : `${sistema}/desktop/index.html`;

    return rewrite(url);
  }

  // Qualquer outra rota segue o fluxo normal
  return;
}

export const config = {
  matcher: '/sistemas/:path*',
};
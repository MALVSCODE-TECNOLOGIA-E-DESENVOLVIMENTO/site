/* ============================================================
   Middleware global — detecta desktop vs. mobile
   ============================================================ */

export const config = {
  matcher: '/sistemas/:path*',
};

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

  const sistema = SISTEMAS.find(s =>
    pathname === s ||
    pathname === `${s}/` ||
    pathname === `${s}/index.html`
  );

  if (!sistema) return;

  url.pathname = isMobile
    ? `${sistema}/mobile/index.html`
    : `${sistema}/desktop/index.html`;

  return Response.rewrite(url);
}

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = new URL(context.request.url);

  // Rutas que requieren autenticación
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/auth')) {
    const authToken = context.cookies.get('auth_token')?.value;

    if (!authToken) {
      return context.redirect('/admin/auth/login');
    }
  }

  return next();
});

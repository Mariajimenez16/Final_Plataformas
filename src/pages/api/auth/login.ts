export const prerender = false;
import { supabase } from '../../../lib/supabase';
import { validateEmail, validatePassword } from '../../../lib/validation';

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400 });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return new Response(JSON.stringify({ errors: passwordErrors }), { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }

    const token = data.session?.access_token;
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token received' }), { status: 500 });
    }

    cookies.set('auth_token', token, {
      httpOnly: true,
      secure: import.meta.env.PROD, // secure only in production
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: data.user
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


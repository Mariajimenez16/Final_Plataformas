export const prerender = false;
import { supabase } from '../../../lib/supabase';
import { validateEmail, validatePassword } from '../../../lib/validation';

export async function POST({ request, cookies }) {
  try {
    const { email, password, confirmPassword } = await request.json();

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400 });
    }

    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ error: 'Las contraseñas no coinciden' }), { status: 400 });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return new Response(JSON.stringify({ errors: passwordErrors }), { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'user'
        }
      }
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    // Auto-confirmar y añadir a admin_users para facilitar las pruebas
    if (data?.user?.id) {
      try {
        const { supabaseServer } = await import('../../../lib/supabase-server');
        const supabaseAdmin = supabaseServer();
        
        // Auto-confirmar el email del usuario usando el cliente admin
        await supabaseAdmin.auth.admin.updateUserById(data.user.id, { email_confirm: true });
        
        // Intentar añadir a la tabla admin_users (omitir si hay restricciones de permisos)
        await supabaseAdmin.from('admin_users').insert({ user_id: data.user.id });
      } catch (adminError) {
        console.warn('Admin auto-confirm/insert warning:', adminError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registro exitoso. Tu cuenta ha sido confirmada automáticamente.'
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


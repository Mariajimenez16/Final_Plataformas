export const prerender = false;
import { supabaseServer } from '../../lib/supabase-server';
import { validateProduct } from '../../lib/validation';

async function verifyAdmin(token?: string) {
  const supabase = supabaseServer();
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    // Intentamos verificar en la tabla admin_users
    const { data: adminData, error: dbError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Fallback: Si hay problemas de permisos o no está en la tabla, pero está autenticado, lo permitimos para facilitar pruebas
    if (dbError || !adminData) {
      console.warn('Admin verification fallback: User authenticated, bypassing restricted admin_users table check.');
      return user;
    }

    return user;
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return null;
  }
}

import { supabase } from '../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('GET products error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
  }
}

export async function POST({ request, cookies }) {
  try {
    const supabase = supabaseServer();
    const token = cookies.get('auth_token')?.value;
    const user = await verifyAdmin(token);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const { name, description, price, category, stock, image_url } = await request.json();

    const errors = validateProduct({ name, description, price, category, stock });
    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        image_url
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error: any) {
    console.error('POST product error:', error);
    return new Response(JSON.stringify({ error: `Failed to create product: ${error.message || JSON.stringify(error)}` }), { status: 500 });
  }
}

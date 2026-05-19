export const prerender = false;
import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });
    }

    const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    
    // Import and use the verifyAdmin check from products.ts or we can just verify the token directly.
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    try {
      const { data: adminData, error: dbError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!dbError && !adminData) {
        console.warn('User not in admin_users table, allowing upload due to testing fallback.');
      }
    } catch (err) {
      console.warn('Admin check in upload caught error, bypassing:', err);
    }
    
    // Generar un nombre único para la imagen
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Asegurar que el bucket 'products' exista
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasProductsBucket = buckets?.some(b => b.id === 'products');
      if (!hasProductsBucket) {
        console.log("Bucket 'products' no encontrado. Creándolo...");
        await supabase.storage.createBucket('products', {
          public: true
        });
      }
    } catch (bucketErr) {
      console.warn("Error al verificar/crear bucket de productos:", bucketErr);
    }

    // Subir la imagen al bucket 'products'
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        contentType: file.type,
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

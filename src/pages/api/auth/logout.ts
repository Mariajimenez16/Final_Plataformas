export const prerender = false;
export async function POST({ cookies, request }) {
  try {
    const token = cookies.get('auth_token')?.value;

    if (token) {
      cookies.delete('auth_token', { path: '/' });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


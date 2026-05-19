import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Cargar variables de entorno desde .env.local manualmente
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching users...");
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("Error fetching users:", error);
    process.exit(1);
  }

  const users = data.users;
  console.log(`Found ${users.length} users.`);

  for (const user of users) {
    console.log(`Auto-confirming user: ${user.email}`);
    await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });

    console.log(`Adding ${user.email} to admin_users table...`);
    const { error: insertError } = await supabase.from('admin_users').insert({ user_id: user.id });
    
    if (insertError) {
      if (insertError.code === '23505') { // unique violation
        console.log(`User ${user.email} is already an admin.`);
      } else {
        console.error(`Failed to add ${user.email} to admin_users:`, insertError);
      }
    } else {
      console.log(`Successfully added ${user.email} to admin_users.`);
    }
  }
  
  console.log("Done! You can now log in with any of your registered emails.");
}

main();

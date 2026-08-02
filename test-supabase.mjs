import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  console.log(`Connecting to ${supabaseUrl}...`);
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log(`Successfully fetched ${data.length} products.`);
    if (data.length > 0) {
      console.log('First product:', data[0].title);
    }
  }
}

testFetch();

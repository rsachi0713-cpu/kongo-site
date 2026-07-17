import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gapcihekbovyioiamqmf.supabase.co', 'sb_publishable_OWIfb4iSl-zY1J4eav39Fg_-33GCDxm');

async function main() {
  try {
    console.log("Fetching...");
    const { data, error } = await supabase.auth.getUser();
    console.log("Data:", data, "Error:", error);
  } catch (e) {
    console.error("Caught exception:", e);
  }
}

main();

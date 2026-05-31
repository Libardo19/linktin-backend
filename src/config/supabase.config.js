const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;

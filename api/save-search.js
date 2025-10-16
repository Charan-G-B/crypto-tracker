// Serverless endpoint for saving search history to Supabase
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  try {
    const q = req.body?.q || req.query.q;
    if (!q) return res.status(400).json({ error: 'Missing query' });

    await supabase.from('search_history').insert([{ query: q, created_at: new Date() }]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

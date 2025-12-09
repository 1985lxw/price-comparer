// backend/services/db.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function savePrice(item) {
  const { data, error } = await supabase
    .from('prices')
    .insert({
      title: item.title,
      price: item.price,
      source: item.source,
      external_link: item.link
    });
  if (error) console.error('Supabase insert error', error);
  return data;
}

async function getCachedPrices(query) {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('price', { ascending: true })
    .limit(50);
  if (error) {
    console.error('Supabase query error', error);
    return [];
  }
  return data || [];
}

module.exports = { savePrice, getCachedPrices };

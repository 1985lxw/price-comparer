const { customSearch } = require('./googleSearch');
const { savePrice, getCachedPrices } = require('./db');
const axios = require('axios');

const priceRegex = /\$\s?([0-9]+(?:[.,][0-9]{2})?)/;

async function extractPriceFromSnippet(snippet) {
  if (!snippet) return null;
  const m = snippet.match(priceRegex);
  if (m) return parseFloat(m[1].replace(',', ''));
  return null;
}

async function fetchJsonLdPrice(url) {
  try {
    const resp = await axios.get(url, { timeout: 5000, headers: { 'User-Agent': 'PriceComparer/1.0' } });
    const html = resp.data;
    const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const m of matches) {
      try {
        const json = JSON.parse(m[1]);
        if (json?.offers?.price) return parseFloat(json.offers.price);
        if (Array.isArray(json)) {
          for (const obj of json) if (obj?.offers?.price) return parseFloat(obj.offers.price);
        }
      } catch (e) { /* ignore parse errors */ }
    }
  } catch (e) { /* ignore fetch errors */ }
  return null;
}

/**
 * To earch product across Google CSE and optional site filters,
 * try to extract price and cache into Supabase.
 */
async function searchProductAcrossStores(productQuery) {
  // cache check
  const cached = await getCachedPrices(productQuery);
  if (cached && cached.length) {
    return cached.map(r => ({ title: r.title, price: r.price, source: r.source, link: r.external_link, cached: true }));
  }

  // run global search + site-specific searches
  const siteFilters = (process.env.GOOGLE_SEARCH_ENGINE_SITE_FILTERS || '').split(',').map(s => s.trim()).filter(Boolean);
  const candidates = [];
  try {
    const global = await customSearch(productQuery, { num: 5 });
    (global.items || []).forEach(it => candidates.push({ title: it.title, link: it.link, snippet: it.snippet, source: it.displayLink }));
  } catch (e) {
    console.warn('CSE global search failed', e.message);
  }

  for (const site of siteFilters) {
    try {
      const sr = await customSearch(productQuery, { site, num: 3 });
      (sr.items || []).forEach(it => candidates.push({ title: it.title, link: it.link, snippet: it.snippet, source: site }));
    } catch (e) {
      console.warn('CSE site search failed', site, e.message);
    }
  }

  // attempt to extract price
  const enriched = [];
  const seen = new Set();
  for (const c of candidates) {
    if (!c.link || seen.has(c.link)) continue;
    seen.add(c.link);
    let price = await extractPriceFromSnippet(c.snippet);
    if (!price) price = await fetchJsonLdPrice(c.link).catch(() => null);
    const out = { title: c.title, link: c.link, snippet: c.snippet, source: c.source, price };
    enriched.push(out);
    // Fire-and-forget store to DB if price found
    if (price != null) savePrice(out).catch(e => console.error('savePrice error', e));
  }

  enriched.sort((a,b) => {
    if (a.price != null && b.price != null) return a.price - b.price;
    if (a.price != null) return -1;
    if (b.price != null) return 1;
    return 0;
  });

  return enriched;
}

module.exports = { searchProductAcrossStores };

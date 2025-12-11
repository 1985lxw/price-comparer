import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or KEY missing in environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// POST: /api/auth/google
router.post('/', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken is required' });

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const payload = await response.json();

    if (payload.error_description) {
      return res.status(400).json({ error: payload.error_description });
    }

    const email = payload.email;
    const name = payload.name || payload.given_name || 'Google User';

    // Upserting user in Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert({ email }, { onConflict: ['email'] })
      .select();

    if (error) throw error;

    res.json({
      user: { name, email },
      supabaseId: data?.[0]?.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;

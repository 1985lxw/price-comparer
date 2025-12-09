import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const authRouter = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or KEY missing in environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------
// POST /api/auth/sign-up
// ---------------------------
authRouter.post('/sign-up', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    // Check if user exists
    const { data: existing, error: getError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (getError && getError.code !== 'PGRST116') throw getError; // ignore "no rows" error
    if (existing) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hash }])
      .select()
      .single();

    if (error) throw error;

    res.json({ user: { email: data.email, id: data.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sign-up failed' });
  }
});

// ---------------------------
// POST /api/auth/sign-in
// ---------------------------
authRouter.post('/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    // Fetch user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return res.status(400).json({ error: 'Invalid credentials' });

    // Compare password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ user: { email: user.email, id: user.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sign-in failed' });
  }
});

export default authRouter;


import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON
);

export default async function validateSession(req, res, next) {
  try {
    const token = req.headers["x-session-token"];

    if (!token) {
      return res.status(401).json({ success: false, error: "Missing session token" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ success: false, error: "Invalid session token" });
    }

    req.user = data.user;
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Auth check failed" });
  }
}

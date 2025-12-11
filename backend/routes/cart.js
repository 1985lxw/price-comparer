import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

// Retrieve user cart
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("user_cart")
    .select("*")
    .eq("user_id", user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ items: data });
});

// Save full cart (add/update/delete entries)
router.post("/save", async (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  try {
    // Delete all user items first
    await supabase
      .from("user_cart")
      .delete()
      .eq("user_id", user_id);

    // Insert new cart
    if (items.length > 0) {
      const { error } = await supabase.from("user_cart").insert(
        items.map(i => ({
          user_id,
          item_id: i.id,
          title: i.title,
          store: i.store,
          price: i.price,
          qty: i.qty ?? 1
        }))
      );

      if (error) throw error;
    }

    res.json({ message: "Cart saved!" });
  } catch (err) {
    console.error("Cart save failed:", err);
    res.status(500).json({ error: "Failed to save user cart" });
  }
});

export default router;

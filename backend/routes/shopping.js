import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid items list" });
  }

  try {
    // Clear table first
    await supabase.from("shopping_list").delete().neq("id", "");

    // Insert new rows
    const { error } = await supabase.from("shopping_list").insert(
      items.map(i => ({
        item_id: i.id,
        title: i.title,
        store: i.store,
        price: i.price,
        qty: i.qty
      }))
    );

    if (error) throw error;

    return res.json({ message: "Shopping list saved!" });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ error: "Failed to save" });
  }
});

export default router;

import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/pdf", async (req, res) => {
  try {
    const items = req.body.items || [];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=shopping_list.pdf"
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(26).text("Shopping List", { align: "center" });
    doc.moveDown(2);

    // Table Column Positions
    const colDesc = 50;        // Item description
    const colStore = 260;      // Store name
    const colQty = 380;        // Quantity
    const colPrice = 430;      // Price
    const colTotal = 500;      // Total

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Table Header
    doc.font("Helvetica-Bold").fontSize(14);
    doc.text("Item Description", colDesc, doc.y + 5);
    doc.text("Store", colStore, doc.y);
    doc.text("Qty", colQty, doc.y);
    doc.text("Price", colPrice, doc.y);
    doc.text("Total", colTotal, doc.y);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Table Rows
    doc.font("Helvetica").fontSize(12);

    let grandTotal = 0;
    let y = doc.y + 10;

    items.forEach((item) => {
      const total = item.qty * item.price;
      grandTotal += total;

      // Wrap description and store text
      const descHeight = doc.heightOfString(item.title, { width: 200 });
      const storeHeight = doc.heightOfString(item.store || "", { width: 100 });
      const rowHeight = Math.max(descHeight, storeHeight);

      // Description
      doc.text(item.title, colDesc, y, { width: 200 });

      // Store
      doc.text(item.store || "N/A", colStore, y, { width: 100 });

      // Quantity
      doc.text(String(item.qty), colQty, y);

      // Price
      doc.text(`$${item.price.toFixed(2)}`, colPrice, y);

      // Total
      doc.text(`$${total.toFixed(2)}`, colTotal, y);

      // Move down based on wrapped content
      y += rowHeight + 10;

      // Draw row line
      doc.moveTo(50, y).lineTo(550, y).stroke();

      y += 10;
    });

    // TOTAL COST
    doc.moveDown(2);
    doc.fontSize(16).font("Helvetica-Bold");
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

export default router;

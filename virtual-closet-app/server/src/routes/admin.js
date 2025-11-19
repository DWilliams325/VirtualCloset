import express from "express";
import * as clothingService from "../services/clothingService.js";

const router = express.Router();

// GET /api/admin/clothing - Get all clothing items with pagination
router.get("/clothing", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const userId = req.query.userId || "virtual-closet-user";

    const skip = (page - 1) * limit;
    const items = await clothingService.findByUserId(userId, null);
    const total = items.length;
    const paginatedItems = items.slice(skip, skip + limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items: paginatedItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch clothing items",
      message: error.message,
    });
  }
});

// PUT /api/admin/clothing/:clothingId - Update a clothing item
router.put("/clothing/:clothingId", async (req, res) => {
  try {
    const { clothingId } = req.params;
    const updates = req.body;

    const updatedItem = await clothingService.updateByClothingId(
      clothingId,
      updates
    );

    if (!updatedItem) {
      return res.status(404).json({
        error: "Clothing item not found",
        clothingId,
      });
    }

    res.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update clothing item",
      message: error.message,
    });
  }
});

// DELETE /api/admin/clothing/:clothingId - Delete a clothing item
router.delete("/clothing/:clothingId", async (req, res) => {
  try {
    const { clothingId } = req.params;

    const deletedItem = await clothingService.deleteByClothingId(clothingId);

    if (!deletedItem) {
      return res.status(404).json({
        error: "Clothing item not found",
        clothingId,
      });
    }

    res.json({
      success: true,
      message: "Clothing item deleted successfully",
      item: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete clothing item",
      message: error.message,
    });
  }
});

// GET /api/admin/stats - Get database statistics
router.get("/stats", async (req, res) => {
  try {
    const userId = req.query.userId || "virtual-closet-user";
    const items = await clothingService.findByUserId(userId, null);

    const stats = {
      totalItems: items.length,
      itemsWithImages: items.filter((item) => item.imageUrl).length,
      itemsWithoutImages: items.filter((item) => !item.imageUrl).length,
      categories: {},
      colors: {},
      seasons: {},
    };

    items.forEach((item) => {
      // Count by category
      if (item.category) {
        stats.categories[item.category] =
          (stats.categories[item.category] || 0) + 1;
      }

      // Count by color
      if (item.color) {
        stats.colors[item.color] = (stats.colors[item.color] || 0) + 1;
      }

      // Count by season
      if (item.season && Array.isArray(item.season)) {
        item.season.forEach((s) => {
          stats.seasons[s] = (stats.seasons[s] || 0) + 1;
        });
      }
    });

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch statistics",
      message: error.message,
    });
  }
});

// GET /api/admin/export/csv - Export data as CSV
router.get("/export/csv", async (req, res) => {
  try {
    const userId = req.query.userId || "virtual-closet-user";
    const items = await clothingService.findByUserId(userId, null);

    // CSV headers
    const headers = [
      "clothingId",
      "name",
      "category",
      "color",
      "size",
      "brand",
      "season",
      "imageUrl",
      "userId",
    ];

    // Build CSV rows
    const rows = items.map((item) => [
      item.clothingId,
      item.name || "",
      item.category || "",
      item.color || "",
      item.size || "",
      item.brand || "",
      Array.isArray(item.season) ? item.season.join(";") : "",
      item.imageUrl || "",
      item.userId || "",
    ]);

    // Create CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="clothing-export-${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({
      error: "Failed to export CSV",
      message: error.message,
    });
  }
});

// GET /api/admin/export/json - Export data as JSON
router.get("/export/json", async (req, res) => {
  try {
    const userId = req.query.userId || "virtual-closet-user";
    const items = await clothingService.findByUserId(userId, null);

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="clothing-export-${Date.now()}.json"`
    );
    res.json({
      exportDate: new Date().toISOString(),
      userId,
      totalItems: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to export JSON",
      message: error.message,
    });
  }
});

export default router;

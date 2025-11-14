import express from "express";
import * as imageController from "../controllers/imageController.js";

const router = express.Router();

// Test image metadata - returns sample items with image URL format
router.get("/metadata-test", async (req, res) => {
  try {
    const userId = req.query.userId || "test-user-123";
    const limit = parseInt(req.query.limit) || 10;
    const bucketName = req.query.bucketName || "virtual-closet-images";

    const result = await imageController.getImageMetadataTest(
      userId,
      limit,
      bucketName
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch image metadata",
      message: error.message,
    });
  }
});

// Sync image URLs - bulk update MongoDB with constructed image URLs
router.put("/sync-urls", async (req, res) => {
  try {
    const {
      bucketName = "virtual-closet-images",
      imageExtension = "jpg",
      userId,
      dryRun = false,
    } = req.body;

    const result = await imageController.syncImageUrls({
      bucketName,
      imageExtension,
      userId,
      dryRun,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to sync image URLs",
      message: error.message,
    });
  }
});

// Get items missing images
router.get("/missing", async (req, res) => {
  try {
    const userId = req.query.userId || "test-user-123";
    const limit = parseInt(req.query.limit) || 50;

    const result = await imageController.getItemsMissingImages(userId, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch items missing images",
      message: error.message,
    });
  }
});

export default router;

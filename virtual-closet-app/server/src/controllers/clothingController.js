import * as clothingService from "../services/clothingService.js";
import { getSignedUrl } from "../services/gcsService.js";

/**
 * Get all clothing items for a user
 */
export async function getAllItems(userId) {
  const items = await clothingService.findByUserId(userId);
  // Attach signed URLs for each item (if imageUrl exists)
  const itemsWithSignedUrls = await Promise.all(
    items.map(async (item) => {
      const signedUrl = item.imageUrl ? await getSignedUrl(item.imageUrl) : null;
      return {
        ...item.toObject(),
        signedUrl,
      };
    })
  );
  return {
    success: true,
    count: itemsWithSignedUrls.length,
    items: itemsWithSignedUrls,
  };
}

/**
 * Get single clothing item by clothingId
 */
export async function getItemById(clothingId) {
  const item = await clothingService.findByClothingId(clothingId);
  if (!item) {
    const error = new Error("No clothing item found with ID: " + clothingId);
    error.status = 404;
    throw error;
  }
  const signedUrl = item.imageUrl ? await getSignedUrl(item.imageUrl) : null;
  return {
    success: true,
    item: {
      ...item.toObject(),
      signedUrl,
    },
  };
}

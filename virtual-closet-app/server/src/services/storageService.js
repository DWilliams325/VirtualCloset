
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config();

// When running tests, avoid initializing GCS client or calling bucket()
// which will throw if environment variables are not present in CI.
let uploadImage;
if (process.env.NODE_ENV === "test") {
  // Safe stub for tests: return null (no URL) and avoid external calls
  uploadImage = async function /* uploadImage */ () {
    return null;
  };
} else {
  // Initialize storage based on environment
  const storage = process.env.NODE_ENV === 'production'
    ? new Storage({ projectId: process.env.GCS_PROJECT_ID || 'virtualcloset-477422' })
    : new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });

  const BUCKET_NAME = process.env.GCS_BUCKET_NAME || process.env.GCS_BUCKET || 'pfw-virtual-close';
  const bucket = storage.bucket(BUCKET_NAME);

  console.log(`📦 Storage Service initialized with bucket: ${BUCKET_NAME}`);

  uploadImage = async function (fileBuffer, originalName) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bucket) return reject(new Error("GCS bucket not configured"));

        // Convert image to WebP for better compression
        const webpBuffer = await sharp(fileBuffer)
          .webp({ quality: 80 })
          .toBuffer();

        // Remove original extension and add .webp
        const baseName = originalName.split('.')[0];
        const fileName = `uploads/${Date.now()}_${baseName}.webp`;
        const file = bucket.file(fileName);

        const stream = file.createWriteStream({
          metadata: {
            contentType: "image/webp",
          },
          resumable: false,
        });

        stream.on("error", (err) => reject(err));

        stream.on("finish", async () => {
          // Return the GCS path (not the signed URL which expires)
          // Controller will generate fresh signed URLs as needed
          const gcsPath = `gs://${BUCKET_NAME}/${fileName}`;
          resolve(gcsPath);
        });

        stream.end(webpBuffer);
      } catch (err) {
        reject(err);
      }
    });
  };
}

export { uploadImage };

const fs = require("fs");
const path = require("path");
const { deleteByUrl } = require("./cloudinary");

/**
 * Deletes a file from the uploads directory on disk.
 * @param {string} filePath - The stored path, e.g. "/uploads/image-123.jpg"
 */
const deleteFile = async (filePath) => {
  if (!filePath) return;

  if (filePath.startsWith("http")) {
    try {
      await deleteByUrl(filePath);
    } catch (error) {
      console.error(`Error deleting Cloudinary file:`, error.message);
    }
    return;
  }

  // Strip leading slash and resolve to absolute path inside backend folder
  const relativePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const absolutePath = path.join(__dirname, "..", relativePath);

  await fs.promises.unlink(absolutePath).catch((err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Error deleting file ${absolutePath}:`, err.message);
    }
  });
};

module.exports = deleteFile;

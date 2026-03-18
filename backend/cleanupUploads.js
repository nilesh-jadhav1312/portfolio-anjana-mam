/**
 * One-time script to delete orphaned files from the uploads/ folder.
 * Orphaned files are those not referenced by any document in MongoDB.
 *
 * Run with: node cleanupUploads.js
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const Gallery = require("./models/Gallery");
const Certificate = require("./models/Certificate");
const Research = require("./models/Research");
const Creativity = require("./models/Creativity");
const Profile = require("./models/Profile");

const UPLOADS_DIR = path.join(__dirname, "uploads");

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Collect all file paths referenced in DB
  const referenced = new Set();

  const addPath = (p) => {
    if (p) {
      // stored as "/uploads/filename.jpg", extract just "filename.jpg"
      const filename = path.basename(p);
      referenced.add(filename);
    }
  };

  // Gallery images
  const gallery = await Gallery.find({}, "image");
  gallery.forEach((g) => addPath(g.image));

  // Certificate files
  const certs = await Certificate.find({}, "certificateFile");
  certs.forEach((c) => addPath(c.certificateFile));

  // Research PDFs
  const research = await Research.find({}, "pdfFile");
  research.forEach((r) => addPath(r.pdfFile));

  // Creativity images
  const creativity = await Creativity.find({}, "image");
  creativity.forEach((c) => addPath(c.image));

  // Profile images and CV
  const profiles = await Profile.find({}, "profileImage cvFile");
  profiles.forEach((p) => {
    addPath(p.profileImage);
    addPath(p.cvFile);
  });

  console.log(`\nFiles referenced in DB: ${referenced.size}`);

  // Read all files in the uploads directory
  const allFiles = fs.readdirSync(UPLOADS_DIR);
  console.log(`Total files in uploads/: ${allFiles.length}`);

  let deleted = 0;
  let kept = 0;

  for (const file of allFiles) {
    if (referenced.has(file)) {
      kept++;
    } else {
      const filePath = path.join(UPLOADS_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`  DELETED: ${file}`);
      deleted++;
    }
  }

  console.log(`\nDone! Deleted: ${deleted}, Kept: ${kept}`);
  await mongoose.disconnect();
}

cleanup().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});

const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const Creativity = require("./models/Creativity");

const sourceDir = path.join(__dirname, "..", "photos");
const uploadDir = path.join(__dirname, "uploads");

const entries = [
  {
    source: "WhatsApp Image 2026-03-17 at 10.14.57 AM.jpeg",
    target: "rangoli-ivory-bloom-2026-01.jpeg",
    title: "Ivory Bloom Crest",
    description:
      "A tall floral crest with interlaced loops and warm diya dots.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.04 AM (1).jpeg",
    target: "rangoli-crimson-hearts-2026-02.jpeg",
    title: "Crimson Hearts",
    description:
      "Twin hearts framed by spirals, petals, and warm festive tones.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.04 AM.jpeg",
    target: "rangoli-shivray-fort-2026-03.jpeg",
    title: "Shivray Fort Tribute",
    description:
      "A fort silhouette with crescent blades and a Shivray calligraphy focus.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.05 AM (1).jpeg",
    target: "rangoli-moonlit-shivling-2026-04.jpeg",
    title: "Moonlit Shivling",
    description: "A serene Shivling under a crescent with soft floral highlights.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.05 AM.jpeg",
    target: "rangoli-lotus-arch-2026-05.jpeg",
    title: "Lotus Arch Harmony",
    description: "A lotus-centered band of scrollwork in soft pink and saffron.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.06 AM.jpeg",
    target: "rangoli-sacred-paduka-2026-06.jpeg",
    title: "Sacred Paduka Circle",
    description: "Devotional footprints encircled by leaves and spiral beads.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.07 AM (1).jpeg",
    target: "rangoli-trinity-blossom-2026-07.jpeg",
    title: "Trinity Blossom",
    description: "A triangular rangoli of petals, dots, and balanced symmetry.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.07 AM (2).jpeg",
    target: "rangoli-rose-mandala-2026-08.jpeg",
    title: "Rose Mandala",
    description: "A rose medallion with delicate dots and pastel petals.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.13.08 AM.jpeg",
    target: "rangoli-festive-mask-2026-09.jpeg",
    title: "Festive Swirl Mask",
    description: "A bold mask-like design with layered spirals and blush accents.",
  },
  {
    source: "WhatsApp Image 2026-03-17 at 10.15.07 AM.jpeg",
    target: "rangoli-diya-temple-2026-10.jpeg",
    title: "Diya Temple Glow",
    description: "A diya motif framed by a temple-like triangle of dot work.",
  },
];

const DATE_STRING = "10/3/2026";

const seed = async () => {
  await connectDB();

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const existingCount = await Creativity.countDocuments();

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const sourcePath = path.join(sourceDir, entry.source);
    const targetPath = path.join(uploadDir, entry.target);
    const imagePath = `/uploads/${entry.target}`;

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Missing file: ${sourcePath}`);
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }

    const existing = await Creativity.findOne({ image: imagePath });
    if (existing) {
      continue;
    }

    await Creativity.create({
      title: entry.title,
      date: DATE_STRING,
      description: entry.description,
      image: imagePath,
      order: existingCount + index,
    });
  }

  console.log("Creativity seed complete.");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

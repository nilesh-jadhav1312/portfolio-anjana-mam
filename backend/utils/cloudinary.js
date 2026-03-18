const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

const isConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

const configure = () => {
  if (!isConfigured()) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    if (!buffer) {
      reject(new Error("Missing file buffer"));
      return;
    }

    configure();

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    Readable.from(buffer).pipe(stream);
  });

const extractPublicId = (url) => {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

const getResourceTypeFromUrl = (url) => {
  if (!url) return "image";
  if (url.includes("/raw/upload/")) return "raw";
  return "image";
};

const deleteByUrl = async (url) => {
  if (!url) return;
  if (!url.startsWith("http")) return;

  configure();
  const publicId = extractPublicId(url);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: getResourceTypeFromUrl(url),
  });
};

module.exports = {
  uploadBuffer,
  deleteByUrl,
  isConfigured,
};

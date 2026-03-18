const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiBase = apiUrl.replace(/\/api\/?$/, "");

export const resolveMediaUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `${apiBase}${value}`;
};


export const resolveDownloadUrl = (value) => {
  const url = resolveMediaUrl(value);
  if (!url) return "";
  if (!url.startsWith("http")) return url;

  if (url.includes("res.cloudinary.com")) {
    if (url.includes("/raw/upload/")) {
      return url.replace(
        "/raw/upload/",
        "/raw/upload/fl_attachment:document.pdf/",
      );
    }
    if (url.includes("/image/upload/")) {
      return url.replace(
        "/image/upload/",
        "/image/upload/fl_attachment:document.pdf/",
      );
    }
  }

  return url;
};

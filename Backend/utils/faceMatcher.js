const fs = require("fs/promises");
const path = require("path");

const UPLOADS_PREFIX = "/uploads/";
const DEFAULT_THRESHOLD = Number(process.env.FACE_MATCH_THRESHOLD || 0.96);

const toLocalUploadPath = (photoUrl) => {
  if (!photoUrl || typeof photoUrl !== "string") return null;
  if (!photoUrl.startsWith(UPLOADS_PREFIX)) return null;
  return path.join(__dirname, "..", photoUrl.replace(/^\//, ""));
};

const readHistogram = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  if (!buffer.length) return null;

  const histogram = new Float64Array(256);
  for (let i = 0; i < buffer.length; i += 1) {
    histogram[buffer[i]] += 1;
  }

  let magnitude = 0;
  for (let i = 0; i < histogram.length; i += 1) {
    magnitude += histogram[i] * histogram[i];
  }
  magnitude = Math.sqrt(magnitude);
  if (!magnitude) return null;

  for (let i = 0; i < histogram.length; i += 1) {
    histogram[i] = histogram[i] / magnitude;
  }

  return histogram;
};

const cosineSimilarity = (a, b) => {
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
  }
  return Math.max(0, Math.min(1, dot));
};

const compareLocalPhotos = async (photoUrlA, photoUrlB) => {
  const fileA = toLocalUploadPath(photoUrlA);
  const fileB = toLocalUploadPath(photoUrlB);
  if (!fileA || !fileB) return null;

  try {
    const [histA, histB] = await Promise.all([readHistogram(fileA), readHistogram(fileB)]);
    if (!histA || !histB) return null;
    return cosineSimilarity(histA, histB);
  } catch {
    return null;
  }
};

const isFaceMatch = (similarity, threshold = DEFAULT_THRESHOLD) => {
  if (typeof similarity !== "number") return false;
  return similarity >= threshold;
};

module.exports = {
  compareLocalPhotos,
  isFaceMatch,
};

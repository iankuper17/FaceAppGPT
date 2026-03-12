const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Only JPEG, PNG and WebP images are allowed." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "Image must be under 5 MB." };
  }
  return { ok: true };
}

export function validateImageBuffer(buffer: Buffer, mime: string): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_TYPES.includes(mime)) {
    return { ok: false, error: "Invalid image type." };
  }
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "Image too large." };
  }
  return { ok: true };
}

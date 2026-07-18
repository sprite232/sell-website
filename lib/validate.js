/**
 * Input validation & sanitization utilities
 * Used in all admin forms before submitting to Firestore / Cloudinary
 */

// ── String sanitization ──────────────────────────────────────────────────────

/** Strip HTML tags to prevent XSS if content is ever rendered as HTML */
export function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

/** Trim and enforce max length */
export function clampStr(str, max = 200) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, max);
}

// ── Number validation ─────────────────────────────────────────────────────────

/** Clamp a number between min and max. Returns null if not a valid number. */
export function clampNum(val, min = 0, max = 999999) {
  const n = Number(val);
  if (isNaN(n)) return null;
  return Math.min(Math.max(Math.round(n), min), max);
}

// ── Image file validation ────────────────────────────────────────────────────

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validate an array of File objects.
 * Returns { valid: File[], errors: string[] }
 */
export function validateImageFiles(files) {
  const valid = [];
  const errors = [];

  for (const file of files) {
    if (!ALLOWED_MIME.includes(file.type)) {
      errors.push(`"${file.name}" — ไม่รองรับไฟล์ประเภทนี้ (รับเฉพาะ JPG, PNG, WEBP, GIF)`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`"${file.name}" — ไฟล์ใหญ่เกิน ${MAX_FILE_SIZE_MB}MB`);
      continue;
    }
    valid.push(file);
  }

  return { valid, errors };
}

// ── Product form validation ──────────────────────────────────────────────────

const VALID_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', ''];
const VALID_STATUSES = ['available', 'draft', 'sold'];

/**
 * Validate and sanitize a product form payload.
 * Returns { data, errors } where errors is an array of human-readable strings.
 */
export function validateProductPayload(raw) {
  const errors = [];

  // Name — required, max 120 chars
  const name = clampStr(stripHtml(raw.name || ''), 120);
  if (!name) errors.push('กรุณากรอกชื่อสินค้า');

  // Price — required, 1–999,999 baht
  const price = clampNum(raw.price, 1, 999999);
  if (price === null || price < 1) errors.push('กรุณากรอกราคาที่ถูกต้อง (1 – 999,999 บาท)');

  // Description — optional, max 1000 chars
  const description = clampStr(stripHtml(raw.description || ''), 1000);

  // Brand — optional, max 60 chars
  const brand = clampStr(stripHtml(raw.brand || ''), 60);

  // Brand colors — only valid hex
  const hexRe = /^#[0-9a-fA-F]{6}$/;
  const brandColor     = hexRe.test(raw.brandColor)     ? raw.brandColor     : '#000000';
  const brandTextColor = hexRe.test(raw.brandTextColor) ? raw.brandTextColor : '#ffffff';

  // Size — must be one of the allowed values
  const size = VALID_SIZES.includes(raw.size) ? raw.size : '';

  // Status
  const status = VALID_STATUSES.includes(raw.status) ? raw.status : 'available';

  return {
    errors,
    data: { name, price, description, brand, brandColor, brandTextColor, size, status },
  };
}

// ── Announcement validation ───────────────────────────────────────────────────

/**
 * Validate announcement payload.
 * Returns { data, errors }
 */
export function validateAnnouncementPayload(raw) {
  const errors = [];

  // Message — required, max 200 chars, strip HTML
  const message = clampStr(stripHtml(raw.message || ''), 200);
  if (!message) errors.push('กรุณากรอกข้อความประกาศ');

  // Emoji — optional, max 8 chars (limit to single emoji + variation selector)
  // Strip any HTML, allow only short strings
  const emoji = clampStr(stripHtml(raw.emoji || ''), 8);

  // Colors
  const hexRe = /^#[0-9a-fA-F]{6}$/;
  const bgColor   = hexRe.test(raw.bgColor)   ? raw.bgColor   : '#ff3b30';
  const textColor = hexRe.test(raw.textColor) ? raw.textColor : '#ffffff';

  // Type — whitelist
  const VALID_TYPES = ['sale', 'new', 'info', 'warning', 'custom'];
  const type = VALID_TYPES.includes(raw.type) ? raw.type : 'info';

  return {
    errors,
    data: { message, emoji, bgColor, textColor, type, active: true },
  };
}

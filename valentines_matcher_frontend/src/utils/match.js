/**
 * Utility functions for computing the match percentage.
 * The calculation is deterministic and purely client-side.
 */

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function hashStringToUint32(str) {
  // FNV-1a 32-bit hash (simple + deterministic)
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = Math.imul(hash, 16777619);
  }
  // eslint-disable-next-line no-bitwise
  return hash >>> 0;
}

// PUBLIC_INTERFACE
export function computeMatchPercentage(nameA, nameB) {
  /** Compute a deterministic match percentage between 1 and 100 for two names. */
  const a = normalizeName(nameA);
  const b = normalizeName(nameB);

  if (!a || !b) return null;

  // Make order-independent: sort the pair
  const pair = [a, b].sort().join("♥");
  const hash = hashStringToUint32(pair);

  // Map hash to 1..100, then add a mild "romance bias" towards mid-high values
  const base = (hash % 100) + 1; // 1..100
  const biased = Math.round((base * 0.65 + 35) * 1); // 35..100-ish

  return Math.max(1, Math.min(100, biased));
}

// PUBLIC_INTERFACE
export function buildShareUrl({ origin, yourName, crushName, percentage }) {
  /** Build a shareable URL that encodes current result in query params. */
  const url = new URL(origin);
  url.searchParams.set("a", yourName);
  url.searchParams.set("b", crushName);
  url.searchParams.set("p", String(percentage));
  return url.toString();
}

// PUBLIC_INTERFACE
export async function copyToClipboard(text) {
  /** Copy the provided text to the clipboard with a safe fallback. */
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for non-secure contexts.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "absolute";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

// PUBLIC_INTERFACE
export async function shareText({ title, text, url }) {
  /** Use Web Share API if available, otherwise fallback to opening a new tab with the URL. */
  if (navigator.share) {
    await navigator.share({ title, text, url });
    return "shared";
  }
  window.open(url, "_blank", "noopener,noreferrer");
  return "opened";
}

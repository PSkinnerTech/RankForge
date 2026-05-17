export const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || ""));

export const normalizeUrl = (value) => {
  const parsed = new URL(value);
  parsed.hash = "";
  if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  return parsed.href;
};

export const resolveUrl = (href, base) => {
  if (!href) return null;
  try {
    return normalizeUrl(new URL(href, base).href);
  } catch {
    return null;
  }
};

export const sameOrigin = (a, b) => {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
};

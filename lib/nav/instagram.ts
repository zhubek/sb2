// Accept existing profile URLs and convenient @handles without creating unsafe links.
export function instagramUrl(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^@?[a-zA-Z0-9_.]+$/.test(raw) && !raw.includes("instagram.com"))
    return `https://www.instagram.com/${raw.replace(/^@/, "")}/`;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
      !["instagram.com", "www.instagram.com", "m.instagram.com"].includes(url.hostname)) return null;
    url.protocol = "https:";
    return url.href;
  } catch {
    return null;
  }
}

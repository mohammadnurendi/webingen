// Legacy helper kept for backward compatibility.
// Images are now uploaded directly to Lovable Cloud Storage; URLs are used as-is.
// Old Google Drive share links are still converted to a direct image URL so
// existing data continues to render.
export function gdriveImage(input: string | null | undefined): string {
  if (!input) return "";
  const url = input.trim();
  if (!url) return "";

  // /file/d/<id>/...
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w1600`;

  // ?id=<id> or &id=<id>
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1600`;

  return url;
}

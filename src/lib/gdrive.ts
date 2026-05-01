// Convert Google Drive share/view links to a direct image URL we can <img> render.
// Accepts:
//  - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//  - https://drive.google.com/open?id=FILE_ID
//  - https://drive.google.com/uc?id=FILE_ID
//  - already-direct URLs (returned as-is)
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

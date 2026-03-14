export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateUniqueSlug(text: string): string {
  const slug = generateSlug(text);
  const suffix = Date.now().toString(36);
  return `${slug}-${suffix}`;
}
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "h2", "h3", "ul", "ol", "li", "blockquote", "a", "span",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "rel", "target"]),
};

function isSafeUrl(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    v.startsWith("https://") ||
    v.startsWith("http://") ||
    v.startsWith("mailto:") ||
    v.startsWith("/") ||
    v.startsWith("#")
  );
}

/**
 * Strict allow-list sanitizer for announcement HTML.
 * Unknown tags are dropped (their text is kept). Event handlers and
 * javascript: URLs are always removed.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const withoutDangerous = withoutComments
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "");

  return withoutDangerous.replace(
    /<\/?([a-z][a-z0-9]*)\b([^>]*)\/?>/gi,
    (match, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();
      const isClose = match.startsWith("</");
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (isClose) return `</${tag}>`;

      const allowed = ALLOWED_ATTRS[tag];
      if (!allowed) return `<${tag}>`;

      const attrs: string[] = [];
      const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
      let m: RegExpExecArray | null;
      while ((m = attrRe.exec(rawAttrs)) !== null) {
        const name = m[1].toLowerCase();
        const value = m[2] ?? m[3] ?? m[4] ?? "";
        if (name.startsWith("on")) continue;
        if (!allowed.has(name)) continue;
        if ((name === "href" || name === "src") && !isSafeUrl(value)) continue;
        if (name === "target" && value !== "_blank") continue;
        attrs.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
      }
      if (tag === "a" && attrs.some((a) => a.startsWith("target="))) {
        attrs.push('rel="noopener noreferrer"');
      }
      return attrs.length ? `<${tag} ${attrs.join(" ")}>` : `<${tag}>`;
    }
  );
}

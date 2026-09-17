/**
 * Rende un testo del frontmatter come HTML sicuro, trasformando solo i `backtick`
 * in `<code>`. Tutto il resto viene escapato: il frontmatter non è Markdown.
 */
export function inlineCode(text: string): string {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

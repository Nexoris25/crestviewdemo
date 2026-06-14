/**
 * Renders a JSON-LD document. Server component — the script is emitted in the
 * static HTML so crawlers see it without executing JavaScript.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from trusted, in-repo data (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

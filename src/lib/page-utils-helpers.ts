/**
 * Helpers for generating meta tags and embed code strings.
 * This file is pure TypeScript (no JSX) to avoid react-refresh lint issues.
 */
import type { PageElement } from '@shared/types';
/**
 * Basic SEO meta information used to generate HTML meta tags.
 */
export type SeoMeta = {
  title?: string;
  description?: string;
  /**
   * Full absolute URL to the primary image for sharing (og:image / twitter:image)
   */
  image?: string;
  /**
   * Canonical URL for the page
   */
  url?: string;
  /**
   * OpenGraph type, e.g. 'website', 'article'
   */
  type?: string;
  /**
   * Twitter card type, defaults to 'summary_large_image' when an image is present.
   */
  twitterCard?: string;
  /**
   * If true, adds <meta name="robots" content="noindex, nofollow" />
   */
  noIndex?: boolean;
  /**
   * Optional site name for og:site_name
   */
  siteName?: string;
};
/**
 * Escape a string for safe insertion into HTML text nodes or attribute values.
 * This is intentionally conservative and covers the common dangerous characters.
 * @param str - input string
 */
function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}
/**
 * Generate a string of HTML meta tags from SeoMeta data.
 * Suitable for server-side rendering into <head> or inserting via dangerouslySetInnerHTML.
 *
 * Example output (excerpt):
 * <title>My title</title>
 * <meta name="description" content="..." />
 * <meta property="og:title" content="..." />
 * <meta name="twitter:card" content="summary_large_image" />
 *
 * @param meta - Optional SeoMeta object
 * @returns string containing meta tags / title / canonical link
 */
export function generateMetaTags(meta?: SeoMeta): string {
  if (!meta) return '';
  const parts: string[] = [];
  // Title
  if (meta.title) {
    parts.push(`<title>${escapeHtml(meta.title)}</title>`);
    parts.push(
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
    );
    parts.push(
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
    );
  }
  // Description
  if (meta.description) {
    parts.push(
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );
    parts.push(
      `<meta property="og:description" content="${escapeHtml(
        meta.description
      )}" />`
    );
    parts.push(
      `<meta name="twitter:description" content="${escapeHtml(
        meta.description
      )}" />`
    );
  }
  // Canonical / URL
  if (meta.url) {
    parts.push(`<link rel="canonical" href="${escapeHtml(meta.url)}" />`);
    parts.push(`<meta property="og:url" content="${escapeHtml(meta.url)}" />`);
  }
  // Image
  if (meta.image) {
    parts.push(
      `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
    );
    parts.push(
      `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`
    );
  }
  // Site name
  if (meta.siteName) {
    parts.push(
      `<meta property="og:site_name" content="${escapeHtml(
        meta.siteName
      )}" />`
    );
  }
  // OpenGraph type
  parts.push(
    `<meta property="og:type" content="${escapeHtml(meta.type ?? 'website')}" />`
  );
  // Twitter card
  const twitterCard =
    meta.twitterCard ??
    (meta.image ? 'summary_large_image' : 'summary');
  parts.push(
    `<meta name="twitter:card" content="${escapeHtml(twitterCard)}" />`
  );
  // Robots / indexing
  if (meta.noIndex) {
    parts.push(
      `<meta name="robots" content="noindex, nofollow" />`
    );
  }
  // Basic viewport & charset (helpful defaults for snippets where head is constructed)
  // Note: If your app already adds these in a central place, double-including is harmless but maybe redundant.
  parts.unshift(`<meta charset="utf-8" />`);
  parts.push(`<meta name="viewport" content="width=device-width,initial-scale=1" />`);
  return parts.join('\n');
}
/**
 * Encode a string to base64 in both browser and Node-like environments.
 * Falls back gracefully if neither btoa nor Buffer is available.
 * @param input - string to encode
 */
function encodeBase64(input: string): string {
  try {
    if (typeof btoa === 'function') {
      return btoa(input);
    }
  } catch (_) {
    // ignore
  }
  try {
    // Prefer checking globalThis to avoid direct Buffer references that need ts-ignore
    const g = (globalThis as any);
    if (g?.Buffer && typeof g.Buffer.from === 'function') {
      return g.Buffer.from(input, 'utf8').toString('base64');
    }
  } catch (_) {
    // ignore
  }
  // Fallback: simple percent-encoding (not true base64 but safe for attributes)
  return encodeURIComponent(input);
}
/**
 * Generate a self-contained embed HTML string for a PageElement.
 *
 * The returned string contains:
 * - A container <div class="ghl-embed" data-ghl-embed="..."></div>
 * - A small inline <script> that decodes the payload and attaches it to the container
 *
 * Consumers embedding this snippet can read the decoded payload via:
 *   const container = document.querySelector('.ghl-embed');
 *   const payload = container && (container.__GHL_EMBED_PAYLOAD || JSON.parse(atob(container.getAttribute('data-ghl-embed'))));
 *
 * The embed is intentionally minimal and avoids external network requests.
 *
 * Note: PageElement is imported from shared types. This function does not assume any specific runtime for rendering —
 * it simply packages the element for the host page to consume.
 *
 * @param element - PageElement instance to embed (from @shared/types)
 * @param opts - optional options (siteUrl used for context)
 * @returns HTML string ready to insert into a page (innerHTML or server-side rendered)
 */
export function generateEmbedCode(
  element: PageElement,
  opts?: { siteUrl?: string }
): string {
  if (!element) {
    throw new TypeError('generateEmbedCode: element is required');
  }
  // Prepare payload with optional context
  const payload = {
    element,
    siteUrl: opts?.siteUrl ?? null,
    generatedAt: new Date().toISOString(),
  };
  const json = JSON.stringify(payload);
  const encoded = encodeBase64(json);
  // Use a safe attribute value (base64 is safe); still escape for safety if fallback used
  const safeAttr = escapeHtml(encoded);
  // Compose a minimal, non-invasive embed snippet.
  // The script tries to decode payload and attach it to the container element as a JS property:
  // container.__GHL_EMBED_PAYLOAD (convenient for consumers)
  // We avoid auto-rendering so host pages can control how to hydrate/render the element.
  const html = [
    `<div class="ghl-embed" data-ghl-embed="${safeAttr}" aria-hidden="false"></div>`,
    `<script>(function(){try{var s=document.currentScript;if(!s){return;}var container=s.previousElementSibling;if(!container){return;}try{var data=container.getAttribute('data-ghl-embed');if(!data){return;}var decoded;try{decoded=JSON.parse(typeof atob==='function'?atob(data):decodeURIComponent(data));}catch(e){try{decoded=JSON.parse(decodeURIComponent(data));}catch(_) {decoded=null;}}container.__GHL_EMBED_PAYLOAD=decoded;}catch(e){console && console.error && console.error('GHL embed decode error',e);} })();</script>`
  ].join('\n');
  return html;
}
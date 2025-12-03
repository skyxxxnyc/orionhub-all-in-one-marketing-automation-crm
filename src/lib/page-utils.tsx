/**
 * src/lib/page-utils.tsx
 *
 * JSX-based utilities for PageEditor / SEO Panel.
 * - GenericElement: a lightweight, extensible renderer for page elements (text, image, button, container, html).
 * - generateMetaTags: builds an HTML string of meta tags from SEO data.
 * - generateEmbedCode: builds a simple HTML snippet for a given element for embedding/preview purposes.
 *
 * Rules:
 * - No default React import; relies on the JSX runtime.
 * - Uses ShadCN UI Button for button elements.
 * - Keeps typesafe interfaces referencing shared types where available.
 */
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import type { PageElement as SharedPageElement } from '@shared/types';
/**
 * Local fallback types in case the shared types differ slightly.
 * These are compatible with the expected shape used by the functions below.
 */
export type PageElement = SharedPageElement & {
  id?: string;
  type: string;
  props?: Record<string, any>;
  children?: PageElement[] | string;
};
export type SeoMeta = {
  title?: string;
  description?: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterSite?: string;
};
/**
 * Escape HTML special characters to safely inject content into generated HTML strings.
 * @param str - input string to escape
 */
function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
/**
 * GenericElement
 *
 * A lightweight renderer used in the page editor to display a variety of element types.
 * This intentionally keeps rendering deterministic and accessible.
 *
 * Supported types:
 *  - "text": renders a div / paragraph with inner text (supports basic HTML strings if props.allowHtml)
 *  - "image": renders an img with alt, src
 *  - "button": renders a ShadCN Button wrapped in an anchor if href is provided
 *  - "container": renders a div that may contain children elements
 *  - "html": dangerously set inner HTML (only when explicitly allowed via props)
 *  - fallback: renders a div with JSON-debug content
 */
export function GenericElement({
  element,
  data,
  className,
  onClick,
}: {
  element?: PageElement;
  data?: PageElement;
  className?: string;
  onClick?: (e: MouseEvent, el: PageElement) => void;
}) {
  const el = element ?? data;
  if (!el) return null;
  const type = (el?.type || 'text').toLowerCase();
  const props = el?.props || {};
  const baseClass = clsx('generic-element', className, props.className);
  const handleClick = (e: React.MouseEvent) => {
    try {
      onClick?.(e as unknown as MouseEvent, el);
    } catch (err) {
      // Fail silently in UI; caller may attach richer error handling
      // eslint-disable-next-line no-console
      console.error('GenericElement onClick handler error', err);
    }
  };
  switch (type) {
    case 'text': {
      const content = typeof el.children === 'string' ? el.children : props.text || '';
      if (props.allowHtml) {
        return (
          <div
            id={el.id}
            className={baseClass}
            dangerouslySetInnerHTML={{ __html: String(content) }}
            onClick={handleClick}
          />
        );
      }
      return (
        <p id={el.id} className={baseClass} onClick={handleClick}>
          {String(content)}
        </p>
      );
    }
    case 'image': {
      const src = props.src || '';
      const alt = props.alt || props.title || '';
      const width = props.width ? Number(props.width) : undefined;
      const height = props.height ? Number(props.height) : undefined;
      return (
        <img
          id={el.id}
          className={baseClass}
          src={src}
          alt={String(alt)}
          width={width}
          height={height}
          loading={props.loading || 'lazy'}
          onClick={handleClick}
          style={props.style}
        />
      );
    }
    case 'button': {
      const label = props.label || (typeof el.children === 'string' ? el.children : 'Click');
      const href = props.href;
      const disabled = Boolean(props.disabled);
      const variant = props.variant || 'default';
      const button = (
        <Button
          id={el.id}
          className={baseClass}
          onClick={handleClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
          disabled={disabled}
          data-variant={variant}
        >
          {label}
        </Button>
      );
      if (href) {
        const target = props.target || '_self';
        return (
          <a id={`${el.id || ''}-link`} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
            {button}
          </a>
        );
      }
      return button;
    }
    case 'container': {
      const children = Array.isArray(el.children) ? el.children : [];
      return (
        <div id={el.id} className={baseClass} onClick={handleClick}>
          {Array.isArray(children)
            ? children.map((child, idx) => <GenericElement key={child.id ?? idx} element={child} />)
            : null}
        </div>
      );
    }
    case 'html': {
      // Inline raw HTML block - opt-in only
      const html = props.html || '';
      return (
        <div
          id={el.id}
          className={baseClass}
          dangerouslySetInnerHTML={{ __html: String(html) }}
          onClick={handleClick}
        />
      );
    }
    default: {
      // Fallback renderer: show JSON for debugging/editing
      return (
        <div id={el.id} className={baseClass} onClick={handleClick} title={`type: ${type}`}>
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify({ type, props }, null, 2)}</pre>
        </div>
      );
    }
  }
}
/**
 * generateMetaTags
 *
 * Build an HTML string containing meta tags suitable for injecting into a page header
 * or showing to the user as an exportable snippet.
 *
 * @param meta - SeoMeta object describing page-level SEO fields
 * @returns HTML string of meta tags (newline separated)
 */
export function generateMetaTags(meta?: SeoMeta): string {
  if (!meta) return '';
  const parts: string[] = [];
  if (meta.title) {
    parts.push(`<title>${escapeHtml(meta.title)}</title>`);
    parts.push(`<meta property="og:title" content="${escapeHtml(meta.ogTitle || meta.title)}" />`);
  }
  if (meta.description) {
    parts.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
    parts.push(`<meta property="og:description" content="${escapeHtml(meta.ogDescription || meta.description)}" />`);
  }
  if (meta.keywords) {
    const keywords = Array.isArray(meta.keywords) ? meta.keywords.join(', ') : meta.keywords;
    if (keywords) parts.push(`<meta name="keywords" content="${escapeHtml(keywords)}" />`);
  }
  if (meta.canonicalUrl) {
    parts.push(`<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`);
  }
  if (meta.ogImage) {
    parts.push(`<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`);
    parts.push(`<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />`);
  }
  if (meta.twitterCard) {
    parts.push(`<meta name="twitter:card" content="${escapeHtml(meta.twitterCard)}" />`);
  } else {
    // sensible default
    parts.push(`<meta name="twitter:card" content="summary_large_image" />`);
  }
  if (meta.twitterSite) {
    parts.push(`<meta name="twitter:site" content="${escapeHtml(meta.twitterSite)}" />`);
  }
  // Open Graph basic tags
  if (meta.ogTitle || meta.title) {
    parts.push(`<meta property="og:type" content="website" />`);
  }
  return parts.join('\n');
}
/**
 * generateEmbedCode
 *
 * Generate a simple embeddable HTML snippet for a given PageElement.
 * Useful for exporting a single section or element to place on an external site.
 *
 * @param element - PageElement to export
 * @param opts - optional settings (e.g. siteUrl to resolve relative image URLs)
 * @returns HTML string snippet
 */
export function generateEmbedCode(element: PageElement, opts?: { siteUrl?: string }): string {
  if (!element) return '';
  const props = element.props || {};
  const type = (element.type || 'text').toLowerCase();
  switch (type) {
    case 'text': {
      const content = typeof element.children === 'string' ? element.children : props.text || '';
      if (props.allowHtml) {
        return `<div class="ghl-embed-text">${content}</div>`;
      }
      return `<div class="ghl-embed-text">${escapeHtml(String(content))}</div>`;
    }
    case 'image': {
      let src = props.src || '';
      if (opts?.siteUrl && src && src.startsWith('/')) {
        src = `${opts.siteUrl.replace(/\/$/, '')}${src}`;
      }
      const alt = escapeHtml(String(props.alt || props.title || ''));
      return `<img class="ghl-embed-image" src="${escapeHtml(src)}" alt="${alt}" />`;
    }
    case 'button': {
      const label = escapeHtml(String(props.label || (typeof element.children === 'string' ? element.children : 'Click')));
      const href = escapeHtml(String(props.href || '#'));
      const target = props.target || '_self';
      return `<a class="ghl-embed-button" href="${href}" target="${target}">${label}</a>`;
    }
    case 'container': {
      const children = Array.isArray(element.children) ? element.children : [];
      const inner = children.map((child) => generateEmbedCode(child as PageElement, opts)).join('\n');
      return `<div class="ghl-embed-container">\n${inner}\n</div>`;
    }
    case 'html': {
      const html = props.html || '';
      return `<div class="ghl-embed-html">\n${html}\n</div>`;
    }
    default: {
      // Generic fallback: output JSON
      const safe = escapeHtml(JSON.stringify(element, null, 2));
      return `<pre class="ghl-embed-fallback">${safe}</pre>`;
    }
  }
}

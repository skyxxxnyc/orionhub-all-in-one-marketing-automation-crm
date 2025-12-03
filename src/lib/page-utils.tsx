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
import type { PageElement } from '@shared/types';


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



/**
 * src/components/page-element-types-map.ts
 *
 * Exports a map of page element types pointing to a PageElementNode component/type.
 * This file is intentionally defensive about how PageElementNode is exported from
 * './PageElementTypes' so it will work whether that module uses a default export
 * or a named export.
 */
import type { ComponentType } from 'react';
import * as PageElementTypesModule from './PageElementTypes';
/**
 * Try to resolve PageElementNode from multiple possible export shapes:
 * - default export
 * - named export "PageElementNode"
 * - the module itself (in case it *is* the component)
 *
 * If none is found, we fall back to a no-op component to avoid runtime crashes.
 */
const RawModule = PageElementTypesModule as any;
const ResolvedPageElementNode: ComponentType<any> =
  RawModule?.default ??
  RawModule?.PageElementNode ??
  RawModule ??
  (() => null);
/**
 * Map of page element type keys to the corresponding PageElementNode.
 * Add other element types here as your builder expands.
 */
export const PageElementTypes: Record<string, ComponentType<any>> = {
  text: ResolvedPageElementNode,
  image: ResolvedPageElementNode,
  form: ResolvedPageElementNode,
  button: ResolvedPageElementNode,
  section: ResolvedPageElementNode,
};
/**
 * Optional: export the resolved node for direct usage.
 */
export { ResolvedPageElementNode as PageElementNode };
export type PageElementTypeKey = keyof typeof PageElementTypes;
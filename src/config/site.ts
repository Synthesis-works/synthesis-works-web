/**
 * Cross-site links.
 *
 * Synthesis Works (this site) and Atlas (the product) are separate deployments
 * on separate origins. They share no routing, no session and no cookies: the
 * only coupling is the absolute URL below, which means a visitor can go
 * straight to the Atlas site without ever passing through this one.
 */
const DEFAULT_ATLAS_URL = 'https://atlas-web-synthesis-works.vercel.app';

export const ATLAS_URL = (import.meta.env.VITE_ATLAS_URL || DEFAULT_ATLAS_URL).replace(/\/+$/, '');

/** Absolute URL on the Atlas site, for links and full-page handoffs. */
export function atlasUrl(path = '/'): string {
  return `${ATLAS_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

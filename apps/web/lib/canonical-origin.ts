export function canonicalOrigin(): URL | undefined {
  const configured = process.env.PAPERKIT_CANONICAL_ORIGIN;
  if (configured === undefined) return undefined;

  const origin = new URL(configured);
  if (
    (origin.protocol !== 'http:' && origin.protocol !== 'https:') ||
    origin.username ||
    origin.password ||
    !/^https?:\/\/[^/?#]+\/?$/i.test(configured)
  ) {
    throw new TypeError(
      'PAPERKIT_CANONICAL_ORIGIN must be an HTTP(S) origin without credentials, path, query, or fragment',
    );
  }

  return origin;
}

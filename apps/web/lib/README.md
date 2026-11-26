# Canonical Origin and Tool SEO

`canonicalOrigin(): URL | undefined` reads `PAPERKIT_CANONICAL_ORIGIN` on each
call. Omit the variable for local previews: no default production URL is used.
Configured values must be HTTP(S) origins, optionally ending in `/`, with no
credentials, path, query, or fragment. Invalid configuration throws.

Production verification is a release owner's attestation, not a URL parser
result. Before public release, the owner must verify control of the configured
origin and inspect deployed canonical metadata, sitemap, and structured data.
Do not treat successful syntax validation as evidence of production readiness.

`toolListJsonLd(origin?: URL)` returns an ItemList object only when an origin
and at least one Live Tool exist. Pass the result of `canonicalOrigin()` from
the shell. ListItem destinations come only from the validated registry.
The sitemap returns no entries without an origin; otherwise it includes the
shell and Live destinations. Coming Soon Tools never appear in either list.
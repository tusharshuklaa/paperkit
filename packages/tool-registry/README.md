# Tool Registry

Import `Tool`, `tools`, `CATEGORY_LABELS`, and `toolsInDisplayOrder` from
`@repo/tool-registry`. Source exports are consumed directly by workspace apps.

`toolsInDisplayOrder(input: readonly Tool[] = tools): Tool[]` validates availability
and navigation, then returns a new array sorted by ascending `order`. Equal orders
retain input order. It does not mutate the input or clone individual entries.

All shipped Tools are Coming Soon and have no `href`. Before registering a Live
Tool, a human release owner must verify the HTTPS destination opens the working
generator and attest to that verification during review. Set `status: "live"`
and supply `href` only after that check. Runtime validation checks URL syntax,
HTTPS, and absence of credentials; it cannot establish ownership, reachability,
or whether a generator works. Coming Soon entries must omit `href` entirely.
# Tool Registry

Import `Tool`, `tools`, `CATEGORY_LABELS`, and `toolsInDisplayOrder` from
`@repo/tool-registry`. Source exports are consumed directly by workspace apps.

`toolsInDisplayOrder(input: readonly Tool[] = tools): Tool[]` validates availability
and navigation, then returns a new array sorted by ascending `order`. Equal orders
retain input order. It does not mutate the input or clone individual entries.

Driver Salary Slip is Live at `/driver-salary-slip`; the other Tools are Coming
Soon. Live destinations may be same-origin paths or credential-free HTTPS URLs.
Verify a working route locally before marking a Tool Live, and verify its real
HTTPS deployment before public release. Runtime validation cannot establish
ownership, reachability, or whether a generator works. Coming Soon entries must
omit `href` entirely.

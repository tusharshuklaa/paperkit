# Paper Index Landing Redesign

## Decision

User selected Paper Index's identity and Print Room's Good on paper document stack.
Pale green, forest ink, Manrope, and Bricolage Grotesque form the final system.
Prototype variants, switcher, variant keyboard handlers, and prototype source files
are removed. `/` renders the final design in development and production.

## Direction Contract

THESIS: PaperKit's name becomes the cover of an everyday document index; real
document layouts, not generic software chrome, supply the visual centerpiece.

OWN-WORLD: pale green canvas, forest ink, sage stage, white paper, warm fuel and
cool rent fields. Monumental display type pairs with precise humanist body type.

STORY: identify PaperKit, inspect illustrative salary/fuel/rent samples, browse
registry-driven tools, and understand their actual availability.

FIRST VIEWPORT: large PaperKit heading and plain description precede the continuous
Good on paper stage. Two layered rotated sheets sit beside document-selection
controls. Mobile retains the stack and all controls without horizontal scrolling.

FORM: user-pinned Paper Index plus Good on paper stack; seed:877892e4b74b8dd2.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Motion

Stack hover lifts and straightens the front sheet while fanning the rear sheet.
Selector focus provides equivalent feedback. Catalog paper lifts subtly on hover.
Transform-only 320ms transitions are interruptible; no ambient loops or new dependency.
Coarse pointers do not trigger pointer hover motion. Reduced motion removes paper
transforms and transitions without hiding selected states. Sample selection reserves
checkmark width, stage height, sheet height, and caption space.

## Ownership

- Server page owns composition and registry-derived availability copy.
- DocumentShowcase owns sample selection only; no generation or persistence.
- LandingCatalog consumes the public registry; unavailable tools have no generator links.
- DocumentSample renders deterministic illustrative data, never official records.
- Shared token CSS owns palettes, typography roles, geometry, and motion.
- Reference design authority is normative; app DESIGN.md and root token reference derive from it.

## Verification

Production build passed. Focused development verification passed 52 Playwright checks,
51 unit tests, TypeScript, Biome, editor diagnostics, and architecture analysis.
Production browser verification passed all 52 checks across light/dark desktop/mobile.
The production build remains statically prerendered. Main session opened all six
production captures at 1440, 768, and 390 pixels in light/dark, confirming the
selected composition, loaded fonts, document sheets, and responsive content.
Impeccable detector returned an empty finding list; diff whitespace check passed.

Independent finish reviewer disposition: `recapture`, because its tool session
cannot view image files. All six captures exist at expected sizes; this is an
inspection limitation, not a reported visual defect. No independent visual ship
verdict is claimed. Main-session visual inspection and automated checks completed.

Exclusive `test:seo-http` harness was not rerun: it temporarily mutates registry
source and rebuilds default output. Production no-origin HTTP assertions and
registry/SEO unit contracts passed without invoking that harness. No CI, deployment,
commit, or branch was created. Local Bun is 1.3.9 versus package-manager pin 1.4.4.

Production preview: http://localhost:3102/.

## Boundaries

All three tools remain Coming Soon. No fake availability, customer proof, performance
claims, privacy guarantees, or working generator added. No shipping raster assets.
Legacy shell components remain in the repo where not part of discarded prototypes;
removing unrelated dead code is outside this change. Tiny sample typography is an
illustrative print treatment, not a prescribed future generator form style.

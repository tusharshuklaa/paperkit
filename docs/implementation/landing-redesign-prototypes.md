# Landing Redesign Prototypes

Status: resolved. User selected Paper Index with Print Room's Good on paper stack.
This document records exploration history, not current design authority.
See [final implementation](landing-redesign.md) and [design authority](../../apps/web/DESIGN.md).

## Confirmed Brief

Individuals handling salary, rent, and fuel paperwork. Browse upcoming Tools.
Keep PaperKit name and truthful Coming Soon status. Full visual redesign approved.
Three contrasting directions prioritize clarity and product craft.

## Question

Which composition makes upcoming everyday document tools feel most useful and considered?
Compare three opt-in variants on the existing landing route; leave the default page untouched.

## Direction Development

Subject inventory: PaperKit name, salary slip, fuel receipt, rent receipt, A4,
thermal format, Indian rupee amounts, monthly periods, three Coming Soon Tools,
deterministic document samples, a registry-driven Catalog.

Grounded candidate systems, ordered by audience resonance: document index,
spot-ink print room, household folder, monthly planner, document proof sheet,
public-service forms library, clear desktop checklist. Assigned candidate 7.

Seed reference: seed:877892e4b74b8dd2.
Researched composition draw: name-as-monument, loud-flat-poster, colour-chapters.
No image-generation tool is available; prototypes are code-led.

Challenger judgments against audience identification and product clarity:
film emulsion declined (retain sequential clarity); raku declined (retain commitment
to material contrast); risograph competitive (print relates to documents, clear
separation between samples and actions); split-flap competitive (availability is
legible, but station metaphor distracts); kinetic sand declined (retain direct
selection feedback); festival hoarding declined (retain composition at page scale).
No literal film damage, pottery, station claims, or decorative sand is used.

## Direction Contracts

### A: Paper Index

THESIS: PaperKit's name becomes the cover of an everyday document index, not a SaaS card hero.
OWN-WORLD: cool pale ground, forest ink, sage document field; expressive grotesk display.
STORY: identify PaperKit, examine a document, browse the three upcoming Tools.
FIRST VIEWPORT: full-width large name, a continuous document field, sample in the center,
short context at left, working document selection at right. Mobile stacks the sample and selection.
FORM: grounded candidate 1, name-as-monument; seed:877892e4b74b8dd2.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

### B: Print Room

THESIS: Print-room spot colors turn everyday paperwork into a confident composition.
OWN-WORLD: chartreuse, pink, carbon ink; heavy grotesk type and overlapping document outputs.
STORY: notice paperwork's purpose, explore illustrative formats, understand availability.
FIRST VIEWPORT: blunt two-line headline, primary arrow to Tools, full-width pink print field
with typographic statement and document stack. Format buttons change the front sample.
FORM: competitive risograph challenger, loud-flat-poster; seed:877892e4b74b8dd2.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

### C: Clear Desk

THESIS: Choosing the document is the landing experience, not a detour behind a marketing hero.
OWN-WORLD: clean white, mineral blue, charcoal-blue text, warm supporting document fields.
STORY: choose an everyday task, inspect its sample, see why it cannot be generated yet.
FIRST VIEWPORT: concise title and action above an unframed workbench. Named Tool rows
control the adjacent document. Mobile puts all selection controls before the sample.
FORM: assigned grounded candidate 7, checklist with colour-chapters; seed:877892e4b74b8dd2.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Claims and Proof

- Everyday document categories: three visible Tool entries and document illustrations.
- Formats deserve clear layouts: inspect structured, deterministic sample documents.
- Generation is not ready: Coming Soon labels and direct FAQ answer.
- Samples are not payment evidence: visible illustration captions on every document.

No customer proof, performance statistics, prices, legal compliance, or privacy guarantees added.
Fuel and rent sample data are synthetic design material, not proposed legal templates.

## Historical Preview

Prototype routes and comparison controls have been removed. The URLs below are
historical only; query parameters no longer select designs. Final page is `/`.

- A: http://localhost:3101/?variant=a
- B: http://localhost:3101/?variant=b
- C: http://localhost:3101/?variant=c

The comparison bar and variant keyboard handlers were discarded with the prototypes.
No branch or commit created.

## Promotion and Documentation

After user selection, promote the chosen direction into production components, remove
the comparison mechanism, and reconcile the design system, token inventory,
shared-styles.css, component contracts, and shell verification docs.
Update app DESIGN.md and .impeccable/design.json from the shipped result, not these experiments.
Selection is complete. Shared design authority and tokens now describe the finalized design.

## Verification

- App TypeScript check passed after final content and typography changes.
- Focused Biome checks passed after native fieldset and formatting corrections.
- Final Playwright captures cover A/B/C at 1440, 768, and 390 pixels.
- All nine viewport checks passed horizontal overflow and two-line h1/h2 checks.
- Salary/fuel/rent selection, pressed state, FAQ expansion, reduced motion,
	visible keyboard focus, and Enter activation passed.
- Previous/next keyboard navigation updates URL and wraps; native control arrows
	are not intercepted. Shortcut checks wait for client hydration.
- Default landing route remains unchanged; no browser runtime errors observed.
- Impeccable source detector returned an empty finding list.

Independent finish reviewer returned recapture because its session could not
view image files, not because captures were malformed. No independent visual
approval is claimed. Main session opened all nine initial final captures and
corrected wordmark overflow, headline wrapping, supporting text, and sample clarity.

Strict taste inspector is not a pass: its first run flagged small supporting text,
an above-title description, and insufficient motion. Supporting text and description
placement were subsequently improved. No full post-cleanup inspector pass is claimed.
Intentional exceptions: semantic document illustrations replace stock photography;
no unrelated footage; restrained document entrance replaces a mandatory eight-element
motion quota; small type inside illustrative document fragments reflects printed layout.
Taste source lint also flags the floating comparison bar's overlay shadow, an allowed
overlay case rather than resting page decoration.

Prototype approval is not release approval. Production build, full WCAG audit,
dark-theme variants, cross-browser testing, and final design-system extraction
remain for promotion of the selected direction. No CI, commit, or branch created.

## Problem Statement

Visitors need a clear, accessible introduction to PaperKit and an accurate Catalog of its browser-based document generators. The current demo does not explain the platform, distinguish usable Tools from planned ones, or provide a coherent desktop/mobile experience in light and dark themes.

Maintainers need shared design foundations and predictable workspace commands before adding independent generators. Conflicting reference exports and legacy design guidance currently make it too easy to introduce inconsistent styling, misleading availability, or invented production URLs.

## Solution

Replace the demo with the PaperKit Platform Shell: an introduction, document illustration, Catalog, workflow explanation, free-service explanation, and footer based on the approved reference designs. Preserve the approved content across themes and viewports, clearly distinguish Coming Soon Tools from Live Tools, and make theme switching and keyboard navigation reliable.

Provide shared UI, tokens, a typed Tool registry, and a document-engine placeholder so future generators can be separate applications in the same monorepo. Deliver a locally verified shell without claiming that unavailable generators or unconfigured production SEO are ready for release.

## User Stories

1. As a visitor, I want PaperKit's purpose to be clear on arrival, so that I understand which kinds of paperwork it supports.
2. As a visitor, I want the approved headline and supporting copy, so that the platform's presentation matches its intended identity.
3. As a visitor, I want a recognizable sample document, so that I can inspect the kind of output PaperKit is intended to produce.
4. As a visitor, I want consistent sample data across themes and screen sizes, so that switching appearance does not change the document's meaning.
5. As a visitor, I want sample totals to agree with their line items, so that the document illustration remains credible.
6. As a visitor, I want the PAID stamp and document animation to preserve their final values, so that decoration does not suggest changing financial data.
7. As a visitor, I want the approved trust row, so that the platform's intended benefits are visible without extra invented claims.
8. As a visitor, I want Tools navigation to reach the Catalog, so that I can find generators quickly.
9. As a visitor, I want About navigation to reach the relevant explanation, so that I can understand PaperKit without a dead-end page.
10. As a visitor, I want all three planned Tools listed, so that I can discover salary-slip, fuel-receipt, and rent-receipt generators.
11. As a visitor, I want approved Tool names, descriptions, categories, and formats, so that I can compare their intended purposes.
12. As a visitor, I want stable Catalog ordering, so that finding a Tool is predictable between visits.
13. As a visitor, I want unavailable generators marked Coming Soon, so that a sample document or card does not imply a working Tool.
14. As a visitor, I want Coming Soon cards to avoid fake generator links, so that I do not mistake a placeholder for a usable destination.
15. As a visitor, I want a Live Tool to open a verified working generator, so that its availability label is meaningful.
16. As a visitor, I want the approved workflow explanation, so that the intended generation process is understandable.
17. As a visitor, I want the approved explanation of why PaperKit is free, so that the platform's position is visible.
18. As a visitor, I want the complete approved navigation and footer content, so that this iteration preserves the reference's intended information architecture.
19. As a mobile visitor, I want a readable single-column composition, so that the landing page works without horizontal scrolling.
20. As a desktop visitor, I want the approved desktop composition, so that the document illustration and content remain properly balanced.
21. As a visitor, I want the initial theme to follow my device, so that the page respects my appearance preference.
22. As a visitor, I want an explicit theme control, so that I can choose a different appearance.
23. As a returning visitor, I want my manual theme choice remembered, so that I do not reset it on every visit.
24. As a visitor, I want identical content in light and dark themes, so that an appearance change never changes Tool information.
25. As a keyboard user, I want logical navigation and visible focus, so that I can operate links and controls without a pointer.
26. As an assistive-technology user, I want semantic sections and named controls, so that the shell is understandable without relying on visual styling.
27. As a visitor with reduced-motion preferences, I want the finished document shown without entrance animation, so that motion does not obstruct access.
28. As a visitor, I want fonts and document artwork to render correctly, so that the reference design is more than an empty placeholder.
29. As a visitor, I want stable layout during theme and asset loading, so that content and controls do not jump unexpectedly.
30. As a search user, I want only usable Tools represented as live results, so that search metadata does not advertise unavailable generators.
31. As a maintainer, I want previews to work without a production origin, so that local development is not blocked by deployment setup.
32. As a maintainer, I want missing-origin previews to omit origin-dependent SEO, so that no guessed domain is published.
33. As a release owner, I want a verified canonical origin required before public release, so that production metadata can be trusted.
34. As a maintainer, I want one authoritative design document, so that reference conflicts are resolved in a predictable place.
35. As a maintainer, I want approved fonts and complete light/dark tokens documented before styled primitives, so that future Tools inherit consistent foundations.
36. As a maintainer, I want shared colors, radii, and spacing expressed through tokens, so that visual changes do not require scattered hardcoded edits.
37. As a future Tool author, I want reusable buttons, badges, and form primitives, so that I can build consistent accessible forms.
38. As a future Tool author, I want label, helper, and error presentation limited to relevant form primitives, so that visual document primitives keep focused interfaces.
39. As a future Tool author, I want reusable paper, header, signature, and stamp primitives, so that documents share a coherent visual language.
40. As a maintainer, I want one typed registry to drive the Catalog, so that adding a Tool does not require editing the shell.
41. As a future Tool author, I want my generator to remain a separate application in the monorepo, so that its runtime and deployment are distinct from the shell.
42. As a future Tool author, I want shared packages available through workspace dependencies, so that I can reuse foundations without copying them.
43. As a maintainer, I want a document-engine placeholder without premature PDF logic, so that this phase does not invent a generator architecture.
44. As a contributor, I want documented install, development, build, typecheck, lint, and write-format commands, so that I can verify changes consistently.
45. As a contributor, I want existing command names preserved, so that current callers continue working.
46. As a maintainer, I want Biome to remain the only lint/format tool, so that contributors do not face conflicting tooling.
47. As a maintainer, I want introduced Fallow findings separated from inherited findings, so that new work is accountable without hiding baseline debt.
48. As a maintainer, I want checks at public application and registry interfaces, so that internal refactors do not break implementation-specific tests.
49. As a contributor, I want documentation for adding and independently deploying a Tool, so that I can extend the platform through a verified registry destination.
50. As a maintainer, I want verification results, accepted exceptions, and release blockers reported, so that local completion is not confused with public-release readiness.

## Implementation Decisions

- Use the established domain terms Platform Shell, Catalog, Tool, Live, and Coming Soon. A Catalog listing or sample document is not a usable Tool.
- Respect the accepted separate-app architecture decision: the existing web application owns the Platform Shell; future generators are separate Next.js applications in the same monorepo, each built and deployed independently when ready. Shared packages are build-time dependencies and the shell links to verified destinations.
- Limit this phase to the shell and shared foundations. Do not scaffold future generator applications merely to populate the Catalog.
- Preserve Bun workspaces, the existing lockfile, private root package, and Bun 1.4.4 pin. Runtime dependencies remain in owning workspaces; root shared-tooling dev dependencies are intentional. Internal package dependencies use `workspace:*`.
- Replace demo content while retaining useful Next.js and workspace configuration. Target exact Next.js 16.4.5, confirmed available during the interview; verify compatible React and other peer versions instead of assuming current ranges suffice. Reuse Tailwind v4.
- The authoritative PaperKit design document remains the source of truth. Reconcile conflicting legacy prose and front matter there before token or primitive work. Design remains provisional, but implementation must follow the reconciled iteration rather than competing specifications.
- Dark desktop supplies canonical section copy, Tool names, and sample document data in every theme and viewport. It also governs dark appearance. Light desktop governs light appearance and desktop composition; mobile governs responsive composition; the component sheet supplies primitive states absent from the landing exports.
- Use Source Sans 3 for UI and document text and JetBrains Mono for numbers and tabular figures, preferably through Next.js font loading. These approved fonts override the exports.
- Preserve reference-specific radii, control dimensions, paper appearance, dot texture, glow, blur, and shadows for this iteration where applicable. The superseded zero-radius, Inter, no-gradient/no-glass, and single-shadow requirements do not govern the shell. Do not assign 6px to every shape indiscriminately.
- Follow applicable frontend quality guidance without replacing the approved visual direction or inventing a font conflict. Accessibility, stable layout, and reduced-motion behavior remain required.
- After reconciling the design document, create the root token reference and shared token CSS before building or styling primitives. Reuse `@repo/tailwind-config` as token owner and `@repo/typescript-config` for TypeScript configuration; create no competing configuration package.
- Document complete light/dark values for canvas, surface, border, text, muted text, accent, accent-soft, accent-foreground, semantic states, and every additional reference value used. Include radii, spacing, control dimensions, hairlines, fonts, tabular figures, backgrounds, texture, shadows, and motion. The token reference derives from the design authority rather than competing with it.
- Every primitive and shell value for color, radius, and spacing references a token. Keep raw hex and pixel styling values in the token source, not scattered across consumers.
- Extend `@repo/ui` rather than rebuilding an empty package. Preserve and adapt Button and add Badge, Input, FieldWrapper, ToolCard, PaperSheet, DocumentHeader, SignatureBlock, RevenueStamp, and Stamp. Check shared callers before changing existing behavior.
- Follow repository one-export-per-file rules and re-export-only barrels. FieldWrapper owns label/helper/error presentation; form-state props belong only on relevant form primitives. Preserve native semantics, accessible associations, visible focus, and reserved status/error space.
- Add `@repo/tool-registry` with public `tools: Tool[]`, `CATEGORY_LABELS`, and `toolsInDisplayOrder`. Include `salary-slip`, `petrol-receipt`, and `rent-receipt` in intended display order, using canonical names, descriptions, categories, formats, and visual icon identifiers. The Catalog grid derives solely from the registry; adding an entry must not require shell changes.
- Model availability as `live` with a required verified working destination, or `coming-soon` without generator navigation. Begin with all three Tools Coming Soon unless a working salary-slip generator is supplied and verified. Do not invent a URL or build a generator merely to make a listing Live.
- Add `@repo/document-engine` as a TODO-only implementation stub. Minimal package metadata and workspace build configuration may make it consumable, but no PDF or document-generation behavior is included.
- Render Header with wordmark, Tools, About, and theme control; Hero with approved headline, supporting copy, trust row, document illustration, and PAID stamp; Catalog grid; workflow explanation; free-service explanation; and SiteFooter. Visible copy follows the dark-desktop reference even when internal section names are simpler.
- Use React Server Components by default. Client execution is limited to theme switching and reference-supported interactions. Add only missing dependencies such as next-themes and Lucide React in owning workspaces; do not add analytics or card-click tracking.
- Follow device theme on first visit, persist explicit user selection, avoid hydration/theme flashes, and share one content/component tree across themes. Verify theme contrast and font/asset loading.
- Keep sample amounts fixed and consistent with document line items. Animate entrance or PAID stamp through transform/opacity, never randomized financial totals. Reduced-motion mode shows the finished document immediately.
- Preserve every approved reference navigation/footer label and existing `#` destination, including Driver Voucher and unsupported informational links, without creating empty destination pages. Wire real Tools and About anchors to corresponding page sections where appropriate. This placeholder exception does not introduce another Catalog Tool or permit fake generator-card links.
- Existing reference claims may be reproduced for this task without gathering evidence. This approved exception is not independent verification of legal compliance, privacy promises, or technical guarantees. Add no new unsupported copy, claims, sections, tags, or badges.
- Add sitemap and ItemList JSON-LD support using verified facts and Live Tools only. Configure origin-dependent canonical metadata, sitemap URLs, structured data, and relevant OG URLs only when a verified canonical origin is available; invent no production domain or salary-slip destination. With no origin, omit origin-dependent output while allowing local preview and verified non-origin metadata. With no Live Tools, do not list Coming Soon entries as live results.
- Provide root `bun dev`, `bun build`, `bun lint`, `bun fmt`, and `bun typecheck`. Preserve existing `format` and `check-types` callers. Extend Turbo's existing `tasks` for build, dev, lint, write-format, and typecheck using package scripts rather than duplicated root shell logic. Formatting must actually write files and have a wired Turbo task.
- Extend the single root Biome 1.9.4 configuration as needed, retaining formatting, recommended lint rules, and import organization. Use supported overrides only; introduce neither ESLint nor Prettier nor package-local Biome re-export configurations.
- Reuse existing Fallow dependency/scripts and inspect installed-version CLI/config support before adding settings. Configure requested styling-drift checks and changed-code gates only with supported options. Default audit scope is `new-only`; distinguish inherited from introduced findings. Do not add invalid settings to simulate unavailable capabilities; report any verified tooling limitation.
- Reuse Graphify scripts, ignore rules, and existing graph. Query shared callers before behavioral changes and refresh the graph when appropriate. Add no alternative graph configuration unless required by the installed CLI.
- Preserve the current ignore rules and unrelated worktree changes. Add only verified necessary ignore omissions. Do not add a Node version file without a concrete deployment/tooling requirement.
- Add project documentation covering purpose, actual monorepo layout, adding a separate Tool application, consuming shared packages, independent deployment, registry destination registration, and the RTK commands actually used. Do not document a Vitest wrapper unless that runner is introduced.
- Completion requires passing workspace checks, verified rendered desktop/mobile light/dark behavior, registry-driven discovery, documented tokens created before styled primitives, consumable shared foundations, accurate availability, and documented accepted exceptions/findings. Public release separately requires a verified canonical origin and production SEO checks.

## Testing Decisions

- The user approved browser/HTTP shell acceptance tests plus focused public-registry contract checks. Prefer the highest existing application interface: interact with the real rendered shell and request its public HTTP output. No new test-only production APIs or component-internal mocks are required.
- A good test observes visitor-visible outcomes or a published package contract. It should survive changes to private functions, component decomposition, internal state, CSS class names, or token implementation. Use semantic roles and accessible names for interactions, reserving screenshot comparisons for appearance rather than implementation snapshots.
- Existing prior art is limited to workspace build, typecheck, lint, format, Fallow, and Graphify commands. No test runner, test scripts, or application/shared-package test suite was found during specification. Introduce only the minimal harness needed for these approved checks; a particular unit-test runner is not prescribed.
- Browser acceptance covers the Platform Shell, Catalog, theme behavior, required navigation, responsive layout, and document illustration. Verify desktop and mobile in light and dark, first-visit system preference, persistent manual override after reload, stable content, fonts/assets, no overflow, keyboard order, accessible names, visible focus, and contrast.
- Verify fixed sample amounts and consistent line-item totals, including during entrance/stamp animation. Under reduced-motion emulation, verify the final document is immediately visible without the entrance sequence.
- Verify the three initial Catalog entries and ordering, Coming Soon status, and absence of generator navigation. Preserve approved footer placeholders as intentional exceptions, not evidence that destinations work. Test real Tools and About anchors separately.
- Request metadata, sitemap behavior, and rendered structured data through the running shell. Without an origin, assert absence of invented canonical/sitemap/structured-data URLs; with a controlled test origin, verify origin-dependent output. A synthetic test origin is test input only and must never become a shipped production default.
- Test the registry through its public exports, including display ordering, category labels, Coming Soon entries without navigation, and Live entries requiring valid destinations. Use isolated synthetic entries at the public contract where needed; never mark an actual unavailable Tool Live for testing. Typechecking should reject invalid availability/destination combinations where the contract encodes them; human verification remains necessary before a real destination is declared working.
- Exercise Live-only SEO behavior with controlled registry input through existing public interfaces, checking exclusion of Coming Soon entries. Do not introduce a production runtime injection mechanism or exported helper solely to test this branch; prefer public package contracts and a reversible test fixture when the default registry has no Live entries.
- Typecheck/build shared-package consumers to verify UI, registry, token, TypeScript-config, and placeholder-engine consumption without scaffolding a future generator or implementing PDF logic. For reusable form primitives not exercised by the shell, check the public props and, where behavior needs execution, a small test consumer rather than component internals; verify label/helper/error associations and focus semantics.
- Place committed tests in nearest test folders and follow repository module-test naming conventions. Scale test coverage to changed behavior rather than adding exhaustive implementation-specific primitive snapshots.
- After dependency changes, run installation, then actual root typecheck, lint, write-format, and build commands using RTK when available. Check the final formatted state. Run the existing Fallow audit, fix introduced findings, and separately document accepted inherited findings with rationale. Validate styling-drift settings against installed CLI support.
- Compare real-browser captures against the approved reference mapping, fix material discrepancies, and report viewport/theme coverage and remaining limitations. Refresh Graphify when appropriate and verify shared callers remain valid.
- Run local checks, not full CI. Repository policy permits CI only after a merged pull request from develop into main.

## Out of Scope

- Salary-slip, petrol-receipt, and rent-receipt generator screens, forms, generation logic, or scaffold applications.
- PDF generation, PDF/A validation, print engines, tax calculations, document verification, or substantive document-engine implementation.
- Deploying applications, obtaining domains, choosing a hosting provider, shared-domain rewrites, microfrontends, or runtime application composition.
- Inventing production origins, salary-slip destinations, or Live availability; listing Coming Soon Tools as live search results.
- Evidence gathering for approved reference claims during this task, or representing the claim exception as verified compliance.
- New marketing claims, sections, badges, tags, analytics, tracking, authentication, payment flows, or document-storage behavior.
- Pruning approved footer/navigation placeholders or creating empty destination pages for them.
- Replacing existing UI/configuration packages, introducing competing design authorities, adding ESLint/Prettier, or unrelated cleanup and refactoring.
- Full CI execution outside the repository's allowed merged-PR condition.

## Further Notes

- Interview answers A1-A16 are settled, and the user confirmed the resolved brief before requesting this issue. The testing interfaces above were separately confirmed during specification; no further product interview is required.
- The authoritative source is the repository's PaperKit design document. The accepted Separate Apps for Document Generators ADR records independent deployment, and the glossary map leads to accepted domain terminology. All decisions needed to implement this issue are stated above; local interview documents need not be published first.
- Approved references are the repository's dark-desktop, light-desktop, light-mobile, and light/dark-component-sheet Stitch exports. They are visual references, not source code to copy. Source precedence is specified above; this issue does not rely on repository-relative links that would resolve incorrectly from GitHub Issues.
- Registry lookup confirmed Next.js 16.4.5 exists. No verified production origin or salary-slip destination is available; all three Tools remain Coming Soon unless evidence changes. No generator is required to complete the shell.
- Accepted iteration exceptions are the retained reference claims and placeholder navigation/footer links. They must be reported plainly, without implying legal verification or functioning destinations. They never override truthful Catalog availability.
- Local implementation completion and public-release readiness are separate. Missing origin does not block local shell verification, but blocks public release until production metadata, sitemap, and live-tool structured data are verified.
- Final implementation report must include the resulting structure tree, complete token-reference contents, effective Biome configuration, Fallow configuration/settings, resolved decisions, accepted findings/exceptions, verification results, remaining release blockers, and a five-line change summary. Long artifacts may accompany a concise summary without omitting their contents.
- Publication and specification do not authorize a commit, branch, deployment, or CI run. Implementing this issue is a separate task; no shell, token, or package implementation is performed by publishing this spec.

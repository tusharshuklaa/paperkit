# PaperKit Platform Shell Implementation

Snapshot: 2026-11-04, final local Platform Shell verification. Local implementation is complete; public release remains blocked on verified production origin and release checks below. Verification results supplied by integration owner are recorded here, distinct from this docs-only pass. This pass edits only root README and this report; no commit, branch, deployment, or CI run was performed.

## Resulting Structure

```text
paperkit/
  README.md
  DESIGN_TOKENS.md
  biome.json
  fallow.toml
  package.json
  turbo.json
  bun.lock
  playwright.config.ts
  apps/web/
    AGENTS.md GLOSSARY.md package.json tsconfig.json
    next.config.ts postcss.config.mjs
    app/{layout.tsx,page.tsx,globals.css,sitemap.ts}
    app/__tests__/{canonical-origin.test.ts,sitemap.test.ts,tool-list-json-ld.test.ts}
    app/__tests__/{package-consumer.ts,tsconfig.json}
    __tests__/{shell.test.ts,seo-http.ts}
    components/
      About.tsx Catalog.tsx Header.tsx Hero.tsx SampleDocument.tsx
      SiteFooter.tsx ThemeControl.tsx ThemeProvider.tsx Workflow.tsx
    lib/{README.md,canonical-origin.ts,tool-list-json-ld.ts}
  packages/
    ui/
      src/{button.tsx,Badge.tsx,DocumentHeader.tsx,FieldWrapper.tsx,Input.tsx}
      src/{PaperSheet.tsx,RevenueStamp.tsx,SignatureBlock.tsx,Stamp.tsx,ToolCard.tsx}
      src/components/Button.tsx
      src/styles.css
      __tests__/{public-consumer.test.ts,public-consumer.types.tsx}
      README.md package.json tsconfig.json tsconfig.consumer.json
    tailwind-config/{package.json,shared-styles.css}
    typescript-config/{base.json,nextjs.json,react-library.json}
    tool-registry/src/
      index.ts tool.ts tools.ts category-labels.ts tools-in-display-order.ts
      __tests__/{tool.test.ts,tools.test.ts,tools-in-display-order.test.ts}
    tool-registry/{README.md,package.json,tsconfig.json}
    document-engine/src/index.ts
    document-engine/{README.md,package.json,tsconfig.json}
  docs/
    adr/0001-separate-tool-apps.md
    specs/paperkit-platform-shell.md
    implementation/paperkit-platform-shell.md
    agents/
  reference/paperkit/DESIGN.md
  graphify-out/                 local generated graph/cache
```

Implementation-focused tree reflects current source, not generated output. No future generator applications exist. Generated `dist`, `.next`, test artifacts, dependencies, and caches are omitted above.

## Decisions

- Separate Next.js Tool apps build/deploy independently; shell links to verified destinations. Shared packages are build-time dependencies, not runtime composition.
- All three registry Tools remain Coming Soon, without generator navigation. A document illustration or PAID stamp does not imply Live availability. Live requires human-verified working credential-free HTTPS destination.
- UI extends existing package and public exports. Engine remains empty TODO-only module. No premature PDF logic or tool scaffold.
- Design authority is [reconciled design](../../reference/paperkit/DESIGN.md). Dark desktop supplies canonical copy/data; light desktop supplies light appearance/composition; mobile supplies responsive composition; component sheet supplies additional primitive states. Source Sans 3 and JetBrains Mono are approved font overrides.
- [Token reference](../../DESIGN_TOKENS.md) states tokens were created before styled primitives; current contents are copied verbatim below, without claiming independent chronological verification. Shared token source remains sole implementation owner.
- UI now has `typecheck: bun run check-types`; registry and engine already have `typecheck: tsc --noEmit`. Existing `build` and `check-types` scripts are preserved. JSON/CSS-only tooling workspaces do not need fake TypeScript checks.
- `@repo/tailwind-config` owns repo-wide `lint: biome check ../..` and `fmt: biome check --write ../..`. Web and other shared workspaces omit duplicate lint/fmt scripts.
- Root commands/Turbo wire build, dev, lint, fmt, typecheck, plus preserved format/check-types. Root test script runs Bun tests followed by Playwright; HTTP SEO has separate script. Biome remains sole lint/format tool; no ESLint or Prettier.
- Fallow drift stays advisory (`warn`, installed default), not disabled. Other existing rule severities are unchanged. `new-only` gates introduced findings; inherited findings remain reportable. No baseline or suppressions hide integration debt.
- Approved reference claims and existing navigation/footer `#` placeholders remain accepted iteration exceptions. They do not establish legal compliance, privacy guarantees, or functioning destinations. No fake generator links permitted.

## Token Reference

Verbatim contents of root token artifact at snapshot:

````markdown
# PaperKit Tokens

Derived from [design authority](reference/paperkit/DESIGN.md), not a competing specification.
Implementation owner: [shared-styles.css](packages/tailwind-config/shared-styles.css).
Created before styled primitives. All colors, radii and spacing in consumers use these tokens.

## Theme Values

| CSS token | Light | Dark |
| --- | --- | --- |
| canvas | #FCFCFD | #0B0D10 |
| surface | #FFFFFF | #12151A |
| surface-alt | #F8FAFC | #13171F |
| border | #E2E8F0 | #232830 |
| text | #0E1116 | #EDEFF3 |
| muted | #526071 | #98A1B0 |
| accent | #1D4ED8 | #6E8BFF |
| accent-soft | #EFF4FF | #131A2E |
| accent-foreground | #FFFFFF | #0B0D10 |
| action | #1D4ED8 | #2A4FD8 |
| action-hover | #1E40AF | #1E40AF |
| action-foreground | #FFFFFF | #FFFFFF |
| success | #15803D | #4ADE80 |
| success-soft | #ECFDF5 | #10291B |
| error | #DC2626 | #F87171 |
| error-soft | #FEF2F2 | #32191D |
| warning | #92400E | #FCD34D |
| warning-soft | #FFFBEB | #302713 |
| dot | black 5% | white 8% |
| glow | radial accent 12% to transparent at 70% | same with dark accent |
| paper-shadow | 0 24px 50px -12px black 15% | 0 24px 50px -12px black 70%, 0 0 0 1px white 5% |

Semantic soft surfaces support future form states, not additional shell badges or claims.

## Fixed Document Values

Both themes: paper #FFFFFF; paper-ink #0E1116; paper-muted #475569;
paper-label #64748B; paper-border #E2E8F0; paper-rule #CBD5E1;
paper-total #F1F5F9; paper-error #991B1B; paper-error-soft #FEF2F2;
stamp-ink #1D4ED8; transparent transparent; disabled-opacity 0.55.

## Spacing And Geometry

`--space-N` map (px): 0=0, 1=2, 2=4, 3=6, 4=8, 5=10, 6=12, 8=16,
10=20, 12=24, 14=28, 16=32, 20=40, 24=48, 32=64, 40=80, 48=96.

Radii (px): none=0, small=4, control=6, icon=8, full=9999.
hairline=1px; stamp-border=1.5px; focus-width=2px; focus-offset=4px.
control-height=44px; icon-tile=48px; icon-size=20px; logo-size=24px;
content-width=1280px; paper-width=490px; header-height=64px;
signature-width=112px; status-height=24px; texture-size=24px;
texture-dot=1px; blur=12px. Gutters: space-12 desktop, space-8 mobile.

## Typography

font-ui: Next-loaded Source Sans 3, sans-serif fallback.
font-numeric: Next-loaded JetBrains Mono, monospace fallback; tabular figures.
Text size tokens (px): micro=10, tiny=11, small=12, body=14, base=16,
lead=18, logo=20, number=22, section=28, hero-mobile=44, hero=56.
Leading: hero=1.05, heading=1.28, body=1.6. Letter spacing zero.
Weight: body 400, labels 500/600, headings 600/700. No viewport-scaled type.

## Motion

duration-fast=150ms; duration-entrance=600ms; duration-stamp=350ms;
delay-stamp=250ms; ease-out=cubic-bezier(0.2,0,0,1); paper-start=16px;
stamp-angle=-8deg; stamp-start-scale=1.12; hover-lift=-2px.
Only transform and opacity animate. Reduced motion shows final content immediately.
Sample amounts never change. Native focus uses accent and documented focus dimensions.

## Tailwind Bridge

Tailwind v4 inline theme aliases: color-canvas, color-surface, color-accent,
color-ink, font-sans, font-mono reference the semantic properties above.
No alternate configuration package or per-app token source exists.
````

## Effective Biome Config

Full root configuration, verbatim at snapshot. No package-local configs are introduced. Existing `vcs.useIgnoreFile` applies repo ignore rules in addition to this list.

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/*.tsbuildinfo",
      "**/next-env.d.ts",
      "reference/**",
      "graphify-out/**",
      ".agents/**",
      ".claude/**",
      ".codex/**",
      ".github/**",
      ".vscode/**",
      ".mcp.json",
      ".taste-skill/**",
      "test-results/**",
      "playwright-report/**",
      "bun.lock"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  },
  "overrides": [
    {
      "include": ["apps/web/components/SiteFooter.tsx", "apps/web/components/Header.tsx"],
      "linter": { "rules": { "a11y": { "useValidAnchor": "off" } } }
    },
    { "include": ["**/*.css"], "linter": { "enabled": false }, "formatter": { "enabled": false } }
  ]
}
```

CSS compatibility exception: Biome 1.9.4 CSS lint/format are disabled for Tailwind v4 `prefix(ui)` parser compatibility. Root lint passing does not mean CSS lint/format ran. Tailwind separately compiles production CSS during build; Fallow separately analyzes styling. No unsupported parser setting was added. Agent/generated paths are ignored as configured above. Valid-anchor rule is disabled only for Header and SiteFooter, retaining approved `#` placeholders; accessibility rules remain enabled elsewhere.

## Fallow Settings

Pinned installed binary: `node_modules/.bin/fallow`, version `3.39.0`. Read full installed skill, CLI help and shipped `node_modules/fallow/schema.json` before configuration. No remote config inheritance, telemetry enablement, dependency change, or baseline generated.

Complete current [fallow.toml](../../fallow.toml), verbatim:

```toml
[[framework]]
name = "paperkit-public-consumers"
enablers = ["typescript"]
entryPointRole = "support"
entryPoints = ["apps/web/app/__tests__/package-consumer.ts", "packages/ui/__tests__/public-consumer.types.tsx"]

[audit]
gate = "new-only"
css = true
cssDeep = true

[rules]
css-token-drift = "warn"
```

`config --format json --quiet` accepts TOML, resolves `audit.css: true`, `audit.cssDeep: true`, and `rules.css-token-drift: "warn"`. Resolved config omits default gate; audit attribution explicitly confirms `gate: "new-only"`. Compile-only public consumer fixtures are declared support entries, not removed or globally suppressed. Styling findings stay advisory; other installed defaults remain unchanged. No invented token-file or drift-threshold setting. Architecture output warns boundaries and policy packs are not configured, so zero boundary/policy findings are not evidence those rules ran.

## Verification

Final integration-owner results below supersede earlier failed/pending snapshots. This docs-only pass checks artifacts and links, not a second application validation run. Main owns subsequent full reruns if source changes again.

| Check | Result |
| --- | --- |
| Install and compatibility | `bun install` succeeded; Next.js `16.4.5` and React `19` installed, compatibility confirmed against official package peer metadata and successful local checks. |
| Root `bun run typecheck` | Passed. Browser-test DOM typings and shared public consumer checks are resolved. |
| Root `bun run fmt` | Passed actual write-format run, not only dry-run wiring. Preserved `format` alias invokes same task. |
| Root `bun run lint` | Passed. Agent-path ignores, formatting/imports, scoped anchor exception, and safe JSON-LD handling resolved earlier failures. |
| Root `bun run build` | Passed full production build, including shared UI TypeScript and Tailwind CSS compilation. |
| Bun tests | 51 passed, 112 assertions, 7 files via `bun test packages apps/web/app/__tests__`; registry, public UI contracts, canonical origin, sitemap, and JSON-LD covered. |
| Playwright | 36 passed across 4 projects: desktop `1440x1000` and mobile `390x844`, each light/dark. |
| Responsive acceptance | No horizontal overflow at project sizes or additional `320px` and `768px` widths. |
| Theme and assets | System theme, manual selection, persistence, text contrast, approved fonts, and asset loading passed after fixes. |
| Keyboard and motion | Native keyboard/focus behavior and reduced-motion final states passed after fixes; sample amounts/totals remain fixed and reconcile. |
| Default HTTP SEO | Missing-origin preview omits origin-dependent canonical/OG URL, sitemap entries, and structured data; unavailable Tools remain absent from live-tool SEO. |
| `bun run test:seo-http` | Passed configured-origin canonical/OG URL, sitemap, Live-only `ItemList`, and automatic fourth Catalog entry from registry fixture; restoration completed. |
| Fallow config | Accepted support entry declarations, styling analytics, advisory token drift, and `new-only` attribution. |
| Fallow audit | Final gate `pass`: introduced dead code 0, complexity 0, duplication 0, styling 13 warnings; inherited findings 0. |
| Fallow architecture | 0 issues; boundary/policy configuration absent, so those checks were not assessed. |
| Graphify | Final refreshed graph: 427 nodes, 600 edges after final source and fixture restoration. |
| Docs artifact check | Passed read-only executable comparison of complete embedded token/config contents and existing local Markdown links. |

### HTTP Test Isolation

[HTTP fixture script](../../apps/web/__tests__/seo-http.ts) is an exclusive registry/build writer. Run `rtk proxy bun run test:seo-http` alone, never concurrently with registry edits, builds, preview servers, or browser acceptance. It appends one synthetic Live entry to three Coming Soon entries, builds with `https://shell.example.test`, and starts local server on port `3103`. Fixture destination is `https://generator.example.test/verified-fixture`; synthetic domains validate emitted strings, not production ownership or reachable generators.

Assertions cover canonical and Open Graph URLs, sitemap containing shell plus only Live destination, one-entry Live-only `ItemList`, and registry-driven fourth Catalog entry without shell edits. Cleanup stops fixture server, restores exact original registry source, and builds again without `PAPERKIT_CANONICAL_ORIGIN`. Final run confirmed both source restoration and default no-origin build restoration. All three real Tools remain Coming Soon.

After successful HTTP run, script environment typing changed to an explicitly typed build parameter. Typecheck passed afterward; runtime environment filtering and fixture/cleanup semantics are equivalent. HTTP runtime result above belongs to pre-typing-edit run, not an unperformed second run; main owns final reruns.

### Accepted Warnings

Final Fallow count is 13 introduced styling warnings, with no inherited findings and no token-drift finding. Selector-specificity advisories are accepted for scoped shell styling, theme/state selectors, and intentional cascade; reduced-motion `!important` is accepted to ensure accessibility overrides win. These are visible advisory findings, not hidden debt or proof that CSS should be deleted. Earlier warning inventories and line numbers are superseded; no unverified exact location or sub-kind breakdown is asserted here. Token source remains shared; these exceptions do not introduce token drift.

Turbo emitted expected `no output files found` warnings for registry/engine type-only `tsc --noEmit` builds. Those tasks intentionally produce no artifacts; warning is nonblocking, not application failure. Main may refine task output declarations separately.

### Verification Limits

- Local machine ran Bun `1.3.9`; repo package-manager pin remains `1.4.4`. Rerun install/checks with pinned runtime before release for contributor/release parity. No local app bug is inferred from mismatch.
- Context7 tool was unavailable in this session. Compatibility evidence used official package peer registry metadata and installed package checks, not a claimed Context7 lookup.
- Main directly inspected full-page captures for desktop/mobile in both themes. No material overlap or clipping remains; stamp has reserved space. Review is visual, not a pixel-identical comparison. Delegated reviewer lacked image access; main completed the review instead.
- Final HTTP fixture rerun passed, restored registry source and rebuilt no-origin preview. Editor diagnostics cleared after restoration; fresh duplication scan reports zero clones. Production preview started at `http://127.0.0.1:3102` for handoff. No claim is made about future server availability.

## Release Blockers

1. Supply and verify production canonical HTTPS origin; configure `PAPERKIT_CANONICAL_ORIGIN`. Local missing-origin preview is valid, public-release SEO remains blocked.
2. Rerun release checks with pinned Bun `1.4.4`; retain passing local results above as machine-runtime evidence, not pinned-runtime certification. Main owns any reruns after subsequent code edits.
3. No Live generator destination is supplied. This is intentional and not a local-shell blocker; any future Live registration requires separate working deployment and human verification. Coming Soon Tools must stay absent from live-tool SEO.
4. Approved reference claims and placeholder links remain accepted iteration exceptions, not independently verified legal/privacy assurances or functioning destinations. Resolve release-facing claims/destinations through owner review before treating them as production guarantees.

## Five-Line Change Summary

1. Built responsive light/dark Platform Shell with approved copy, sample document, system/manual theme persistence, and accessible keyboard/reduced-motion behavior.
2. Added shared token-driven UI primitives and typed registry-driven Catalog; all three Tools remain Coming Soon, engine remains TODO-only without generation behavior.
3. Implemented origin-aware metadata, sitemap, and Live-only JSON-LD, verified with isolated synthetic registry fixture and exact source/build restoration.
4. Completed install, root typecheck/fmt/lint/build, 51 Bun tests and 36 browser checks; Fallow new-only gate passes with 13 accepted styling warnings.
5. Documented separate Tool deployment, full current tokens/config/tree, refreshed graph, and public-release limits without commit, branch, deployment, or CI execution.
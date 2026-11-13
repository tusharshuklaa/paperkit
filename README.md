# PaperKit

PaperKit's Platform Shell introduces browser-based document Tools and lists their availability in a registry-driven Catalog. Driver Salary Slip is available at `/driver-salary-slip`; fuel and rent receipt Tools remain **Coming Soon**. Catalog samples are illustrations, not generated documents. Production deployment has not yet been verified.

## Layout

```text
apps/web/                       Next.js Platform Shell, metadata and shell checks
apps/driver-salary-slip/        Driver salary receipt tool and standalone development preview
packages/ui/                    Shared React primitives and built CSS
packages/platform-shell/        Shared platform header, footer, theme control, and styles
packages/tailwind-config/       Shared tokens; repo-wide Biome command owner
packages/typescript-config/     Shared TypeScript configurations
packages/tool-registry/         Typed Tool availability and display ordering
packages/document-engine/       TODO-only module; no PDF or generation logic
apps/web/DESIGN.md              Authoritative Paper Index design decisions
DESIGN_TOKENS.md                Complete token reference
docs/specs/                    Platform requirements
docs/implementation/           Verification, exceptions and release blockers
docs/adr/                      Architecture decisions
graphify-out/                  Local generated knowledge graph, not shipped
```

Landing design is finalized as Paper Index with the Plum & Stone theme and layered Good on paper document
stage. Paper hover/focus motion respects reduced-motion preferences. Prototypes and
variant controls are removed; the default route is the finalized page. See the
[redesign report](docs/implementation/landing-redesign.md) for scope and verification.

## Local Commands

Run from repo root. Bun workspaces use the existing lockfile and Bun `1.4.4` package-manager pin. Local verification used machine runtime `1.3.9`; rerun with pinned `1.4.4` for release/contributor parity. This runtime mismatch is a verification limitation, not an observed app bug. RTK must be installed separately; it proxies commands without replacing Bun. Graphify requires separate installation described in [docs/agents/tooling.md](docs/agents/tooling.md).

```sh
rtk proxy bun install
rtk proxy bun run dev
rtk proxy bun run build
rtk proxy bun run typecheck
rtk proxy bun run check-types
rtk proxy bun run lint
rtk proxy bun run fmt
rtk proxy bun run format
```

`typecheck` and preserved `check-types` reach TypeScript workspaces through Turbo. `fmt` and preserved `format` run write-format tasks, not read-only checks. `@repo/tailwind-config` owns `biome check ../..` and `biome check --write ../..` so root configuration files are covered. JSON/CSS-only configuration packages need no artificial TypeScript task. Biome 1.9.4 is the sole linter/formatter; recommended lint rules and import organization remain enabled. CSS lint/format are disabled for Tailwind v4 `prefix(ui)` parser compatibility; Tailwind compilation and Fallow styling analytics check CSS separately. Only Header/Footer disable the valid-anchor rule for approved placeholder links. Install, root typecheck, fmt, lint, and build passed with Next.js `16.4.5` and React `19`. See [implementation report](docs/implementation/paperkit-platform-shell.md) for final evidence, accepted warnings, and release limitations.

Focused checks and analysis:

```sh
rtk proxy bun run --cwd packages/ui build
rtk proxy bun run --cwd packages/ui typecheck
rtk proxy bun run --cwd packages/ui check:consumer
rtk proxy bun test packages apps/web/app/__tests__
rtk proxy bun run build
rtk proxy bunx playwright test
rtk proxy bun run test
rtk proxy bun run test:seo-http
rtk proxy bun run fmt --dry=json
rtk proxy node_modules/.bin/fallow config --format json --quiet
rtk proxy node_modules/.bin/fallow architecture --format json --quiet --explain
rtk proxy node_modules/.bin/fallow audit --format json --quiet --explain
rtk proxy bun run graphify:query "Which packages own shared foundations?"
rtk proxy bun run graphify:update
```

Unit/contract tests use Bun's native test runner; no Vitest wrapper exists. `bun run test` runs Bun tests followed by Playwright and assumes a completed production build, just like direct `bunx playwright test`. Bare `bun test packages apps/web/app/__tests__` runs only Bun tests. Final results: 51 Bun tests, 112 assertions across 7 files; 36 Playwright checks across desktop/mobile light/dark projects. Playwright starts/reuses production preview at `http://127.0.0.1:3102`; to keep it open manually, run `rtk proxy bun run --cwd apps/web start --port 3102` after building. This is a local preview URL, not a deployed site.

**Exclusive writer:** run `test:seo-http` separately, never concurrently with registry edits, builds, previews, or browser checks. It temporarily appends a Live fixture to registry source, builds with synthetic `shell.example.test` / `generator.example.test` domains, and serves local port `3103`. Its cleanup restores exact original registry source and rebuilds default no-origin preview. Synthetic domains test SEO output only; they are not verified production destinations. Final HTTP test passed and restoration completed.

Fallow uses pinned local binary, styling analytics, advisory `css-token-drift`, and `new-only` audit scope. Final gate passed with 13 introduced styling warnings and zero introduced dead-code, complexity, or duplication findings; inherited findings were zero. Architecture reported zero issues, but unconfigured boundary/policy rules were not assessed. Introduced findings must be distinguished from inherited findings using audit attribution, not who edited a file. No commits, branches, deployment, or CI execution are implied. Repo policy allows CI only after a PR from `develop` into `main` is merged.

## Add A Tool

Do not scaffold a generator merely to fill the Catalog. When a real Tool is ready for implementation:

1. Keep tool-specific components and logic under `apps/<slug>` and add a route under `apps/web/app/<slug>` for the single PaperKit deployment. Reuse the shared platform header and footer; keep them out of printed output.
2. Declare workspace dependencies so builds track tool source changes. Reuse `@repo/ui` and other shared packages instead of copying foundations.
3. Register the tool in [registry data](packages/tool-registry/src/tools.ts). Use a same-origin path for a working local route; keep unfinished tools `coming-soon` without an `href`.
4. Verify the route, navigation, responsive behavior, accessibility, and output locally. Before public release, verify the real HTTPS deployment and configure its canonical origin.

See [single-domain decision](docs/adr/0002-single-domain-tools.md) and [registry contract](packages/tool-registry/README.md).

## Release Configuration

Local previews work without `PAPERKIT_CANONICAL_ORIGIN`; origin-dependent canonical metadata, sitemap entries, and structured data must then be omitted. Before public release, verify the production HTTPS origin and configure that environment variable in the shell's deployment. Parser accepts HTTP(S) origins without credentials, path, query, or fragment; parser acceptance alone does not verify production ownership or suitability. Never ship a synthetic test origin or guessed domain. Only verified Live Tools belong in live-tool SEO output.

Approved reference claims and footer `#` links are retained iteration exceptions, not verified legal/privacy guarantees or working destinations. [Implementation report](docs/implementation/paperkit-platform-shell.md) separates local results from release readiness.

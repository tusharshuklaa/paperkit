# Driver Salary Slip Implementation Plan

Status: implementation in progress. Source parity is frozen; independent app, validated form, three receipt templates, signatures, opt-in persistence, and print workflow are implemented. Remaining work: final integration review, documentation/evidence, and full handoff checks.

## Goal

Port complete user-facing functionality from the sibling Driver Salary Slip Generator into `apps/driver-salary-slip`, using PaperKit's design system, theme, and fonts. Preserve useful workflows and receipt content, not source defects, branding, or framework configuration.

This document is an implementation plan, not authorization to deploy, commit, create a branch, or run CI.

## Confirmed Decisions

1. Use a separate Next.js app, consistent with the [existing architecture decision](../adr/0001-separate-tool-apps.md). Do not put generator screens in the Platform Shell.
2. Keep all existing fields, three templates, live preview, signature features, stamp toggle, editable declaration, browser printing, and opt-in local saving.
3. Use current PaperKit controls, tokens, light/dark theme, and fonts throughout the app and receipts. Preserve template content and section structure, not source visual styling.
4. Correct validation, unsafe restoration, uncontrolled-state, image-lifecycle, and print-layout defects within this port. Do not copy bugs for literal parity.
5. Label the source's ambiguous Employee Name field **Payer Name**. Preserve its reimbursement role in declarations. Use [context terminology](../../apps/driver-salary-slip/GLOSSARY.md).
6. Preserve generated name signatures, upload, removal, translation, rotation, scale, and reset. Evaluate a suitable signature-only font; Alex Brush is permitted as fallback. Source Roboto is not needed.
7. Copy functional assets as needed, including the stamp image and currency data. Do not migrate source branding, analytics, Speed Insights, license files, icon credits, personal links, or original-site SEO/config. Both repositories belong to the user; no separate licensing workstream is requested.
8. Use browser printing and browser Save as PDF. Do not add a direct PDF download engine or PDF/A, tax-compliance, or signature-authentication claims.
9. Preserve opt-in Save & Print and monthly saved-data reuse. Distinguish Reset Form from Clear Saved Data. Do not attempt automatic cross-origin storage transfer.
10. Deliver working local app and production build. Hosting/provider/domain provisioning is out of scope. No separate Coming Soon phase or placeholder screen is part of this plan.
11. Do not invent a deployed URL or weaken the shared registry's verified-HTTPS contract. Leave actual catalog navigation unchanged until a real destination can be supplied; do not redesign availability across unrelated tools.

## Evidence And Boundaries

Source behavior is determined by code, not stale source docs:

- [Form defaults and restoration](../../../driver-salary-slip-generator/app/page.tsx).
- [Fields, uploads, currency selection, signature adjustments](../../../driver-salary-slip-generator/components/details-form.tsx).
- [Schema, canvas generation, persistence](../../../driver-salary-slip-generator/lib/utils.ts).
- [Derived template values](../../../driver-salary-slip-generator/hooks/use-template-values.tsx).
- [Print dialog](../../../driver-salary-slip-generator/components/save-confirmation-dialog.tsx).
- [Template 1](../../../driver-salary-slip-generator/components/template1.tsx), [Template 2](../../../driver-salary-slip-generator/components/template2.tsx), [Template 3](../../../driver-salary-slip-generator/components/template3.tsx).

Target contracts: [UI package](../../packages/ui/README.md), [tool registry](../../packages/tool-registry/README.md), [document engine](../../packages/document-engine/README.md), [workspace scripts](../../package.json), and [current design authority](../../apps/web/DESIGN.md). Historical shell specs are not current font authority.

`@repo/document-engine` has no implementation to reuse. Keep print/signature/persistence logic app-local rather than building a generalized engine for one consumer. Existing UI controls should be consumed through public exports; new controls stay local unless a concrete shared need appears.

## Functional Parity Matrix

| Area | Required behavior | Acceptance evidence |
|---|---|---|
| Initial state | Template 1; both salutations Mr.; empty names/vehicle; INR; payment today; amount 0; current salary month; stamp on; default declaration; neutral signature transform | Fresh-session form and preview tests |
| Names | Driver and payer names with Mr./Mrs. salutations; edits immediately reach receipt | Test both roles in each template |
| Vehicle | Vehicle number, displayed uppercase as in source | Edit, restore, reset, and printed output |
| Dates | Payment calendar from 1900 onward; future dates allowed; salary month independent; no new salary-year field | Boundary dates and different salary/payment months |
| Amount | One nonnegative salary amount, including zero and decimals; no payroll calculations or forced currency conversion | Zero, decimal, negative, empty, nonfinite checks |
| Currency | All 165 source options retained, including duplicate symbols and historical entries; INR default | List count, stable identity, selected symbol on all templates |
| Declaration | Editable optional declaration, initialized with source text | Custom and empty text; save/restore |
| Templates | Three selectable layouts, same underlying form state | Switching changes arrangement, not entered values |
| Template 1 | Payer declaration/name/date; divider; separate acknowledgement containing driver, vehicle, amount and payer; stamp/signature | Screen and print checks |
| Template 2 | Vehicle/month/amount/date summary; declaration/payer; separate acknowledgement; stamp/signature | Screen and print checks |
| Template 3 | Single certification/declaration; paired vehicle/date and driver/payer details; stamp/signature footer | Screen and print checks |
| Stamp | Source revenue-stamp image can be shown/hidden | Toggle, persistence, no failed asset |
| Name signature | Driver name generates local transparent signature image | Font-ready, empty/long/accented-name tests |
| Upload | Uploaded image overrides name signature; removing upload restores generated signature | Upload/remove/replacement, invalid files |
| Transforms | X/Y -100 to 100 px; rotation -45 to 45 degrees; scale 50%-200%, 5% steps; reset to 0/0/0/1 | Numeric boundaries, keyboard, every template |
| Print dialog | Cancel, Just Print, Save & Print; dialog closes before printing | Cancel invokes no print; other paths invoke once |
| Saved draft | Explicit local save; automatic safe restore on later visit; no autosave | Storage unchanged until explicit save |
| Monthly reuse | Save payment day only; restore into current month/year; salary month becomes current month; invalid day falls back to today | Month rollover, leap year, 31st into short month |
| Reset/clear | Reset restores fresh defaults, not restored draft; Clear Saved Data deletes persisted record | Reload after each action |
| Privacy | No telemetry or form uploads; precise local-retention notice | Network inspection and storage tests |

The default declaration text and receipt wording come from source. User-entered content must remain escaped text, never injected HTML. A name signature and stamp image are visual content, not verified legal instruments.

## Ordered Implementation

### 1. Freeze Source Parity Fixtures

1. Re-read source owners above immediately before implementation and record source revision. Do not change the sibling app.
2. Capture representative form values and content for each template, including all declaration and acknowledgement text. Use synthetic identities, not personal data.
3. Record source defaults, currency list order, default declaration, transform ranges, and persistence format in focused test fixtures.
4. Keep intended behavior separate from known defects: indexed currencies rejected by source schema, empty signature URLs rejected, print bypassing validation, and unsafe saved-record merging.

Check: fixtures cover every parity-matrix row and template section. Source screenshot checks establish content/layout structure, not target visual styling.

### 2. Scaffold Independent Workspace App

1. Add app manifest with unique proposed package name `@repo/driver-salary-slip`; align actual Next/React/TypeScript/Tailwind versions with current PaperKit app and lockfile, not source versions.
2. Reuse shared TS config, Tailwind tokens and `@repo/ui` through `workspace:*`. Import shared UI CSS once and build shared packages before consumption.
3. Add `dev`, `build`, `start`, `typecheck`, `check-types`, `lint`, and formatting scripts consistent with workspace/Turbo conventions. Use root Biome, not copied ESLint or Tailwind 3 config.
4. Add app layout, page, global stylesheet, Next/PostCSS/TS config as needed. Read installed Next documentation before implementation; do not assume source Next 15 APIs/config remain valid.
5. Install only missing runtime deps in the owning workspace: likely React Hook Form, compatible Zod/resolver, date-fns if still needed, Lucide, and accessible dialog/calendar primitives where native or installed options do not suffice. Verify peer versions before adding.
6. Use proposed local port 3103 if free; use another free port if occupied. Keep shell preview ports 3101/3102 untouched.

Check: smallest app consumes shared UI successfully; app typecheck and filtered production build pass before feature work.

### 3. Establish Domain State And Validation

1. Define one app-local Zod form schema under `lib/driver-salary-slip/`, with types derived from it. Avoid ambient copied globals.
2. Define fresh defaults using current local date, source declaration, source currency selection, and identity transforms. Generate defaults on reset rather than reusing restored state.
3. Use explicit template IDs and month options, typed salutations, real finite numbers, valid dates, and optional signature values. Keep source name/vehicle length constraints unless a test demonstrates a source representation mismatch.
4. Preserve all currency entries with stable IDs rather than relying on `symbol__index` as schema input. Keep label/symbol separate; map any reused legacy values explicitly. Do not silently deduplicate or reorder choices.
5. Validate amount at input boundary without turning empty text into zero. Reject negative/nonfinite input. Do not invent tax, grouping, exchange, decimal-rounding, or maximum-salary rules.
6. Use shared parsed receipt data for all templates and printing. Distinguish incomplete live-preview state from validated printable state; optional images/declaration must not block valid output.
7. Map old employee field to payer terminology once at the app boundary. Keep payment date distinct from salary month.

Check: focused Bun tests exercise defaults, every schema boundary, all currency identities, date formatting, and consistent template data. Invalid data cannot reach print; source defaults alone need not constitute a completed receipt.

### 4. Build PaperKit Form And Preview Surface

1. Read current design authority and actual token/font owners. Use PaperKit light/dark colors and typography; printed paper remains white with readable dark text.
2. Present usable generator on first screen: form and receipt preview, not a new marketing page. Use stacked mobile layout and form/preview columns when space permits.
3. Build controlled fields for names/salutations, vehicle, currency, amount, payment date, salary month, declaration, stamp, and template selection. Restoration/reset must update visible controls.
4. Use shared Button, Input, FieldWrapper and relevant document primitives where contracts fit. Use semantic native controls or proven primitives for missing widgets; do not copy all shadcn source components automatically.
5. Implement three-way template radio/segmented selection, checkbox/toggle for stamp, file input with removal, and accessible sliders/numeric controls for transforms. Use Lucide icons with accessible names/tooltips where applicable.
6. Reserve error/status space, preserve browser zoom, visible focus, keyboard operation and reduced motion. Do not let preview sizing shrink form text or clip long values.

Check: browser tests cover every field, controlled reset/restore, keyboard workflow, mobile overflow, both themes, and stable layout while messages/images load.

### 5. Implement Three Receipt Templates

1. Create one component per template, consuming common receipt data and signature/stamp representation, not separate form-state owners.
2. Preserve source title, declarations, acknowledgements, relative section order and document roles. Apply Payer Name terminology where appropriate without changing who declares or receives payment.
3. Reuse shared PaperSheet/DocumentHeader/SignatureBlock where they preserve required layout. The shared RevenueStamp placeholder must not silently replace agreed source stamp artwork.
4. Format receipt dates consistently with source's English day/full-month/year presentation. Keep amount/currency behavior faithful without adding payroll calculations.
5. Define A4 print dimensions/margins and predictable wrapping; allow natural page flow for unusually long content rather than truncating financial text. Do not carry screen aspect-ratio/overflow constraints into print.

Check: all source sections/values appear in each target template; long names, declarations, currency symbols, and transformed signatures remain readable on screen and print.

### 6. Implement Signature And Stamp Assets

1. Evaluate current PaperKit font for name-signature legibility, then shortlist suitable signature-only options such as Caveat or Allura against permitted Alex Brush fallback. These are candidates, not an approved font change.
2. Compare actual rendered samples: short/long names, mixed case, accented characters, small print size, and underline/rotation. Choose legibility, fitting, glyph coverage, and print consistency over ornament. Record chosen font and reason in implementation notes.
3. Keep signature-specific font isolated from UI/document typography. Prefer local build-time assets; wait for font readiness before canvas generation and printing. Use Alex Brush if alternatives are not better.
4. Generate transparent name-signature PNG locally; retain source's signature-like treatment while fitting text to image bounds. Empty driver name produces no misleading default signature.
5. Decode supported uploaded images, reject unsupported/corrupt files with reserved inline error, and clean up replaced/unmounted blob URLs. Guard excessive image dimensions before canvas work and handle decode failures.
6. Preserve transform controls, uploaded-image precedence, remove-to-generated behavior, and identity reset across all templates. Copy optional stamp image to app-owned assets.

Check: actual font/image load succeeds; no fallback-font race, clipping, stale image, unhandled decode failure, or retained object URL after replacement. Uploaded image survives supported save/restore path.

### 7. Implement Safe Opt-In Persistence

1. Use app-owned versioned storage key, proposed `paperkit.driver-salary-slip.draft`; store only fields required for agreed reuse. Do not read arbitrary source-origin storage or add import/export workflows.
2. Build saved-record validation from the form's field definitions while reflecting intentionally different stored representation, such as payment day and optional image data. Reject unsupported versions and malformed values without crashing.
3. Save template, people, vehicle, currency, amount, declaration, stamp, transform and supported uploaded image only after explicit Save & Print. Do not save generated image when it can be regenerated.
4. Preserve monthly semantics: current salary month; saved day applied to current month/year; impossible day falls back to today. Preserve default-declaration sentinel behavior explicitly and test it.
5. Preserve source image-storage cap of 204800 string characters initially. Convert temporary image URLs to supported data URLs. If image cannot be saved, report omission accurately without claiming it was retained.
6. Handle unavailable localStorage, corrupt JSON, unsupported versions, conversion errors and quota failures independently. Save failure must not block printing; warning must remain perceivable after dialog closes.
7. Add separate Reset Form and Clear Saved Data actions. Reset affects current form only; clear removes only this app's record, retains current form, and confirms result. Never call localStorage.clear().
8. Explain optional browser-local retention concisely. No autosave, backend storage, encryption claims, expiry, history, account sync or cross-origin migration.

Check: unit tests cover serialization/restore/date rollover and error branches; browser tests prove no writes before consent, saved image restoration, fresh reset and persistent deletion after reload.

### 8. Implement Validated Print Workflow

1. Validate form before opening print confirmation; focus first invalid field. Live preview may remain available while form is incomplete.
2. Provide Cancel, Just Print, Save & Print. Disable duplicate actions while preparing/saving; no persistence on cancel or Just Print.
3. Close dialog and ensure its overlay/focus lock has left print tree. Await fonts and image readiness plus rendered document layout rather than relying solely on source's 250 ms timeout.
4. Save only on Save & Print, then print even when saving fails, with honest feedback. Guarantee one print invocation per action and recover UI state after browser print/cancel.
5. Print only receipt content. Hide app chrome, controls, dialog, help and feedback; strip screen borders/overflow constraints. Avoid misleading direct-download labels.

Check: mock browser print invocation in interaction tests, use Chromium print-media/PDF output for layout checks, and manually exercise native print dialogs in supported desktop browsers. PDF artifacts are test evidence, not a new product download feature.

### 9. Wire Tests And Workspace Integration

1. Put logic tests in nearest `__tests__` folders, one test file per module. Extend root unit-test discovery explicitly; current root script selects packages and shell tests only.
2. Extend Playwright discovery/server configuration for driver app without dropping shell coverage. Use separate server URLs and avoid running source-mutating SEO harness concurrently with builds/previews.
3. Cover three templates across desktop/mobile and light/dark; test form, signature, storage, dialog, keyboard and printing behavior through public interactions.
4. Use receipt-content assertions and print-specific checks, not only screenshots or mocked print calls. Check failed assets, console errors, network activity and horizontal overflow.
5. Verify local font loading causes no runtime third-party font dependency. Investigate unexpected network requests; never log field values or signature images.
6. Keep registry ID `salary-slip` distinct from app slug. Review description for unsupported overtime/tax claims and align it with implemented receipt scope when touching integration.
7. Do not add a placeholder route, Coming Soon screen, guessed HTTPS destination or localhost registry entry. Existing availability remains unchanged absent real destination. Later URL wiring is configuration follow-up, not a prerequisite to completing app implementation.

Check: existing shell/registry tests and new app tests pass together. Shared callers retain behavior; no unrelated tool availability changes.

### 10. Verify And Document Handoff

Run local checks, not full CI. Commands below use proposed package name from step 2; confirm final scripts before execution:

```sh
rtk proxy bun install
rtk proxy bunx turbo run build --filter=@repo/driver-salary-slip...
rtk proxy bunx turbo run typecheck --filter=@repo/driver-salary-slip...
rtk proxy bun test apps/driver-salary-slip
rtk proxy bun run typecheck
rtk proxy bun run lint
rtk proxy bunx playwright test
rtk proxy bun run build
rtk proxy node_modules/.bin/fallow architecture
rtk proxy node_modules/.bin/fallow audit --format json --quiet --explain --gate-marker agent
```

1. Run narrow behavior tests after each small implementation step, before broader checks. Root commands are final regression checks, not substitutes for focused feedback.
2. Build shared dependencies, start app through a VS Code task using `rtk proxy bun run --cwd apps/driver-salary-slip dev --port 3103` or a free alternative, and give user actual local URL.
3. Capture desktop/mobile light/dark screenshots and print samples for each template. Inspect font rendering, long-content wrapping, signature position, stamp, page count, clipping, keyboard focus and layout stability.
4. Exercise native print and browser Save as PDF manually; record browser/version and any unsupported automated checks. Do not claim physical-printer verification from Chromium PDF alone.
5. Add app README with commands, state/storage behavior, print limits, font choice and asset paths. Record verification outcomes and any inherited findings in implementation report. Refresh graph after implementation when useful.
6. Keep hosting, domains, production-origin setup and deployed catalog destination as explicit out-of-scope configuration, not fake values or hidden blockers to local completion.

## Proposed File Responsibilities

These are proposed paths, not files that already exist. Keep names aligned with actual exports and avoid empty scaffolding.

| Proposed path | Responsibility |
|---|---|
| `apps/driver-salary-slip/app/layout.tsx` | PaperKit fonts/theme providers, shared CSS, app metadata |
| `apps/driver-salary-slip/app/page.tsx` | Generator entry point |
| `apps/driver-salary-slip/app/globals.css` | Token-based app layout and print rules |
| `apps/driver-salary-slip/components/DriverSalarySlip.tsx` | Client form/state owner |
| `apps/driver-salary-slip/components/SalarySlipForm.tsx` | Controlled input surface |
| `apps/driver-salary-slip/components/ReceiptPreview.tsx` | Selected template and paper surface |
| `apps/driver-salary-slip/components/ReceiptTemplate{1,2,3}.tsx` | Individual receipt layouts |
| `apps/driver-salary-slip/components/SignatureControls.tsx` | Upload/removal/transform controls |
| `apps/driver-salary-slip/components/PrintDialog.tsx` | Consent choices and preparation feedback |
| `apps/driver-salary-slip/lib/driver-salary-slip/` | Form schema/defaults, currency data, receipt formatting, saved-draft operations and signature generation; one export per file |
| `apps/driver-salary-slip/hooks/` | Browser lifecycle hooks when needed, not generic wrappers |
| `apps/driver-salary-slip/public/` | Stamp and selected local signature-font assets |
| Nearest `__tests__/` folders | Schema, persistence, formatting and browser behavior coverage |

Dependency order: fixtures -> runnable app -> schema/defaults -> form/templates -> signatures -> persistence -> print integration -> full browser verification. Pure persistence/signature helpers can be tested independently once schema is stable; print integration depends on both.

## Completion Criteria

- Every parity-matrix row is implemented and has recorded acceptance evidence.
- All three templates render correct user data with PaperKit styling, not source theme or branding.
- Generated and uploaded signatures, stamp and all adjustment controls work in preview, saved state and print.
- Invalid form cannot print; malformed saved data cannot crash app; storage/image failures do not falsely report success or prevent printing.
- Save remains explicit; reset and clear have distinct tested behavior; monthly reuse matches agreed semantics.
- App works locally and production build passes alongside affected workspace checks; no full CI run is triggered.
- Desktop/mobile, light/dark, keyboard and print checks pass; limitations and inherited findings are documented.
- No telemetry, direct PDF engine, payroll expansion, fabricated deployment URL or new Coming Soon stage is introduced.

## Out Of Scope

Payroll components, overtime, deductions, tax calculations, amount-in-words, salary-year field, currency conversion, extra templates, signature authentication, fiscal/legal guarantees, direct PDF download, PDF/A, generalized document engine, server/API/auth, cloud storage, draft history, cross-origin draft migration, new marketing page, unrelated shell redesign, hosting provisioning and CI changes.

## Problem Statement

People preparing driver salary receipts need the complete workflow of the existing Driver Salary Slip Generator within PaperKit: entering payment details, choosing a receipt layout, including a signature and stamp image, reusing details in later months, and printing a usable receipt. The Platform Shell currently offers discovery but no independent PaperKit driver salary receipt application.

A literal repository copy would import source branding, fonts, telemetry, old framework configuration, and defects in validation, saved-data restoration, and print layout. Users instead need familiar functionality expressed through PaperKit's design system, with dependable handling of incomplete forms, local storage failures, images, and printing.

## Solution

Build an independent Driver Salary Slip Tool in the PaperKit monorepo. Preserve every existing user workflow and the content and section structure of all three Receipt Templates, while adopting PaperKit's controls, typography, tokens, and light/dark theme.

Provide a live preview, validated browser printing and Save as PDF through the browser, optional browser-local saved details, and clear reset/deletion behavior. Preserve generated Name Signatures, signature uploads and adjustments, and the optional Stamp Image. Use precise Payer terminology and avoid claims of payroll calculation, tax eligibility, legal validity, or authenticated signatures.

Deliver a locally usable and production-buildable application without requiring hosting provisioning, inventing a public URL, or adding a separate Coming Soon stage.

## User Stories

1. As a payer, I want the working generator on the first screen, so that I can prepare a receipt without navigating a marketing page.
2. As a payer, I want the Tool to use PaperKit's design system, so that it feels consistent with the platform.
3. As a payer, I want readable light and dark themes, so that I can work in my preferred appearance.
4. As a mobile payer, I want a readable single-column workflow, so that I can enter details without horizontal scrolling.
5. As a desktop payer, I want form and preview visible together when space permits, so that I can inspect changes efficiently.
6. As a payer, I want fresh defaults for the current date and Salary Month, so that I can begin without outdated values.
7. As a payer, I want the first Receipt Template, INR, Mr. salutations, and enabled Stamp Image selected initially, so that source defaults remain familiar.
8. As a payer, I want initially empty names and vehicle details, so that another person's information is not implied.
9. As a payer, I want to enter the Driver's name and salutation, so that the receipt identifies the recipient.
10. As a payer, I want to enter my name and salutation under Payer Name, so that my role is not confused with the Driver or employer.
11. As a payer, I want Mr. and Mrs. salutation options for both people, so that existing functionality is retained.
12. As a payer, I want to enter the vehicle number, so that the receipt identifies the relevant vehicle.
13. As a payer, I want the vehicle number displayed uppercase on the receipt, so that source presentation is retained.
14. As a payer, I want to select a Payment Date, so that the receipt records when payment occurred.
15. As a payer, I want supported Payment Dates from 1900 onward, including future dates, so that the existing date range remains available.
16. As a payer, I want to select any month independently of Payment Date, so that I can record a salary paid in another month.
17. As a payer, I want to enter one salary amount, so that I can record the payment without configuring a payroll system.
18. As a payer, I want zero and nonnegative decimal amounts supported, so that the Tool does not invent a positive-only or whole-number restriction.
19. As a payer, I want negative, missing, and nonfinite amounts rejected before printing, so that invalid payment details do not become a receipt.
20. As a payer, I want all existing currency choices retained, so that migration does not remove supported symbols or entries.
21. As a payer, I want currency choices with duplicate symbols to remain distinct, so that selecting or restoring one does not select another.
22. As a payer, I want currency changes reflected in every template, so that my receipt uses the selected symbol.
23. As a payer, I want an editable Declaration initialized with the existing text, so that I can retain or adapt the reimbursement statement.
24. As a payer, I want to leave the optional Declaration empty, so that an unnecessary statement does not block printing.
25. As a payer, I want form edits reflected in a live receipt preview, so that I can check the document before printing.
26. As a payer, I want to switch between all three Receipt Templates without losing data, so that I can compare layouts safely.
27. As a payer, I want the first template's declaration and separate acknowledgement retained, so that its two-part receipt remains available.
28. As a payer, I want the second template's summary and separate acknowledgement retained, so that its alternate structure remains available.
29. As a payer, I want the third template's single certification and paired detail fields retained, so that I can choose a compact arrangement.
30. As a payer, I want template text to preserve who paid, who received payment, and who declares reimbursement, so that terminology changes do not alter document meaning.
31. As a payer, I want readable date formatting consistent across templates, so that payment information is unambiguous.
32. As a payer, I want long names and declarations to wrap rather than disappear, so that important receipt text is not truncated.
33. As a payer, I want an optional Stamp Image that I can show or hide, so that existing document composition remains available.
34. As a payer, I want a Name Signature generated from the Driver's name, so that I can retain the source's signature-style appearance.
35. As a payer, I want the Name Signature to use a suitable, legible font, so that it looks intentional and survives printing.
36. As a payer, I want long and accented names handled without clipped or missing signature text, so that the generated image remains readable.
37. As a payer, I want no generated signature when the Driver name is empty, so that the receipt does not imply a signature that was not provided.
38. As a payer, I want to upload a signature image, so that I can use an image instead of the generated Name Signature.
39. As a payer, I want an uploaded image to take precedence, so that the preview reflects my explicit selection.
40. As a payer, I want removing an upload to restore the Name Signature, so that source behavior is preserved.
41. As a payer, I want to move a signature horizontally and vertically, so that I can position it appropriately.
42. As a payer, I want to rotate and scale a signature within the existing ranges, so that I can fit different images.
43. As a payer, I want to reset signature transforms, so that I can recover the neutral position and size.
44. As a payer, I want unsupported or corrupt images reported clearly, so that upload failure does not silently break the receipt.
45. As a payer, I want signature and stamp assets ready before printing, so that the printed receipt matches the preview.
46. As a payer, I want incomplete forms to remain previewable, so that I can work incrementally.
47. As a payer, I want invalid fields identified and focused before print confirmation, so that I can correct them efficiently.
48. As a payer, I want Cancel, Just Print, and Save & Print choices, so that I control whether my details are retained.
49. As a payer, I want Cancel to neither print nor save, so that leaving the dialog has no hidden side effects.
50. As a payer, I want Just Print to avoid saving details, so that I can create a receipt without local retention.
51. As a payer, I want Save & Print to save explicitly and then print, so that I can reuse details later.
52. As a payer, I want saving failures to be reported without preventing printing, so that storage problems do not stop my immediate task.
53. As a payer, I want duplicate print actions prevented during preparation, so that one action does not open multiple print dialogs.
54. As a payer, I want only receipt content printed on A4 paper, so that controls, overlays, and app navigation do not appear in the output.
55. As a payer, I want to use browser Save as PDF, so that I can retain a PDF through the existing print workflow.
56. As a returning payer, I want explicitly saved details restored automatically, so that I do not re-enter recurring information.
57. As a returning payer, I want the Salary Month reset to the current month, so that monthly reuse does not silently retain last month's selection.
58. As a returning payer, I want my saved payment day applied to the current month and year, so that source monthly reuse semantics are retained.
59. As a returning payer, I want an impossible saved day to fall back to today, so that a short month does not produce an invalid date.
60. As a returning payer, I want supported uploaded signatures and transforms restored, so that I do not repeat image setup unnecessarily.
61. As a payer, I want a warning when a signature cannot be retained, so that I know what will be missing on my next visit.
62. As a payer, I want malformed or unsupported saved records ignored safely, so that bad local data cannot crash the generator.
63. As a payer, I want Reset Form to restore fresh defaults without deleting saved data, so that I can start another receipt deliberately.
64. As a payer, I want Clear Saved Data to delete only this Tool's saved record, so that I can remove retained information without losing unrelated browser settings.
65. As a payer, I want clearing saved data to retain my current form until I choose to reset it, so that deletion does not discard work in progress.
66. As a privacy-conscious payer, I want no autosave, telemetry, or form uploads, so that entering receipt information does not silently retain or transmit it.
67. As a privacy-conscious payer, I want accurate disclosure of optional browser-local retention, so that I understand what Save & Print stores.
68. As a keyboard user, I want all fields, selectors, dialogs, uploads, and adjustments operable without a pointer, so that I can complete the workflow independently.
69. As an assistive-technology user, I want named controls, associated errors, and predictable dialog focus, so that the workflow is understandable and recoverable.
70. As a payer, I want stable layout during errors, font loading, and image preparation, so that controls do not shift unexpectedly.
71. As a payer, I want browser zoom and reduced-motion preferences respected, so that the Tool remains comfortable to use.
72. As a maintainer, I want an independent Tool app using existing workspace foundations, so that generator behavior is not coupled to the Platform Shell runtime.
73. As a maintainer, I want corrected validation and restoration rather than copied defects, so that functional parity does not preserve known failures.
74. As a maintainer, I want existing shell and shared-package tests retained, so that adding the Tool does not regress discovery or design foundations.
75. As a maintainer, I want an accurate catalog description without unsupported overtime or tax promises, so that discovery matches implemented functionality.
76. As a maintainer, I want a working local URL and passing production build without a hosting prerequisite, so that implementation can be completed before public deployment.
77. As a maintainer, I want recorded visual, print, and behavior verification, so that completion claims are supported by evidence.
78. As a maintainer, I want signature-font choice and print limitations documented, so that future changes preserve intentional behavior.

## Implementation Decisions

- Follow the accepted separate-app architecture: the Tool is an independent Next.js application; the Platform Shell remains discovery-only. Shared workspace packages are build-time dependencies, not runtime composition or microfrontends.
- Perform a functional port, not a repository/config copy. Align actual framework, React, TypeScript, Tailwind and dependency versions with current PaperKit configuration and installed-version documentation. Use Bun workspaces, existing Turbo conventions, shared TypeScript configuration, root Biome and public shared UI exports.
- Reuse existing helpers, platform features and installed dependencies first. Use React Hook Form with one Zod form schema and compatible resolver; add only missing dependencies in their owning workspace. No copied ESLint setup or competing styling/config package.
- Keep one client form-state owner, shared derived receipt data, three template renderers, signature generation/lifecycle handling, saved-draft operations and print orchestration. Keep browser-specific work app-local; the document-engine package remains a placeholder rather than becoming a generalized PDF/print framework.
- Use PaperKit's current design authority, tokens, theme and fonts rather than historical shell specifications or source styles. Receipt paper stays white with readable dark text in both app themes. Reuse shared controls and document primitives where contracts fit; do not silently substitute the shared decorative stamp placeholder for the agreed functional Stamp Image.
- Use Payer for the person paying the Driver and, where applicable, declaring reimbursement. A Salary Receipt records payment; it is not a payroll calculation or tax certificate. Salary Month and Payment Date remain independent concepts. The optional form statement is a Declaration.
- Preserve source defaults: first template, Mr. for both salutations, empty names/vehicle, INR, today's Payment Date, zero amount, current Salary Month, default Declaration, enabled Stamp Image, and neutral signature transform. Empty required fields prevent printing, not initial rendering or live preview.
- Preserve all source fields and choices: two names/salutations, vehicle number, Payment Date, twelve Salary Months, one salary amount, all 165 currency options, optional Declaration, Stamp Image toggle and signature controls. Do not add a salary-year field or payroll calculations.
- Preserve all source currency labels/symbols, including duplicate symbols and historical entries. Use stable choice identities and separate display symbols instead of making encoded source values the validation contract. INR remains the default; no silent deduplication, exchange conversion or new rounding rules.
- Validate supported template IDs, month membership, salutations, source name/vehicle length constraints, valid Payment Dates from 1900 onward, finite nonnegative salary amount, transform ranges and optional image/declaration values. Convert numeric input deliberately; empty numeric input must not silently become zero. Do not require source-style nonempty signature URLs.
- Make controls fully controlled so restoration and reset update visible values. Preserve source uppercase vehicle presentation and receipt date presentation with English day, full month and year. Render user content as escaped text.
- Preserve all three receipt titles, declaration/acknowledgement wording, roles and section order while applying PaperKit typography and layout treatment. The first and second templates retain separate acknowledgements; the third retains a single certification and paired details. Long content wraps or flows across pages rather than being silently truncated.
- Preserve source Stamp Image as an optional local asset. It is an image, not evidence of fiscal or legal validity. Copy only functional assets/data needed for parity; no source branding, personal links, original-site SEO, telemetry, font setup or license-file migration is requested. Both repositories belong to the user; no separate licensing workstream is part of this migration.
- Generate Name Signatures locally as transparent images. Evaluate current PaperKit font and suitable signature-only alternatives against Alex Brush; Alex Brush is permitted if alternatives do not improve suitability. Evaluate actual short, long, mixed-case and accented names at print size; record the selected font and reason. Keep any signature-only font isolated from UI/document typography, load it locally and wait for readiness before rendering.
- Preserve uploaded-image precedence, removal restoring generated Name Signature, translation from -100 to 100 pixels on both axes, rotation from -45 to 45 degrees, scale from 50% to 200% in 5% steps, and reset to zero translation/rotation and unit scale. Empty Driver name produces no generated signature. Decode images safely, report unsupported/corrupt content and release temporary object URLs on replacement/unmount.
- Keep saving opt-in through Save & Print; do not autosave. Store an app-owned, versioned record and validate restored data before use. Save recurring form values, template, stamp, transforms and supported uploaded image, not regenerable Name Signature pixels. Unsupported versions and malformed records must not crash the app.
- Preserve monthly reuse: store payment day, restore into current month/year, reset Salary Month to current month, and fall back to today if saved day is impossible. Preserve source default-Declaration sentinel semantics deliberately rather than accidentally changing restored text behavior.
- Preserve the initial source uploaded-image storage cap of 204800 string characters, explicitly distinguished from bytes. Convert temporary image references to supported persistent image data. Report image omission, conversion failure, unavailable storage and quota failures accurately, without claiming unsaved values were retained.
- Reset Form regenerates fresh defaults and does not delete saved data. Clear Saved Data removes only this Tool's record, retains current in-memory form and reports result. Never clear unrelated browser storage or transfer data automatically across origins.
- Validate before opening print confirmation and focus the first invalid field. Keep Cancel, Just Print and Save & Print. Cancel neither saves nor prints; Just Print never saves; Save & Print attempts save and prints even if saving fails, with perceivable feedback.
- Prevent duplicate preparation/print actions. Close the dialog and remove its overlay/focus lock before printing; await font/image readiness and rendered layout rather than relying solely on a fixed delay. Recover state after browser print or cancel.
- Use browser printing and browser Save as PDF, not direct downloadable PDF generation. Print only receipt content with explicit A4 rules; remove screen-only dimensions, overflow clipping, borders, controls and chrome. Do not guarantee every possible Declaration fits a single page.
- Extend workspace scripts and browser-test server/discovery configuration to include the new Tool without dropping shell checks. Build shared package output before consumption. Use a free local port without disturbing existing shell previews.
- Keep catalog identity distinct from the app's package/slug. Align unsupported overtime/tax wording with actual functionality when touching discovery. Do not add a Coming Soon milestone/screen, invent a production destination, accept localhost as a public HTTPS destination, or change unrelated tools' availability. Without a real verified destination, leave current navigation unchanged; supplying it later is configuration follow-up, not a local implementation blocker.
- Hosting provider, domains and public-origin provisioning are outside implementation scope. Allow verified non-origin metadata locally and omit guessed canonical/social URLs. Provide a real local preview URL after implementation and verify a production build.

## Testing Decisions

- The already-agreed primary boundary is the running application's public browser workflow: fill fields, inspect receipts, select templates, upload/adjust images, save/reload/reset/clear, and request printing. No new interview or test-only production API is needed.
- Good tests assert user-visible behavior and published data contracts, not component internals, private hook calls, CSS class names or particular decomposition. Prefer semantic roles, labels and accessible names. Use screenshots for visual evidence, not as the only proof of correct receipt content.
- Existing prior art is PaperKit's Playwright shell acceptance coverage, Bun package/contract tests, and workspace typecheck/lint/build checks. Extend these patterns instead of introducing a second testing framework. Keep focused tests near their owning modules.
- Test form validation/defaults, currency identity and receipt formatting through their data contracts where browser-only tests would make date and malformed-input cases needlessly expensive. Cover every retained currency choice, zero/decimal/empty/negative/nonfinite amounts, independent Salary Month and Payment Date, boundary dates, and optional signatures/Declaration.
- Exercise all three templates through the real app and verify payment values, Declaration and acknowledgement roles/sections. Switching templates must preserve data. Include maximum supported names/vehicle values, long Declaration, empty optional content, duplicate currency symbols and transformed signatures.
- Test signature font readiness, long/accented-name fitting, empty-name behavior, upload replacement/removal, invalid image handling, transforms and saved-image restoration. Verify real assets load, not only mocked canvas or image methods.
- Test persistence as a serialization/restoration contract and through actual browser reload. Cover no save before consent, monthly rollover, leap years, saved 31st into a short month, default Declaration handling, malformed/unsupported records, image cap, conversion/storage/quota failures, reset-to-fresh defaults and deletion without touching unrelated storage.
- Test dialog outcomes through visible interactions. Invalid forms never reach print; Cancel neither saves nor prints; Just Print does not save; Save & Print prints once even after a save failure. Warnings must remain perceivable after dialog closure.
- Browser print invocation may be intercepted to assert orchestration, but that is not sufficient print verification. Use print-media checks and Chromium-generated PDF artifacts to inspect A4 layout, page flow, hidden app chrome, assets, clipping and actual template content. These artifacts are test evidence, not a new product download feature.
- Manually exercise native print dialogs and Save as PDF in supported desktop browsers; record browser/version and limitations. Do not describe Chromium PDF generation as physical-printer verification.
- Cover desktop/mobile and light/dark, keyboard navigation, accessible labels/errors, dialog focus, browser zoom, reduced motion, stable error/status space and no horizontal overflow. Verify readable white receipt paper in both themes.
- Inspect failed font/image requests, console errors and unexpected network activity. Confirm no telemetry, form uploads or runtime third-party signature-font requests. Do not print personal form values or signature data in test logs.
- Run narrow behavior tests after small changes, then affected shared/shell tests and workspace checks. Update root test discovery explicitly because current unit-test selection targets existing packages and shell only. Avoid source-mutating SEO harnesses concurrently with builds/previews.
- Run local typecheck, lint, production build and relevant Fallow checks; distinguish introduced findings from inherited debt. Do not run full CI outside the repository's permitted merged-PR condition. Record evidence and unverified behavior honestly.

## Out of Scope

- Payroll components, overtime, allowances, deductions, tax calculation/eligibility, amount-in-words, exchange conversion, salary-year field and additional Receipt Templates.
- Direct PDF download, PDF/A, authenticated/digital signatures, stamp verification, legal/fiscal guarantees, generalized document-engine implementation and physical-printer certification.
- Backend/API/auth, telemetry, cloud storage, autosave, encryption claims, draft history, import/export, account sync and automatic cross-origin draft transfer.
- Source branding, personal/footer links, source font/theme/config replication, separate license-file migration or licensing workstream. A suitable signature-only font, including Alex Brush fallback, is an explicit exception to not carrying over source fonts.
- New marketing page, unrelated shell/shared-package redesign, global availability-model changes and a separate Coming Soon rollout stage.
- Hosting/provider/domain provisioning, invented public origins/destinations, deployment, full CI, commits or branch creation.

## Further Notes

- Interview decisions are settled. The user accepted recommended functional parity, corrected defects, PaperKit presentation, browser printing, opt-in monthly saved-data reuse and local/build completion. They explicitly removed the Coming Soon milestone and permitted source functional assets without a licensing workstream.
- The user accepted Payer terminology, generated/uploaded signature and stamp parity, and deferred hosting. They requested evaluation of a better signature font and explicitly permitted copying Alex Brush if no better option is found. Font choice remains an implementation evaluation, not a missing product decision.
- The domain glossary and detailed ten-phase implementation plan are already recorded in the repository. Their order is source parity fixtures, independent app scaffold, validated state, form/preview, templates, signature assets, persistence, print orchestration, workspace/test integration and verified handoff. This spec defines outcomes; the plan supplies proposed paths and commands without making them fixed acceptance requirements.
- Source code, not stale source docs, is parity authority. It offers one salary amount, not payroll/overtime calculations; its Print PDF action is browser printing; its schema and print path currently disagree. These defects must not be copied as requirements.
- Existing Separate Apps for Document Generators decision remains authoritative. The Platform Shell's definitions of Live and Coming Soon are not redefined; no guessed destination or availability claim is required to complete the Tool locally.
- If implementation occurs without access to the sibling repository, obtain the source revision and functional fixtures before asserting complete parity; do not reconstruct receipt wording or currency data from guesses.
- Completion requires all user workflows implemented, all three templates verified with PaperKit styling, passing local and production-build checks, browser/print evidence, accurate privacy/storage behavior, a documented signature-font choice, and a real local URL. Record any inherited findings and remaining browser limitations. Public hosting is not a completion prerequisite.
- Publishing this specification does not start implementation or authorize commits, branches, deployment or CI execution.

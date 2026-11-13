---
target: apps/driver-salary-slip
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/shukltus/__/playground/paperkit/apps/driver-salary-slip"
timestamp: 2026-11-13T14-03-03Z
slug: apps-driver-salary-slip
---
# Design Critique: Driver Salary Slip

**Design Health**

Operate-mode surface. All 10 heuristics apply.

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3/4 | Live preview, inline validation, and print/save feedback; post-print completion is less explicit. |
| 2 | Match System / Real World | 3/4 | Salary-slip fields map well to the task; stamp and currency choices need context. |
| 3 | User Control and Freedom | 2/4 | Reset, clear, and Cancel exist; Escape did not dismiss the print dialog. |
| 4 | Consistency and Standards | 3/4 | Controls are consistent, but desktop title reads like a hero rather than an app title. |
| 5 | Error Prevention | 2/4 | Amount defaults to `0`, which passes validation and appears on the receipt. |
| 6 | Recognition Rather Than Recall | 3/4 | Labeled fields and live preview help; mobile preview sits far below the form. |
| 7 | Flexibility and Efficiency | 2/4 | Templates and saved drafts help repeat use; 165 currencies make lookup cumbersome. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Calm and legible, but the long form and oversized title compete with the receipt. |
| 9 | Error Recovery | 3/4 | Field-specific errors retain data and focus the first invalid field. |
| 10 | Help and Documentation | 2/4 | Privacy and signature hints exist; stamp validity and currency choice lack guidance. |
| **Total** |  | **25/40** | **Acceptable; strongest gains are safer amount defaults and mobile preview access.** |

**Design Specificity**
**Moderate.** Receipt preview, salary fields, templates, stamp, and signature make the task recognizable. The form-plus-preview shell could fit many document tools, and the large `PK` branding/title do little to establish product character.

**Deterministic scan:** CLI detector returned `[]` (zero findings). Browser overlay identified one issue: **flat type hierarchy**, reporting body 14px, h3 16px, h1 18px, h2 18px, with a largest adjacent step of 1.14:1 versus its 1.25:1 target. No CLI/browser false positive could be established; the browser-only finding is not reflected in the CLI result.

**Overall Impression**
The receipt is tangible and reassuring while editing, but the mobile flow asks users to leave the artifact behind while they fill a long form. The biggest opportunity is keeping the receipt in reach while preventing accidental zero-payment output.

**What’s Working**
- The receipt is the core artifact; switching among three templates updates the preview.
- Labels, grouped fields, inline errors, and focus-on-first-error make form recovery practical.
- Draft saving is opt-in and accompanied by a privacy note; clearing saved data is distinct.

**Priority Issues**
1. **[P1] Mobile users lose sight of the receipt.** At 390px, the preview follows a form roughly 1,445px tall, forcing repeated scrolling to verify the result. Keep a compact preview reachable during editing, or divide entry into steps with a persistent preview and print action. Evidence: [globals.css](apps/driver-salary-slip/app/globals.css). **Suggested command:** `$impeccable adapt`.
2. **[P1] A forgotten amount can become a zero-payment receipt.** The amount starts at `0`, and zero passes schema validation. Start blank and require a positive amount, or require explicit confirmation where zero is valid. Evidence: [create-default-values.ts](apps/driver-salary-slip/lib/driver-salary-slip/create-default-values.ts), [form-schema.ts](apps/driver-salary-slip/lib/driver-salary-slip/form-schema.ts). **Suggested command:** `$impeccable harden`.
3. **[P2] Currency selection is a 165-option lookup.** INR is preselected, but finding another currency is still a long list. Add search and surface common choices while retaining the full set. Evidence: [currency-options.ts](apps/driver-salary-slip/lib/driver-salary-slip/currency-options.ts). **Suggested command:** `$impeccable clarify`.
4. **[P2] Stamp image can imply legal validity.** The toggle says “Include revenue stamp image,” while the glossary notes that its presence does not establish legal validity. Put that caveat beside the toggle. Evidence: [SalarySlipForm.tsx](apps/driver-salary-slip/components/SalarySlipForm.tsx), [GLOSSARY.md](apps/driver-salary-slip/GLOSSARY.md). **Suggested command:** `$impeccable clarify`.
5. **[P2] Escape leaves the print dialog open.** Escape did not close the dialog; clicking Cancel did. Handle the native cancel event and restore focus. Evidence: [PrintDialog.tsx](apps/driver-salary-slip/components/PrintDialog.tsx). **Suggested command:** `$impeccable harden`.

**Cognitive Load**
Four checklist failures: chunking (five inputs in “People”), visual hierarchy (print action comes after the long form), minimal choices, and working memory (mobile preview requires scrolling away from the entered content). The currency selector has 165 choices and salary month has 12; these are dropdown choices, not simultaneously visible controls. Grouping, single-focus, one-decision-at-a-time, and progressive disclosure otherwise hold up.

**Emotional Journey**
The dark green shell and paper preview make the task feel professional. Live updates and actionable validation reassure during entry. On mobile, distance from the preview creates friction; the print dialog restores some control with Cancel, Just Print, and Save & Print, though Escape fails.

**Persona Red Flags**
- **Jordan, first-time user:** 165 currency options without visible search; no inline explanation of the stamp’s legal significance.
- **Sam, keyboard user:** Escape fails to exit print confirmation; Cancel is the only observed route out.
- **Casey, mobile user:** Preview is below the full form, and interruption recovery depends on completing the form and explicitly saving.

**Minor Observations**
- Desktop title is unusually dominant for an Operate surface; reduce it to app-title scale.
- Preview showed `₹ 25000` without digit grouping; format by selected currency and locale.
- Browser emitted date-input format warnings for values like `Fri Nov 13 2026 ...`; worth checking separately from this visual critique.

**Questions to Consider**
- Should mobile keep a compact preview available, or move to a step-by-step flow?
- Is a zero-amount receipt valid in this product, or should `0` require explicit confirmation?
- Which should be addressed first: mobile flow, safer amount entry, or keyboard behavior? Suggested next action: `$impeccable adapt` for mobile preview access.

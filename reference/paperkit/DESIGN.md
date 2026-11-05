---
name: PaperKit
status: provisional-approved-shell-iteration
---

# PaperKit Design Authority

## Source Precedence

Dark desktop supplies canonical copy, Tool names and sample document data in every theme.
Light desktop supplies light appearance and desktop composition; mobile supplies responsive
composition; component sheet supplies primitive states. Source Sans 3 and JetBrains Mono
replace reference fonts. References are visual evidence, not implementation source to copy.

## Platform Shell

Preserve Header, Hero, Catalog, Operational Protocol, free-service explanation and SiteFooter.
Desktop has balanced copy/document columns; mobile stacks without clipping. Catalog is three
columns on desktop and one on mobile. Header retains Tools, About and theme control.
All three Tools begin Coming Soon, without generator links. Footer placeholders remain `#`.

## Approved Values

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | #FCFCFD | #0B0D10 |
| Surface | #FFFFFF | #12151A |
| Alternate surface | #F8FAFC | #13171F |
| Border | #E2E8F0 | #232830 |
| Text | #0E1116 | #EDEFF3 |
| Muted text | #526071 | #98A1B0 |
| Accent | #1D4ED8 | #6E8BFF |
| Accent soft | #EFF4FF | #131A2E |
| Accent foreground | #FFFFFF | #0B0D10 |
| Action | #1D4ED8 | #2A4FD8 |
| Action hover | #1E40AF | #1E40AF |
| Success | #15803D | #4ADE80 |
| Error | #DC2626 | #F87171 |
| Error soft | #FEF2F2 | #32191D |

Paper remains #FFFFFF with #0E1116 ink. Paper muted ink #475569, labels #64748B,
rules #E2E8F0, strong rules #CBD5E1, totals #F1F5F9, deduction ink #991B1B,
deduction background #FEF2F2. PAID stamp uses #1D4ED8.
Controls/cards/paper use 6px radii, ledger/stamp 4px, icon controls 8px, dots circular.
Controls 44px tall; Tool icon tiles 48px; content width 1280px; document width 490px.
Spacing scale: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96px.
Desktop gutters 24px, mobile 16px; paper padding 28px desktop and 16px mobile.
Borders 1px, stamp 1.5px, focus ring 2px with 4px offset. No heavy structural frames.
UI/document text uses Source Sans 3; numbers JetBrains Mono with tabular figures.
Hero 56px/1.05 desktop, 44px/1.05 mobile; section headings 28px/36px;
body 18px/28px in Hero, 14px/1.6 elsewhere; ledger text 12px; micro labels 10px.
Letter spacing zero. Weights remain consistent across interactive states.
Canvas has 24px dot texture, 1px dots, black 5% light / white 8% dark.
Document backlight is continuous radial field: accent 12% to transparent at 70%.
Paper shadow: light 0 24px 50px -12px black 15%; dark black 70%, plus
0 0 0 1px white 5%. Reference-supported header blur is 12px.
Card hover transform 150ms ease-out. Document entrance 600ms ease-out;
stamp 350ms ease-out with 250ms delay. Reduced motion disables animation/transforms.

## Content Integrity

Sample beneficiary Rajesh Kumar Verma, October 2024, vehicle DL-01-AB-4920,
IMPS / 9048-2831, ID PK-88294-DL. Items 18,500 + 4,560 + 1,240 - 2,000 = 22,300 INR.
Never animate or randomize financial values. PAID stamp is illustrative, not Tool availability.
Approved reference claims are retained by task-specific exception, not independently verified.

## Foundations

Root DESIGN_TOKENS.md derives from this authority. @repo/tailwind-config owns token CSS;
consumer colors, spacing and radii reference tokens. @repo/ui owns accessible primitives.
FieldWrapper owns label/helper/error layout. Document primitives have no form-state props.
One component tree serves both themes. First visit follows system; manual choice persists.

## Superseded Guidance

Legacy requirements for Inter, zero radius, heavy 6px frames, no gradients,
no blur or a single hard shadow do not govern this iteration. Future generator layouts,
forms and PDF behavior remain unspecified and out of scope.

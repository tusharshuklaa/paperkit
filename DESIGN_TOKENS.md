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
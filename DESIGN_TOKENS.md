# PaperKit Tokens

Derived from implemented [shared-styles.css](packages/tailwind-config/shared-styles.css), interpreted by sole [design authority](reference/paperkit/DESIGN.md). [App DESIGN](apps/web/DESIGN.md) is a derived tooling projection, not a second authority. CSS owns runtime values.

## Theme Values

Names carry `--` prefix in CSS. Dark inherits root unless overridden.

| Token | Light | Dark |
| --- | --- | --- |
| canvas | #f3f5ef | #10251e |
| surface | #ffffff | #173c30 |
| surface-alt | #dce5d6 | #254738 |
| border | #b6c8b7 | #587362 |
| text | #173c30 | #eef3e8 |
| muted | #4b6256 | #bdcdbb |
| accent | #1c513d | #d3e6bd |
| accent-soft | #dce5d6 | #254738 |
| accent-foreground | #ffffff | #10251e |
| action | #1c513d | #d3e6bd |
| action-hover | #173c30 | #e3f0d7 |
| action-foreground | #ffffff | #10251e |
| success | #15803d | #4ade80 |
| success-soft | #ecfdf5 | #10291b |
| error | #dc2626 | #f87171 |
| error-soft | #fef2f2 | #32191d |
| warning | #92400e | #fcd34d |
| warning-soft | #fffbeb | #302713 |
| landing-fuel-field | #e6dfd8 | #463f37 |
| landing-rent-field | #d8e5e9 | #29464b |
| landing-inverse | #173c30 | #dce5d6 |
| landing-on-inverse | #f3f5ef | #173c30 |
| paper-shadow | 0 18px 36px -16px rgb(23 60 48 / 24%) | 0 18px 36px -16px rgb(0 0 0 / 50%) |
| dot | rgb(0 0 0 / 5%) | rgb(255 255 255 / 8%) |
| glow | radial-gradient(circle, rgb(28 81 61 / 12%), transparent 70%) | radial-gradient(circle, rgb(211 230 189 / 12%), transparent 70%) |

Dot/glow definitions are compatibility inventory, not active landing treatments. Landing has solid fields, no dotted/gradient background. Semantic state colors support shared primitives, not product claims. Root color scheme is light; `.dark` is dark; document samples explicitly keep light scheme.

## Fixed Document Values

| Token | Both themes |
| --- | --- |
| paper | #ffffff |
| paper-ink | #222c26 |
| paper-muted | #5a625d |
| paper-label | #5a625d |
| paper-border | #dce2dc |
| paper-rule | #dce2dc |
| paper-total | #f3f5ef |
| paper-error | #991b1b |
| paper-error-soft | #fef2f2 |
| stamp-ink | #1c513d |
| transparent | transparent |
| disabled-opacity | 0.55 |

Landing samples use paper, paper-ink, paper-muted, paper-rule and paper-shadow. Other values support shared/legacy document primitives; new landing has no paid stamp.

## Spacing And Geometry

`--space-N` map (px): 0=0, 1=2, 2=4, 3=6, 4=8, 5=10, 6=12, 8=16,
10=20, 12=24, 14=28, 16=32, 20=40, 24=48, 32=64, 40=80, 48=96.

Radii (px): none=0, small=4, control=6, icon=8, full=9999.
hairline=1px; stamp-border=1.5px; focus-width=2px; focus-offset=4px.
control-height=44px; icon-tile=48px; icon-size=20px; logo-size=24px;
content-width=1280px; paper-width=490px; header-height=64px;
signature-width=112px; status-height=24px; texture-size=24px;
texture-dot=1px; blur=12px.

Landing tokens: landing-width=1536px; landing-gutter=48px;
landing-wordmark-size=176px; landing-statement-size=76px; landing-section-size=44px;
landing-stack-height=420px; landing-paper-height=390px; landing-paper-width=410px.
Shared primitives use content-width/paper-width; landing uses landing widths.
Landing documents are square; shared PaperSheet has control radius. Texture/blur geometry is compatibility inventory, not landing prescription.

## Typography

font-ui: `var(--font-manrope), 'Manrope', sans-serif`.
font-display: `var(--font-bricolage), 'Bricolage Grotesque', sans-serif`.
font-numeric: `var(--font-jetbrains), 'JetBrains Mono', monospace`.
[Layout](apps/web/app/layout.tsx) loads all three through Next fonts. No runtime Source Sans 3.
Shared numeric utility and legacy ledger use JetBrains Mono; new document samples inherit Manrope with tabular figures.

Text size tokens (px): micro=10, tiny=11, small=12, body=14, base=16,
lead=18, logo=20, number=22, section=28, hero-mobile=44, hero=56.
Leading: hero=1.05, heading=1.28, body=1.6. Letter spacing zero.
Landing body overrides to 16px/1.65; display weight 600, statement 700, section headings 500, selector 650.
Local mobile 8px/9px document text is not added to shared ramp or recommended for reuse.

## Landing Overrides

Observed in [landing styles](apps/web/components/landing.module.css), not extra root tokens:

| Condition | Overrides |
| --- | --- |
| min-width: 1440px | landing-wordmark-size: 208px |
| max-width: 1023px | landing-gutter: 32px; landing-wordmark-size: 144px; landing-statement-size: 60px |
| max-width: 639px | landing-gutter: 20px; landing-wordmark-size: 76px; landing-statement-size: 42px; landing-section-size: 32px |
| max-width: 359px | landing-wordmark-size: 68px; landing-statement-size: 36px |

Catalog becomes one column at max-width: 639px. Fixed stage height reserves selection geometry; no viewport-scaled font sizes.

## Motion

landing-front-angle=5deg; landing-rear-angle=-10deg; landing-rear-fan-angle=-14deg;
landing-paper-lift=-10px; landing-motion-duration=320ms.
ease-out=cubic-bezier(0.2, 0, 0, 1).

Fine-pointer stack hover or selector focus fans rear left and straightens/lifts front.
Catalog hover straightens/lifts compact sheet. Only paper transforms transition.
Reduced motion removes animations, transitions and paper transforms including rest rotation;
global smooth scroll becomes auto. Sample financial values stay deterministic.

Compatibility tokens: duration-fast=150ms; duration-entrance=600ms; duration-stamp=350ms;
delay-stamp=250ms; paper-start=16px; stamp-angle=-8deg;
stamp-start-scale=1.12; hover-lift=-2px. They do not replace landing motion rules.

## Tailwind Bridge

Inline aliases: color-canvas -> canvas; color-surface -> surface; color-accent -> accent;
color-ink -> text; font-sans -> font-ui; font-mono -> font-numeric.
No alternate app token source. Retained definitions do not authorize discarded visual world.

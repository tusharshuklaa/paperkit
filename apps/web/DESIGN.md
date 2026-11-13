---
{
  "name": "PaperKit",
  "description": "Finalized Paper Index world with Good on paper document stacks.",
  "colors": {
    "canvas": "#f6f5f5", "surface": "#ffffff", "surface-alt": "#e7dce5",
    "border": "#c7b7c4", "text": "#382c3a", "muted": "#645464",
    "accent": "#75496c", "paper": "#ffffff", "paper-ink": "#222c26",
    "paper-muted": "#5a625d", "paper-rule": "#dce2dc",
    "fuel-field": "#e7e0d9", "rent-field": "#dce6e5"
  },
  "typography": {
    "display": {"fontFamily": "Bricolage Grotesque, sans-serif", "fontSize": "176px", "fontWeight": 600, "lineHeight": 1.1, "letterSpacing": "0px"},
    "headline": {"fontFamily": "Bricolage Grotesque, sans-serif", "fontSize": "76px", "fontWeight": 700, "lineHeight": 0.98},
    "title": {"fontFamily": "Bricolage Grotesque, sans-serif", "fontSize": "44px", "fontWeight": 500, "lineHeight": 1.12},
    "body": {"fontFamily": "Manrope, sans-serif", "fontSize": "16px", "lineHeight": 1.65, "letterSpacing": "0px"},
    "label": {"fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": 650},
    "numeric": {"fontFamily": "JetBrains Mono, monospace"}
  },
  "rounded": {"none": "0px", "small": "4px", "control": "6px", "icon": "8px", "full": "9999px"},
  "spacing": {"4": "8px", "6": "12px", "8": "16px", "10": "20px", "12": "24px", "14": "28px", "16": "32px", "20": "40px", "24": "48px", "32": "64px", "40": "80px", "48": "96px"},
  "components": {
    "sample-selector": {"backgroundColor": "transparent", "textColor": "{colors.text}", "rounded": "{rounded.control}", "padding": "10px 12px"},
    "sample-selector-selected": {"backgroundColor": "{colors.text}", "textColor": "{colors.canvas}"},
    "document-paper": {"backgroundColor": "{colors.paper}", "textColor": "{colors.paper-ink}", "rounded": "{rounded.none}", "padding": "24px"}
  }
}
---

# Design System: PaperKit

## Overview

**Creative North Star: "Paper Index"**

PaperKit is an open, editorial index of everyday paperwork. Plum fields and stone neutrals frame actual semantic HTML documents; monumental brand typography provides identity without decorative imagery. Document sheets supply visual media, not raster assets.

This document records the approved design direction for the shared PaperKit ecosystem. Default-light values derive from [shared CSS](../../packages/tailwind-config/shared-styles.css), the runtime source of truth. [Token inventory](../../DESIGN_TOKENS.md) records dark overrides and compatibility values. [Sidecar](.impeccable/design.json) extends frontmatter with motion, shadows, breakpoints and source-backed previews.

**Key Characteristics:**
- Plum fields, stone canvas and deep plum ink.
- Monumental Bricolage Grotesque paired with Manrope.
- White semantic document sheets as visual media.
- Restrained fan-and-lift motion with stable selection geometry.

## Colors

### Primary

Plum ink and accent on a pale stone canvas and soft plum alternate surface. Dark mode uses deep plum surfaces and light plum accents; it is not a mechanical inversion. Muted warm fuel and cool rent fields distinguish illustrations, not action colors. Green is reserved for semantic success, not brand styling. Use shared semantic tokens across the landing and tool apps; default-light frontmatter is not a fixed shell palette.

### Neutral

White paper and fixed dark/muted paper inks survive theme changes.

**The Fixed Paper Rule.** Shell themes change; document paper and its inks remain fixed with a light color scheme.

**The Quiet Field Rule.** Landing fields stay solid. Do not revive blue legacy styling, dotted texture or gradient backlights on this surface. Compatibility definitions are not evidence of active use.

## Typography

Manrope body, Bricolage Grotesque display, JetBrains Mono shared numeric compatibility; all loaded in [layout](app/layout.tsx). Landing paper uses Manrope tabular figures, not a mono override. Frontmatter sizes are base desktop roles; responsive wordmark (208/144/76/68px), statement (60/42/36px), and local section sizes follow [landing styles](components/landing.module.css). Shared body remains (14px / 1.6), landing body (16px / 1.65). Source Sans 3 is not loaded.

**The Stable Type Rule.** Letter spacing stays zero; interactive state changes do not change font weight. Breakpoint steps, not viewport-scaled font sizes, control display type.

## Layout

Open bands, max-width (1536px), gutters (48/32/20px). Desktop statement and stack form two columns; mobile becomes one. Stack reserves (420px), sheets (390px) high, caption minimum (44px). Catalog is three columns then one at max-width (639px). Selectors reserve hidden checkmark space; selection does not resize stage. Cropped compact paper belongs inside catalog art windows, not a page-frame pattern.

## Elevation & Depth

Soft paper shadow, overlapping sheets and rotation carry depth; structural sections are unframed. Sidecar records exact light/dark shadows without duplicating frontmatter primitives.

**The Paper Motion Rule.** At rest front sheet rotates (5deg), rear (-10deg). Fine-pointer stack hover or sample-selector focus lifts front (-10px) to (0deg), fans rear left (-10px) to (-14deg). Only transforms transition, over (320ms) with cubic-bezier(0.2, 0, 0, 1). Catalog hover straightens and lifts its paper. Reduced motion removes transitions, animations and paper transforms, including resting rotation.

## Shapes

Landing documents and art fields are square. Selector/shared controls use control radius; shared PaperSheet remains rounded (6px), unlike landing DocumentSample. Thin document rules and restrained control borders; no hard offset shadows or heavy page frames.

## Components

- Navigation: Layers mark, Tools/About links, icon theme control; (44px) targets, underline hover and current-color focus outline.
- Selector: icon-and-text aria-pressed buttons, selected text/canvas inversion, reserved checkmark, polite atomic caption. Tablet/mobile controls become vertical. Not a tab interface.
- Stack: two semantic documents; rear aria-hidden, front available to assistive technology. Salary default; rear rent for salary, salary otherwise. Fixed deterministic INR amounts and illustrative disclosures.
- Catalog: registry drives names, formats, order, hrefs and status through explicit presentation mapping. Coming Soon remains noninteractive text; only live Tools get links. Art is aria-hidden to avoid duplicate narration.
- Shared controls: primary/secondary/outline buttons, input, badges and bordered ToolCard exist in UI package; previews document availability, not a landing form. Minimum control height (44px), focus width/offset (2px/4px), disabled opacity (0.55), invalid input error border.
- FAQ: native details/summary; chevron rotates when open, except reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep white paper and fixed document inks across themes.
- **Do** preserve semantic document markup, deterministic amounts and illustrative disclosure.
- **Do** reserve stack, selection and caption geometry across states.
- **Do** derive Tool availability and navigation from registry.
- **Do** provide keyboard focus and remove paper transforms for reduced motion.

### Don't:
- **Don't** revive blue shell styling, dotted or gradient landing backgrounds, or runtime Source Sans 3.
- **Don't** substitute raster mockups for implemented document HTML.
- **Don't** imply samples generate documents or prove payment.
- **Don't** promote discarded prototypes or compatibility-only effects into production rules.

Not canonized or repaired: mobile sample reference (8px), table (9px) and microcopy (10px) remain legibility concerns. Dormant glow/texture/stamp CSS is compatibility drift, not production style. Sidecar omits synthesized tonal ramps: no implemented ramp exists, and documentation must not invent tokens. Documentation checks do not replace rendered accessibility verification.

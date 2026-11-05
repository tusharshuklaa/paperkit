---
{
  "name": "PaperKit",
  "description": "Finalized Paper Index world with Good on paper document stacks.",
  "colors": {
    "canvas": "#f3f5ef", "surface": "#ffffff", "surface-alt": "#dce5d6",
    "border": "#b6c8b7", "text": "#173c30", "muted": "#4b6256",
    "accent": "#1c513d", "paper": "#ffffff", "paper-ink": "#222c26",
    "paper-muted": "#5a625d", "paper-rule": "#dce2dc",
    "fuel-field": "#e6dfd8", "rent-field": "#d8e5e9"
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

PaperKit is an open, editorial index of everyday paperwork. Pale green fields and forest ink frame actual semantic HTML documents; monumental brand typography provides identity without decorative imagery. Document sheets supply visual media, not raster assets.

User approved final Paper Index A + B Good on paper combination, including stacked papers and hover motion. This file replaces provisional blue shell guidance and is sole visual authority. [App DESIGN](../../apps/web/DESIGN.md) is a derived token-bearing tooling view; [token inventory](../../DESIGN_TOKENS.md) records implemented CSS, including compatibility tokens. Neither creates a separate authority. Prototype directions are discarded, not alternate production options.

**Key Characteristics:**
- Pale green fields with forest ink.
- Monumental Bricolage Grotesque paired with Manrope.
- White semantic document sheets as visual media.
- Restrained fan-and-lift motion with stable selection geometry.

Evidence: [page](../../apps/web/app/page.tsx), [landing styles](../../apps/web/components/landing.module.css), [document styles](../../apps/web/components/document-sample.module.css), [shared tokens](../../packages/tailwind-config/shared-styles.css), and [font loading](../../apps/web/app/layout.tsx). Values describe source, not a new theme specification.

## Colors

### Primary

Forest text and accent provide brand ink, links, focus and selected controls. Pale canvas and green alternate surface create large quiet fields. Fuel and rent illustrations add distinct muted warm and cool fields; these are document-category backgrounds, not action colors.

### Neutral

Paper uses fixed white, document ink, muted ink and light rules independently of shell theme. Dark shell overrides live in shared CSS: canvas (#10251e), text (#eef3e8), alternate surface (#254738), accent (#d3e6bd); inventory records every override. Frontmatter represents default light appearance, not theme-invariant shell colors.

**The Fixed Paper Rule.** Shell themes change; document paper and its inks remain fixed with a light color scheme.

**The Quiet Field Rule.** Landing fields stay solid. Do not revive blue legacy styling, dotted texture or gradient backlights on this surface. Compatibility definitions are not evidence of active use.

## Typography

**Display Font:** Bricolage Grotesque, sans-serif fallback.
**Body Font:** Manrope, sans-serif fallback.
**Label/Mono Font:** Manrope labels; JetBrains Mono remains shared numeric compatibility.

Next loads all three families. Production landing document amounts inherit Manrope with tabular figures; they do not select numeric font. Source Sans 3 is not loaded by production layout.

### Hierarchy

- Display frontmatter records base desktop wordmark; responsive sizes are (208px) at min-width (1440px), (144px) at max-width (1023px), (76px) at max-width (639px), and (68px) below (360px).
- Headline records Good on paper statement; smaller widths use (60px), (42px), then (36px) at corresponding max-width breakpoints.
- Title records base section heading. Mobile sections use (32px); About and FAQ have local sizes, not a second global ramp.
- Body records landing copy; global shared body remains (14px / 1.6). Intro uses (18px / 1.5), then (16px) on mobile.
- Label records sample controls and metadata. No uppercase eyebrow system is established.

**The Stable Type Rule.** Letter spacing stays zero; interactive state changes do not change font weight. Breakpoint steps, not viewport-scaled font sizes, control display type.

## Layout

Open bands, not floating page cards. Landing content max-width is (1536px); gutters step from (48px) to (32px) at max-width (1023px) and (20px) at max-width (639px). Shared container width (1280px) remains available but does not govern landing.

Good on paper pairs statement and stack in (1fr / 1.1fr) columns, then one column on mobile. Stack reserves (420px) height and max-width (550px), reduced to (400px) mobile; sheets use fixed (390px) height in showcase and max-width (410px). Front/rear widths are (82% / 68%), then (83% / 72%) mobile. Selection replaces content without resizing stage. Caption reserves (44px).

Catalog uses three equal columns, then one at max-width (639px). Art windows intentionally crop compact sheets with overflow hidden. About and FAQ use split grids, then one column on mobile. Spacing follows shared scale; local illustration dimensions are not universal layout tokens.

## Elevation & Depth

Depth belongs to overlapping paper, not structural page frames. Shared paper shadow is (0 18px 36px -16px rgb(23 60 48 / 24%)); dark shell uses (0 18px 36px -16px rgb(0 0 0 / 50%)). This is soft paper elevation, not a hard offset shadow.

**The Paper Motion Rule.** At rest front sheet rotates (5deg), rear (-10deg). Fine-pointer stack hover or sample-selector focus lifts front (-10px) to (0deg), fans rear left (-10px) to (-14deg). Only transforms transition, over (320ms) with cubic-bezier(0.2, 0, 0, 1). Catalog hover straightens and lifts its paper. Reduced motion removes transitions, animations and paper transforms, including resting rotation.

## Shapes

Landing paper and art fields are square. Selection controls use control radius; shared primitives retain small, control and icon radii. Shared PaperSheet remains rounded (6px): do not confuse it with square landing DocumentSample. Circular radius is available for genuinely circular shapes, not a default pill treatment. Hairline rules delineate document rows; no heavy page frames.

## Components

### Navigation

Layers icon plus PaperKit wordmark, Tools/About anchors and icon theme control. Header/footer links reserve (44px) targets. Hover underlines; keyboard focus uses current-color outline (2px), offset (4px). Footer repeats brand at local display size.

### Sample Selector

Icon-and-text buttons expose aria-pressed, not tabs. Selected fill uses text ink and canvas foreground; checkmark space remains reserved via visibility. Hover underlines. Controls turn vertical at tablet width and remain vertical beside mobile statement. Polite atomic caption announces selected Tool name and illustrative status.

### Document Stack

Two real articles containing headings, definition lists and amount tables. Rear is hidden from assistive technology; front stays readable in DOM. Salary starts selected; rear is rent for salary, salary otherwise. Selection list derives from registry entries via explicit presentation mappings, not arbitrary document discovery. Fixed amounts are illustrative: salary (22300 INR), fuel (3000 INR), rent (20000 INR). No invented proof-of-payment stamp.

### Catalog

Registry owns ordering, names, formats, hrefs and availability. Each unframed item has a colored document-art field, name, description and metadata. Coming Soon is plain status text, not an enabled action. Only live registry entries get Open tool links. Catalog art is aria-hidden to avoid duplicate document narration.

### Shared Controls

Existing primary, secondary and outline buttons, fields, badges and bordered ToolCard remain in UI package. Controls use minimum (44px) height, padding (8px 16px), control radius and hairline border. Primary uses action/foreground and action-hover; secondary uses accent-soft/accent; outline is transparent/current-color. Focus uses accent outline; disabled opacity is (0.55). Inputs expose aria-invalid and error border. These primitives are available, not evidence that landing ships a form or bordered catalog cards.

### FAQ

Native details/summary disclosure, (44px) summary target, chevron rotation when open; reduced motion removes rotation. Answers and registry status remain factual, not sales proof.

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

Not canonized or repaired: mobile sample reference (8px), table (9px) and microcopy (10px) are a legibility concern, not a reusable typography recommendation. Dormant glow, texture and stamp CSS remains implementation drift; code cleanup belongs to implementation owner. Source inspection does not establish a rendered accessibility audit.

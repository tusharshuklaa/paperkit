---
name: PaperKit
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005022'
  on-tertiary: '#ffffff'
  tertiary-container: '#006b2f'
  on-tertiary-container: '#88ea9a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-numeric-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.02em
  label-numeric-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-numeric-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-tag:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies institutional utility, quiet confidence, and rapid operational reliability. Designed for generating critical transactional and legal paperwork across India—such as salary slips, driver disbursements, rent vouchers, and fuel receipts—the interface rejects decorative consumer flourishes in favor of structural clarity and bureaucratic speed.

The design movement mixes **High-Density Minimalism** with **Constructivist / Architectural Utility**:
- **Canvas Aesthetic:** Crisp off-white surfaces transitioning to technical slate in dark mode, referencing archival paper weights and engineering ledgers.
- **Graphic Mechanics:** Precision 1px hairlines paired with structural 6px outer frame borders on key layout panels and preview stages to ground documents firmly in digital space.
- **Tone:** Authoritative, unadorned, unhurried, and precise. Interactions feel immediate and deterministic, evoking the trust of official treasury and ledger software.

## Colors

The palette balances administrative neutrality with a resolute cobalt blue accent. Color is used strictly for information hierarchy, semantic validation, and primary state execution.

### Palette Architecture
- **Primary (Cobalt Accent):** `#1D4ED8` (Light) / `#6E8BFF` (Dark). Used for primary triggers, active selection frames, interactive focuses, and verified watermarks.
- **Secondary (Deep Ink):** `#0F172A` (Light) / `#F8FAFC` (Dark). The primary reading ink, structural layout rules, and heavy 6px structural outer container rails.
- **Tertiary (Ledger Green):** `#15803D` (Light) / `#4ADE80` (Dark). Semantic indicators for "Paid", "Verified", and completed balance balances.
- **Neutral (Slate & Parchment):**
  - Light mode surfaces: Canvas `#F8FAFC`, Paper `#FFFFFF`, Slate Border `#E2E8F0`, Deep Hairline `#CBD5E1`.
  - Dark mode surfaces: Canvas `#090D16`, Paper `#0F172A`, Slate Border `#1E293B`, Deep Hairline `#334155`.
- **Alert / Stamp Red:** `#DC2626` (Light) / `#F87171` (Dark) for "Cancelled", overdue notifications, or critical mismatch stamps.

### Surface System
- Primary paper primitives use an untextured 100% white surface against the `#F8FAFC` desk surface in light mode to mimic high-grade 100 GSM legal bond paper.

## Typography

Typography prioritizes tabular alignment, rigorous scanning speeds, and uncompromised legibility across both compact inputs and full-page previews.

- **Primary UI & Document Body:** **Inter** handles narrative structure, labels, titles, and legal disclaimers. Its balanced grotesque rhythm enforces clarity under tight vertical packing.
- **Monospace Numbers & Tabular Currency:** **JetBrains Mono** is deployed for all numerical data, currency values (₹ INR), tax deduction breakups, serial dates, and receipt counters to preserve column vertical integrity without drift.
- **Case Styles:** Uppercase is reserved for `label-tag` elements, status pills, and institutional document stamps. All numerical figures use proportional and tabular lining variants.

## Layout & Spacing

The workspace uses a split-screen or dual-pane architecture designed around high-density parameter entry and concurrent print-accurate previewing.

- **Desk / Stage Structure:**
  - **Left / Primary Panel (Form Engine):** A constrained, dense 480px to 560px parameter rail that scrolls independently.
  - **Right / Secondary Panel (Preview Desk):** A flexible viewport hosting 1:1 scale digital paper primitives (A4, Slip, Cash Memo).
- **Grid Principles:**
  - Forms use a strict 4-column sub-grid inside the form panel with tight `space-sm` gaps, allowing high-density inline layouts (e.g., PAN, IFSC, Amount, and Tax deduction inputs side by side).
- **Adaptation Strategy:**
  - **Desktop (>= 1024px):** Dual-pane form and live-rendered document canvas side by side.
  - **Mobile (< 1024px):** Single-pane stacked flow with sticky bottom action controls and a segmented toggle between "Edit Form" and "Inspect Receipt." Outer margins compress to `margin: 1rem`.

## Elevation & Depth

This design system explicitly rejects float, blur, and modern diffuse ambient lighting. It relies entirely on **Tonal Layers**, **1px Technical Hairlines**, and **Crisp Hard Edges**.

- **Level 0 (Desk Canvas):** The neutral drafting ground (`#F8FAFC` light / `#090D16` dark).
- **Level 1 (Form Sheets & Control Rails):** Grounded directly on the canvas with a `1px solid #CBD5E1` boundary. No box shadows.
- **Level 2 (Paper Primitive):** White sheet `#FFFFFF` floating over the desk surface using a single, structural contrast edge: a crisp `0 1px 3px rgba(0, 0, 0, 0.1)` edge coupled with a solid `1px solid #94A3B8` perimeter to simulate cut paper stock.
- **Structural Frame Borders (6px):** The outer boundary of the canvas inspector and major viewport dividers use a bold `6px solid #0F172A` (or `#1E293B` in dark mode) to establish definitive architectural framing.
- **Modal Panels & Dropdowns:** Flat, clean rectangles defined by `1px solid #0F172A` with a hard, unblurred `2px 2px 0px rgba(15, 23, 42, 0.15)` offset shadow.

## Shapes

The design system is strictly **Sharp (`roundedness: 0`)**. All interface elements, bounding containers, form fields, and status indicators have zero corner radius (`0px`). 

This reinforces precision tooling, physical ledger card stocks, perforation lines, and legal documentation. It distinguishes the tool completely from consumer fintech SaaS and gives it an authoritative, infrastructural tone.

## Components

### Buttons
- **Primary:** Background `#1D4ED8`, text `#FFFFFF`, border `1px solid #1D4ED8`, sharp edges, bold weight, height `36px`, padded with `space-lg`. Hover changes background to `#1E40AF`.
- **Secondary / Utility:** Background transparent, text `#0F172A`, border `1px solid #CBD5E1`. Hover changes background to `#F1F5F9`.
- **Danger:** Background transparent, text `#DC2626`, border `1px solid #DC2626`.

### Dense Input Fields & Selects
- Height `32px` for standard inputs, `28px` for compact tabular rows.
- Sharp `0px` radius, background `#FFFFFF`, border `1px solid #CBD5E1`.
- Focus state: `1px solid #1D4ED8` with a continuous `1px` outline inset in `#1D4ED8`.
- Labels are positioned strictly above or left-stacked in `11px` `Inter` uppercase, muted slate color `#64748B`.
- Integrated INR (`₹`) prefix locked into JetBrains Mono.

### Document Preview Paper Primitives
- Background `#FFFFFF` (retains white regardless of dark mode to preserve document reality), text `#0F172A`, surrounded by a deliberate `1px solid #CBD5E1` paper boundary.
- Renders simulated print margins, mechanical dashed divider rules (`border-style: dashed`), and tabular ledger alignments.

### Status Stamps
- Border `2px solid`, uppercase tracking `0.1em`, rotated `-6deg` to simulate hand-stamped verification.
- **PAID / VERIFIED:** Color `#15803D` with matching border.
- **VOID / REJECTED:** Color `#DC2626` with matching border.
- **DRAFT:** Color `#64748B` with matching dashed border.

### Checkboxes & Radio Controls
- Sharp square boxes (`14px` by `14px`), border `1.5px solid #0F172A`, background transparent.
- Checked state: fully filled `#1D4ED8` with an inverted white checkmark or inner square.

### Data Grid / Itemizer Table
- Hairline dividers `1px solid #E2E8F0`. Header row styled in `#F8FAFC` background with all-caps micro-labels.
- All totals, deductions, net amounts, and HRA computations aligned strictly to the right using `JetBrains Mono`.
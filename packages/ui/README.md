# Shared UI

Server-compatible React primitives. No client boundary, hooks, tracking, generator logic, or dependency additions. Client consumers can pass native handlers. Existing `@repo/ui/button` remains compatible.

Import CSS once from `@repo/ui/styles.css`; it includes `@repo/tailwind-config` tokens. Public component exports use existing `dist` convention. Run package build before consuming changed components; Next.js can transpile `@repo/ui` as before. Each component also exports its matching `NameProps` type.

```tsx
import { Badge } from '@repo/ui/Badge';
import { Button } from '@repo/ui/Button';
import { DocumentHeader } from '@repo/ui/DocumentHeader';
import { FieldWrapper } from '@repo/ui/FieldWrapper';
import { Input } from '@repo/ui/Input';
import { PaperSheet } from '@repo/ui/PaperSheet';
import { RevenueStamp } from '@repo/ui/RevenueStamp';
import { SignatureBlock } from '@repo/ui/SignatureBlock';
import { Stamp } from '@repo/ui/Stamp';
import { ToolCard } from '@repo/ui/ToolCard';
```

## Props

All primitives accept native attributes for their element, `className`, and children unless noted. Consumer classes append to defaults. Document primitives have no form-state props.

| Component | Element | Additional props |
| --- | --- | --- |
| Button | button | `variant?: 'primary' \| 'secondary' \| 'outline'` (primary). Native `type` behavior preserved; pass `type="button"` for non-submit commands. |
| Badge | span | `variant?: 'neutral' \| 'accent' \| 'success' \| 'warning' \| 'error'` (neutral). |
| Input | input | All native input props including React 19 `ref`; `error?: boolean` sets `aria-invalid`. Requires accessible label from FieldWrapper or native labeling attributes. |
| FieldWrapper | div | Required `id`, `label: ReactNode`, single input `children: ReactElement<InputHTMLAttributes<HTMLInputElement>>`; optional `helper`, `error` (ReactNode). `id` belongs to input, not wrapper. |
| ToolCard | article | Required `name`, `description`, `category`, `format` (strings), `icon: ReactNode`; `status: 'live'` requires `href: string`; `status: 'coming-soon'` forbids `href`. No children. |
| PaperSheet | article | Native HTML attributes; name sample documents with `aria-label`. |
| DocumentHeader | header | Required `title: string`; optional `subtitle`, `reference` (ReactNode), children. Title renders h2. |
| SignatureBlock | div | Required `label: ReactNode`; optional `name: ReactNode`; children fill reserved signature area. |
| RevenueStamp | div | Children default to `Revenue Stamp`; visual placeholder, not a fiscal/legal stamp. |
| Stamp | span | Children supply text, e.g. `PAID`; no implied availability or live status. |

FieldWrapper sets child's ID, links label, merges existing `aria-describedby` with present helper/error IDs (`${id}-helper`, `${id}-error`), and sets `aria-invalid` on error. Use unique, stable IDs. Error slot remains mounted with reserved height and polite announcements. Input forwards these attributes without client JS. Helper/error belong only on form primitives.

```tsx
<FieldWrapper id="employee" label="Employee" helper="Full legal name" error={error}>
  <Input name="employee" autoComplete="name" required />
</FieldWrapper>

<ToolCard
  name={tool.name}
  description={tool.description}
  category={categoryLabel}
  format={tool.format}
  icon={<ToolIcon aria-hidden="true" />}
  status="coming-soon"
/>
```

ToolCard's icon is decorative; name is h3, live name is anchor. Coming Soon renders no link or interactive affordance. Runtime rejects missing/blank live destinations and any Coming Soon destination. Consumers remain responsible for verifying live destinations. Native attributes should not add interactive handlers or focusability to unavailable cards.

## Classes

| Component | Root and descendants |
| --- | --- |
| Button | `.pk-button`, `.pk-button--primary`, `.pk-button--secondary`, `.pk-button--outline` |
| Badge | `.pk-badge`, `.pk-badge--neutral`, `.pk-badge--accent`, `.pk-badge--success`, `.pk-badge--warning`, `.pk-badge--error` |
| Input | `.pk-input`; error selector `[aria-invalid="true"]` |
| FieldWrapper | `.pk-field`, `.pk-field__label`, `.pk-field__messages`, `.pk-field__helper`, `.pk-field__error` |
| ToolCard | `.pk-tool-card`, `.pk-tool-card--live`, `.pk-tool-card--coming-soon`, `__top`, `__icon`, `__name`, `__link`, `__description`, `__meta` (all prefixed `pk-tool-card`) |
| PaperSheet | `.pk-paper-sheet` |
| DocumentHeader | `.pk-document-header`, `__heading`, `__title`, `__subtitle`, `__reference` (all prefixed `pk-document-header`) |
| SignatureBlock | `.pk-signature-block`, `__signature`, `__name`, `__label` (all prefixed `pk-signature-block`) |
| RevenueStamp | `.pk-revenue-stamp` |
| Stamp | `.pk-stamp` |

Colors, spacing, radii, dimensions and fonts come from shared tokens. Shell owns outer layout, entrance animation and illustration composition. Paper stays light in both themes; padding adapts below 40rem. Stamp rotation is removed for reduced motion. Error space and control geometry remain stable. No raw hex or pixel values live in UI CSS.

## Checks

From repository root, no install required:

```sh
rtk proxy bun run --cwd packages/ui build
rtk proxy bun run --cwd packages/ui check-types
rtk proxy bun run --cwd packages/ui check:consumer
rtk proxy bun run --cwd packages/ui test
```

Consumer checks require package build first because public exports resolve to dist. Tests use existing Bun and workspace React DOM for static HTML checks; no added test dependencies. Type consumer covers all public components and rejects invalid availability combinations. Runtime checks cover public exports, native props, label/helper/error associations, availability navigation and document content. Browser appearance/interaction verification belongs to consuming shell acceptance checks.
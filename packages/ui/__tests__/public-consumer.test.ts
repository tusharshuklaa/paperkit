import { describe, expect, test } from 'bun:test';
import { createRequire } from 'node:module';
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
import { Button as LegacyButton } from '@repo/ui/button';
import { createElement } from 'react';

const requireFromApp = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { renderToStaticMarkup } = requireFromApp('react-dom/server');

const tool = {
  name: 'Example Tool',
  description: 'Synthetic public consumer fixture.',
  category: 'Example',
  format: 'PDF',
  icon: createElement('span', null, 'Example icon'),
};

describe('published UI consumer contract', () => {
  test('preserves canonical and legacy native Button props', () => {
    expect(LegacyButton).toBe(Button);
    for (const variant of ['primary', 'secondary', 'outline']) {
      const html = renderToStaticMarkup(
        createElement(
          Button,
          {
            variant,
            type: 'submit',
            name: 'action',
            value: 'save',
            disabled: true,
          },
          'Save',
        ),
      );
      expect(html).toContain('type="submit"');
      expect(html).toContain('name="action"');
      expect(html).toContain('value="save"');
      expect(html).toContain('disabled=""');
      expect(html).toContain('Save</button>');
    }
  });

  test('associates labels, helper and errors while preserving native input props', () => {
    const html = renderToStaticMarkup(
      createElement(
        FieldWrapper,
        {
          id: 'employee',
          label: 'Employee',
          helper: 'Full name',
          error: 'Enter a name',
        },
        createElement(Input, {
          name: 'employee',
          required: true,
          'aria-describedby': 'external',
        }),
      ),
    );
    expect(html).toContain('for="employee"');
    expect(html).toContain('id="employee"');
    expect(html).toContain('name="employee"');
    expect(html).toContain('required=""');
    expect(html).toContain('aria-describedby="external employee-helper employee-error"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('id="employee-helper">Full name');
    expect(html).toContain('id="employee-error">Enter a name');
    expect(html).toContain('aria-live="polite"');
  });

  test('does not describe absent helper/error content', () => {
    const html = renderToStaticMarkup(
      createElement(FieldWrapper, { id: 'employee', label: 'Employee' }, createElement(Input)),
    );
    expect(html).not.toContain('aria-describedby=');
    expect(html).not.toContain('aria-invalid=');
  });

  test('supports standalone invalid input semantics', () => {
    const html = renderToStaticMarkup(
      createElement(Input, { error: true, 'aria-label': 'Employee' }),
    );
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-label="Employee"');
  });

  test('renders unavailable tools as articles without navigation', () => {
    const html = renderToStaticMarkup(createElement(ToolCard, { ...tool, status: 'coming-soon' }));
    expect(html).toStartWith('<article');
    expect(html).toContain('<h3');
    expect(html).toContain('Coming Soon');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('href=');
    expect(html).not.toContain('tabindex=');
  });

  test('gives live links an accessible name and supplied destination', () => {
    const html = renderToStaticMarkup(
      createElement(ToolCard, {
        ...tool,
        status: 'live',
        href: '/verified-example',
      }),
    );
    expect(html).toContain('href="/verified-example"');
    expect(html).toContain('>Example Tool</a>');
    expect(html).toContain('>Live</span>');
  });

  test('rejects invalid availability at runtime for untyped consumers', () => {
    expect(() =>
      renderToStaticMarkup(createElement(ToolCard, { ...tool, status: 'live' })),
    ).toThrow();
    expect(() =>
      renderToStaticMarkup(createElement(ToolCard, { ...tool, status: 'live', href: ' ' })),
    ).toThrow();
    expect(() =>
      renderToStaticMarkup(
        createElement(ToolCard, {
          ...tool,
          status: 'coming-soon',
          href: '/example',
        }),
      ),
    ).toThrow();
  });

  test('renders every document primitive and Badge from public imports', () => {
    const html = renderToStaticMarkup(
      createElement(
        PaperSheet,
        { 'aria-label': 'Sample document' },
        createElement(DocumentHeader, {
          title: 'Sample',
          subtitle: 'October',
          reference: 'TEST-1',
        }),
        createElement(SignatureBlock, { label: 'Signature', name: 'Example' }, 'Signed'),
        createElement(RevenueStamp),
        createElement(Stamp, null, 'PAID'),
        createElement(Badge, { variant: 'accent' }, 'PDF'),
      ),
    );
    for (const content of [
      'Sample document',
      'Sample',
      'October',
      'TEST-1',
      'Signature',
      'Example',
      'Signed',
      'Revenue Stamp',
      'PAID',
      'PDF',
    ]) {
      expect(html).toContain(content);
    }
    expect(html).toContain('<header');
    expect(html).toContain('<h2');
  });
});

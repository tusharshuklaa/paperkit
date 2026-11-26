import { describe, expect, it } from 'bun:test';
import currencies from '../lib/driver-salary-slip/currencies.json';
import fixture from './fixtures/source-parity.json';

describe('source parity fixture', () => {
  it('pins source revision, defaults, and the full currency list', () => {
    expect(fixture.sourceRevision).toBe('85412e6');
    expect(currencies).toHaveLength(fixture.currency.count);
    expect(currencies[fixture.currency.default.index]).toEqual({
      text: fixture.currency.default.text,
      value: fixture.currency.default.value,
    });
    expect(fixture.defaults.template).toBe('1');
    expect(fixture.defaults.salaryAmount).toBe(0);
  });

  it('preserves distinct currency choices when symbols repeat', () => {
    const dollarEntries = currencies.filter(({ value }) => value === '$');

    expect(dollarEntries.length).toBeGreaterThan(1);
    expect(new Set(currencies.map(({ text }) => text)).size).toBe(currencies.length);
  });

  it('records all three source receipt structures and their key sections', () => {
    expect(fixture.templates.map(({ id }) => id)).toEqual(['1', '2', '3']);
    expect(fixture.templates[0]?.sections).toContain('Receipt Acknowledgement');
    expect(fixture.templates[1]?.sections).toContain('Receipt Acknowledgement');
    expect(fixture.templates[2]?.sections).toEqual(['single certification and declaration']);
  });
});

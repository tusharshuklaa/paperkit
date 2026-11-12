import { describe, expect, it } from 'bun:test';
import { createDefaultValues } from '../lib/driver-salary-slip/create-default-values';
import { currencyOptions } from '../lib/driver-salary-slip/currency-options';
import { formSchema } from '../lib/driver-salary-slip/form-schema';
import fixture from './fixtures/source-parity.json';

const validValues = () => ({
  ...createDefaultValues(new Date(2026, 10, 10)),
  ...fixture.syntheticReceipt,
  paymentDate: new Date(2026, 10, 10),
  currencyId: `currency-${fixture.syntheticReceipt.currencyIndex}`,
  declaration: fixture.declaration,
  stampEnabled: true,
  uploadedSignature: '',
  signatureOffsetX: 0,
  signatureOffsetY: 0,
  signatureRotation: 0,
  signatureScale: 1,
});

describe('salary slip form schema', () => {
  it('creates source-compatible fresh defaults using the supplied current date', () => {
    const defaults = createDefaultValues(new Date(2026, 10, 10));

    expect(defaults).toMatchObject({
      template: fixture.defaults.template,
      driverSalutation: fixture.defaults.driverSalutation,
      payerSalutation: fixture.defaults.payerSalutation,
      currencyId: `currency-${fixture.defaults.currencyIndex}`,
      salaryAmount: 0,
      salaryMonth: 'November',
      declaration: fixture.declaration,
      stampEnabled: true,
      signatureScale: 1,
    });
    expect(defaults.paymentDate).toEqual(new Date(2026, 10, 10));
  });

  it('accepts zero and decimal amounts with dates from 1900 through future dates', () => {
    expect(formSchema.safeParse({ ...validValues(), salaryAmount: 0 }).success).toBe(true);
    expect(formSchema.safeParse({ ...validValues(), salaryAmount: 12500.5 }).success).toBe(true);
    expect(formSchema.safeParse({ ...validValues(), salaryAmount: '12500.5' }).success).toBe(true);
    expect(
      formSchema.safeParse({ ...validValues(), paymentDate: new Date(1900, 0, 1) }).success,
    ).toBe(true);
    expect(
      formSchema.safeParse({ ...validValues(), paymentDate: new Date(2099, 0, 1) }).success,
    ).toBe(true);
    expect(formSchema.safeParse({ ...validValues(), declaration: '' }).success).toBe(true);
  });

  it('rejects invalid amounts, unsupported currencies, and pre-1900 dates', () => {
    for (const salaryAmount of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(formSchema.safeParse({ ...validValues(), salaryAmount }).success).toBe(false);
    }
    expect(formSchema.safeParse({ ...validValues(), salaryAmount: undefined }).success).toBe(false);
    expect(formSchema.safeParse({ ...validValues(), salaryAmount: '' }).success).toBe(false);
    expect(formSchema.safeParse({ ...validValues(), currencyId: '₹' }).success).toBe(false);
    expect(
      formSchema.safeParse({ ...validValues(), paymentDate: new Date(1899, 11, 31) }).success,
    ).toBe(false);
  });

  it('keeps every currency choice distinct and enforces signature transform boundaries', () => {
    expect(currencyOptions).toHaveLength(165);
    expect(new Set(currencyOptions.map(({ id }) => id)).size).toBe(165);
    expect(currencyOptions.filter(({ symbol }) => symbol === '$').length).toBeGreaterThan(1);
    expect(
      formSchema.safeParse({
        ...validValues(),
        signatureOffsetX: -100,
        signatureRotation: -45,
        signatureScale: 0.5,
      }).success,
    ).toBe(true);
    expect(
      formSchema.safeParse({ ...validValues(), signatureOffsetX: '25', signatureScale: '1.25' })
        .success,
    ).toBe(true);
    expect(formSchema.safeParse({ ...validValues(), signatureOffsetY: 101 }).success).toBe(false);
    expect(formSchema.safeParse({ ...validValues(), signatureScale: 0.53 }).success).toBe(false);
  });

  it('requires names and vehicle details only when validated for printing', () => {
    expect(formSchema.safeParse({ ...validValues(), driverName: '' }).success).toBe(false);
    expect(formSchema.safeParse({ ...validValues(), payerName: ' ' }).success).toBe(false);
    expect(formSchema.safeParse({ ...validValues(), vehicleNumber: '' }).success).toBe(false);
  });
});

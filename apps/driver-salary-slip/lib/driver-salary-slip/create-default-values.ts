import { currencyOptions } from './currency-options';
import { DEFAULT_DECLARATION } from './default-declaration';
import type { FormValues } from './form-schema';

export function createDefaultValues(now: Date = new Date()): FormValues {
  return {
    template: '1',
    driverSalutation: 'Mr.',
    driverName: '',
    payerSalutation: 'Mr.',
    payerName: '',
    vehicleNumber: '',
    paymentDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    currencyId:
      currencyOptions.find(({ label }) => label === 'Indian Rupee - ₹')?.id ?? 'currency-68',
    salaryAmount: 0,
    salaryMonth: new Intl.DateTimeFormat('en', { month: 'long' }).format(
      now,
    ) as FormValues['salaryMonth'],
    declaration: DEFAULT_DECLARATION,
    stampEnabled: true,
    uploadedSignature: '',
    signatureOffsetX: 0,
    signatureOffsetY: 0,
    signatureRotation: 0,
    signatureScale: 1,
  };
}

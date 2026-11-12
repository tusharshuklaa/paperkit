import { currencyOptions } from './currency-options';
import type { FormValues } from './form-schema';

export function receiptDataFromForm(values: FormValues, signatureImage: string): ReceiptData {
  const currency = currencyOptions.find(({ id }) => id === values.currencyId);
  const paymentDate = Number.isFinite(values.paymentDate.getTime())
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(values.paymentDate)
    : '';

  return {
    ...values,
    currencySymbol: currency?.symbol ?? '',
    paymentDateLabel: paymentDate,
    salaryAmountLabel: Number.isFinite(values.salaryAmount) ? String(values.salaryAmount) : '',
    signatureImage,
  };
}

export type ReceiptData = FormValues & {
  currencySymbol: string;
  paymentDateLabel: string;
  salaryAmountLabel: string;
  signatureImage: string;
};

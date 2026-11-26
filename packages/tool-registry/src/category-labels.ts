import type { Tool } from './tool';

export const CATEGORY_LABELS = {
  'disbursement-voucher': 'Disbursement Voucher',
  'expense-proof': 'Expense Proof',
  'tax-exemption': 'Tax Exemption · 10(13A)',
} as const satisfies Record<Tool['category'], string>;

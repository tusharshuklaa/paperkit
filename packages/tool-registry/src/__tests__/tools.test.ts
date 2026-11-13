import { expect, test } from 'bun:test';
import { CATEGORY_LABELS, tools } from '@repo/tool-registry';

test('ships the live driver tool and two Coming Soon tools', () => {
  expect(tools).toEqual([
    {
      id: 'salary-slip',
      name: 'Driver Salary Slip',
      description:
        'Generate month-end wage receipts with vehicle number logs, overtime tallies, and clean signature slots for HRA and IT Act claiming.',
      category: 'disbursement-voucher',
      format: 'A4 · SLIP',
      icon: 'car',
      order: 1,
      status: 'live',
      href: '/driver-salary-slip',
    },
    {
      id: 'petrol-receipt',
      name: 'Petrol & Fuel Receipt',
      description:
        'Thermal register cash memos featuring fuel volume (litres), VAT/GST breakdowns, pump merchant IDs, and vehicle odometer fields.',
      category: 'expense-proof',
      format: '80MM THERMAL',
      icon: 'fuel',
      order: 2,
      status: 'coming-soon',
    },
    {
      id: 'rent-receipt',
      name: 'House Rent Receipt',
      description:
        'Legally formatted HRA rent declarations supporting mandatory Landlord PAN declaration (>₹1L/yr), revenue stamp guidelines, and multi-quarter batching.',
      category: 'tax-exemption',
      format: '3-PER-PAGE A4',
      icon: 'home',
      order: 3,
      status: 'coming-soon',
    },
  ]);
  expect(CATEGORY_LABELS).toEqual({
    'disbursement-voucher': 'Disbursement Voucher',
    'expense-proof': 'Expense Proof',
    'tax-exemption': 'Tax Exemption · 10(13A)',
  });
  for (const tool of tools.slice(1)) {
    expect(tool).not.toHaveProperty('href');
  }
});

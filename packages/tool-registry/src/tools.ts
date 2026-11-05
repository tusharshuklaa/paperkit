import type { Tool } from './tool';

export const tools: Tool[] = [
  {
    id: 'salary-slip',
    name: 'Driver Salary Slip',
    description:
      'Generate month-end wage receipts with vehicle number logs, overtime tallies, and clean signature slots for HRA and IT Act claiming.',
    category: 'disbursement-voucher',
    format: 'A4 · SLIP',
    icon: 'car',
    order: 1,
    status: 'coming-soon',
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
];

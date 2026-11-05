export type Tool = {
  id: string;
  name: string;
  description: string;
  category: 'disbursement-voucher' | 'expense-proof' | 'tax-exemption';
  format: string;
  icon: 'car' | 'fuel' | 'home';
  order: number;
} & ({ status: 'live'; href: string } | { status: 'coming-soon'; href?: never });

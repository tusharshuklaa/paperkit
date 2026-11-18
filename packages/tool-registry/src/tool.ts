import type { Prettify } from '@repo/utils/types/global';

type LiveStatus = {
  status: 'live';
  href: string;
};

type ComingSoonStatus = {
  status: 'coming-soon';
  href?: never;
};

type ToolCore = {
  id: string;
  name: string;
  description: string;
  category: 'disbursement-voucher' | 'expense-proof' | 'tax-exemption';
  format: string;
  icon: 'car' | 'fuel' | 'home';
  order: number;
};

export type Tool = Prettify<ToolCore & (LiveStatus | ComingSoonStatus)>;
export type ComingSoonTool = Extract<Tool, { status: 'coming-soon' }>;

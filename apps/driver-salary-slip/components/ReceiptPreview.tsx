import type { ReceiptData } from '@/lib/driver-salary-slip/receipt-data';
import { PaperSheet } from '@repo/ui/PaperSheet';
import { ReceiptTemplate1 } from './ReceiptTemplate1';
import { ReceiptTemplate2 } from './ReceiptTemplate2';
import { ReceiptTemplate3 } from './ReceiptTemplate3';

type ReceiptPreviewProps = {
  data: ReceiptData;
};

export function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const template = {
    '1': <ReceiptTemplate1 data={data} />,
    '2': <ReceiptTemplate2 data={data} />,
    '3': <ReceiptTemplate3 data={data} />,
  }[data.template];

  return (
    <PaperSheet
      aria-label={`Driver salary receipt preview, template ${data.template}`}
      className="receipt-paper"
    >
      {template}
    </PaperSheet>
  );
}

import type { ReceiptData } from '@driver/lib/driver-salary-slip/receipt-data';
import { SignatureBlock } from '@repo/ui/SignatureBlock';
import revenueStamp from '../public/revenue.jpg';

type ReceiptFooterProps = {
  data: ReceiptData;
};

export function ReceiptFooter({ data }: ReceiptFooterProps) {
  return (
    <footer className="receipt-footer">
      <div className="receipt-stamp">
        {data.stampEnabled ? (
          <>
            <strong>Revenue Stamp</strong>
            <img alt="Revenue stamp" height="70" src={revenueStamp.src} width="60" />
          </>
        ) : null}
      </div>
      <SignatureBlock label={data.signatureImage ? 'Driver signature' : 'Driver'}>
        {data.signatureImage ? (
          <img
            alt="Driver signature"
            className="signature-image"
            src={data.signatureImage}
            style={{
              transform: `translate(${data.signatureOffsetX}px, ${data.signatureOffsetY}px) rotate(${data.signatureRotation}deg) scale(${data.signatureScale})`,
            }}
          />
        ) : null}
      </SignatureBlock>
    </footer>
  );
}

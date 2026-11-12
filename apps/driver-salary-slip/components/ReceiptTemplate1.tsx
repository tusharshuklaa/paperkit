import type { ReceiptData } from '@/lib/driver-salary-slip/receipt-data';
import { DocumentHeader } from '@repo/ui/DocumentHeader';
import { ReceiptFooter } from './ReceiptFooter';

type ReceiptTemplate1Props = {
  data: ReceiptData;
};

export function ReceiptTemplate1({ data }: ReceiptTemplate1Props) {
  return (
    <div className="receipt-template receipt-template--split">
      <section className="receipt-section">
        <DocumentHeader title="Driver Salary Receipt" />
        <p>
          This is to certify that I have paid{' '}
          <strong>
            {data.currencySymbol} {data.salaryAmountLabel}
          </strong>{' '}
          to driver{' '}
          <strong>
            {data.driverSalutation} {data.driverName}
          </strong>{' '}
          for the month of <strong>{data.salaryMonth}</strong>. (Acknowledged receipt enclosed).{' '}
          {data.declaration}
        </p>
        <dl className="receipt-pair">
          <div>
            <dt>Payer Name</dt>
            <dd>{data.payerName}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{data.paymentDateLabel}</dd>
          </div>
        </dl>
      </section>
      <section className="receipt-section">
        <h3 className="receipt-section-title">Receipt Acknowledgement</h3>
        <dl className="receipt-details">
          <div>
            <dt>Date of Receipt</dt>
            <dd>{data.paymentDateLabel}</dd>
          </div>
          <div>
            <dt>For the Month of</dt>
            <dd>{data.salaryMonth}</dd>
          </div>
          <div>
            <dt>Name of Driver</dt>
            <dd>
              {data.driverSalutation} {data.driverName}
            </dd>
          </div>
          <div>
            <dt>Vehicle No</dt>
            <dd>{data.vehicleNumber.toUpperCase()}</dd>
          </div>
        </dl>
        <p>
          Received a sum of{' '}
          <strong>
            {data.currencySymbol}
            {data.salaryAmountLabel}
          </strong>{' '}
          only for the month of <strong>{data.salaryMonth}</strong> from{' '}
          <strong>
            {data.payerSalutation} {data.payerName}
          </strong>
          .
        </p>
        <ReceiptFooter data={data} />
      </section>
    </div>
  );
}

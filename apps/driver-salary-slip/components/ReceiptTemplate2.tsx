import type { ReceiptData } from '@driver/lib/driver-salary-slip/receipt-data';
import { DocumentHeader } from '@repo/ui/DocumentHeader';
import { ReceiptFooter } from './ReceiptFooter';

type ReceiptTemplate2Props = {
  data: ReceiptData;
};

export function ReceiptTemplate2({ data }: ReceiptTemplate2Props) {
  return (
    <div className="receipt-template">
      <section className="receipt-section">
        <DocumentHeader title="Driver Salary Receipt" />
        <dl className="receipt-details receipt-details--summary">
          <div>
            <dt>Vehicle Number</dt>
            <dd>{data.vehicleNumber.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Salary of the Month</dt>
            <dd>{data.salaryMonth}</dd>
          </div>
          <div>
            <dt>Amount Paid</dt>
            <dd>
              {data.currencySymbol}
              {data.salaryAmountLabel}
            </dd>
          </div>
          <div>
            <dt>Date of Receipt</dt>
            <dd>{data.paymentDateLabel}</dd>
          </div>
        </dl>
        <p>
          Received from{' '}
          <strong>
            {data.payerSalutation} {data.payerName}
          </strong>{' '}
          <strong>
            {data.currencySymbol}
            {data.salaryAmountLabel}
          </strong>{' '}
          to driver{' '}
          <strong>
            {data.driverSalutation} {data.driverName}
          </strong>{' '}
          towards salary of the month of <strong>{data.salaryMonth}</strong>. {data.declaration}
        </p>
        <p className="receipt-payer">
          Payer Name: <strong>{data.payerName}</strong>
        </p>
      </section>
      <section className="receipt-section">
        <h3 className="receipt-section-title">Receipt Acknowledgement</h3>
        <dl className="receipt-details receipt-details--summary">
          <div>
            <dt>Salary of the Month</dt>
            <dd>{data.salaryMonth}</dd>
          </div>
          <div>
            <dt>Amount Paid</dt>
            <dd>
              {data.currencySymbol}
              {data.salaryAmountLabel}
            </dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{data.paymentDateLabel}</dd>
          </div>
        </dl>
        <p>
          Received from{' '}
          <strong>
            {data.payerSalutation} {data.payerName}
          </strong>{' '}
          <strong>
            {data.currencySymbol}
            {data.salaryAmountLabel}
          </strong>{' '}
          to driver{' '}
          <strong>
            {data.driverSalutation} {data.driverName}
          </strong>{' '}
          towards salary of the month of <strong>{data.salaryMonth}</strong>.
        </p>
        <div className="receipt-driver-signoff">
          <strong>Driver Name: {data.driverName}</strong>
        </div>
        <ReceiptFooter data={data} />
      </section>
    </div>
  );
}

import type { ReceiptData } from '@driver/lib/driver-salary-slip/receipt-data';
import { DocumentHeader } from '@repo/ui/DocumentHeader';
import { ReceiptFooter } from './ReceiptFooter';

type ReceiptTemplate3Props = {
  data: ReceiptData;
};

export function ReceiptTemplate3({ data }: ReceiptTemplate3Props) {
  return (
    <div className="receipt-template">
      <section className="receipt-section">
        <DocumentHeader title="Driver Salary Receipt" />
        <p>
          This is to certify that{' '}
          <strong>
            {data.payerSalutation} {data.payerName}
          </strong>{' '}
          have paid{' '}
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
        <dl className="receipt-pair receipt-pair--wide">
          <div>
            <dt>Vehicle Number</dt>
            <dd>{data.vehicleNumber.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{data.paymentDateLabel}</dd>
          </div>
          <div>
            <dt>Driver Name</dt>
            <dd>
              {data.driverSalutation} {data.driverName}
            </dd>
          </div>
          <div>
            <dt>Payer Name</dt>
            <dd>
              {data.payerSalutation} {data.payerName}
            </dd>
          </div>
        </dl>
        <ReceiptFooter data={data} />
      </section>
    </div>
  );
}

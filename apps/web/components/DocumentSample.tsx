import { FileText, Fuel, House } from 'lucide-react';
import styles from './document-sample.module.css';

export type DocumentSampleKind = 'salary' | 'fuel' | 'rent';

const documents = {
  salary: {
    title: 'Driver salary slip',
    subtitle: 'Monthly disbursement record',
    icon: FileText,
    label: 'Beneficiary',
    reference: 'PK-88294-DL',
    rows: [
      ['Monthly retainer', 18500],
      ['Overtime / 38 hours', 4560],
      ['Toll reimbursement', 1240],
      ['Advance deduction', -2000],
    ],
    total: 22300,
    totalLabel: 'Net disbursed',
  },
  fuel: {
    title: 'Fuel receipt',
    subtitle: 'Petrol / 30 litres at INR 100 per litre',
    icon: Fuel,
    label: 'Customer',
    reference: 'PK-FUEL-1042',
    rows: [['Petrol purchase', 3000]],
    total: 3000,
    totalLabel: 'Total paid',
  },
  rent: {
    title: 'House rent receipt',
    subtitle: 'Monthly accommodation record',
    icon: House,
    label: 'Tenant',
    reference: 'PK-RENT-1024',
    rows: [
      ['Rent / October 2024', 18000],
      ['Maintenance', 2000],
    ],
    total: 20000,
    totalLabel: 'Total received',
  },
};

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function DocumentSample({
  kind = 'salary',
  compact = false,
}: {
  kind?: DocumentSampleKind;
  compact?: boolean;
}) {
  const document = documents[kind];
  const Icon = document.icon;
  return (
    <article
      className={`${styles.paper} ${compact ? styles.compact : ''} ${kind === 'fuel' ? styles.thermal : ''}`}
      aria-label={`Illustrative ${document.title}`}
    >
      <header className={styles.header}>
        <span className={styles.brand}>
          <Icon aria-hidden="true" /> PaperKit
        </span>
        <span className={styles.reference}>{document.reference}</span>
      </header>
      <h3>{document.title}</h3>
      <p className={styles.subtitle}>{document.subtitle}</p>
      <dl className={styles.details}>
        <div>
          <dt>{document.label}</dt>
          <dd>Rajesh Kumar Verma</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>October 2024</dd>
        </div>
      </dl>
      <table className={styles.table}>
        <caption className={styles.srOnly}>Illustrative amounts in Indian rupees</caption>
        <tbody>
          {document.rows.map(([label, amount]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{currency.format(Number(amount))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{document.totalLabel}</th>
            <td>{currency.format(document.total)}</td>
          </tr>
        </tfoot>
      </table>
      <div className={styles.signoff}>
        <span>Signature</span>
        <span>________________</span>
      </div>
      <p className={styles.note}>Illustrative sample / not a generated document</p>
    </article>
  );
}

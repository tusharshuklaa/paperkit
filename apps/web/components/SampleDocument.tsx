import { DocumentHeader } from '@repo/ui/DocumentHeader';
import { PaperSheet } from '@repo/ui/PaperSheet';
import { SignatureBlock } from '@repo/ui/SignatureBlock';
import { Stamp } from '@repo/ui/Stamp';

export function SampleDocument() {
  return (
    <div className="document-stage">
      <PaperSheet aria-label="Sample Driver Disbursement Voucher" className="sample-document">
        <div className="document-reference">
          <span>SCHEDULE II · FORM 16-C</span>
          <span className="numeric">ID: PK-88294-DL</span>
        </div>
        <DocumentHeader
          title="Driver Disbursement Voucher"
          subtitle="Motor Vehicle Conveyance & Retention Record"
        />
        <Stamp className="paid-stamp">PAID · IN-BROWSER</Stamp>
        <dl className="document-details">
          <div>
            <dt>Beneficiary Name</dt>
            <dd>Rajesh Kumar Verma</dd>
          </div>
          <div>
            <dt>Payment Cycle</dt>
            <dd>October 2024</dd>
          </div>
          <div>
            <dt>Vehicle Reg. No.</dt>
            <dd className="numeric">DL-01-AB-4920</dd>
          </div>
          <div>
            <dt>Disbursement Mode</dt>
            <dd>IMPS / 9048-2831</dd>
          </div>
        </dl>
        <table className="ledger">
          <thead>
            <tr>
              <th scope="col">Particulars</th>
              <th scope="col">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Monthly Driver Retainer Fee</th>
              <td>18,500.00</td>
            </tr>
            <tr>
              <th scope="row">Overtime (38 hrs @ 120/hr)</th>
              <td>4,560.00</td>
            </tr>
            <tr>
              <th scope="row">Toll & Fastag Reimbursement</th>
              <td>1,240.00</td>
            </tr>
            <tr className="deduction">
              <th scope="row">Advance Deduction</th>
              <td>-2,000.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Net Disbursed</th>
              <td>₹ 22,300.00</td>
            </tr>
          </tfoot>
        </table>
        <div className="document-signoff">
          <div>
            <span className="document-label">Verification Hash</span>
            <span className="numeric">SHA256: d84e…9a71</span>
          </div>
          <SignatureBlock label="Authorised Signature" />
        </div>
      </PaperSheet>
    </div>
  );
}

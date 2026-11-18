import { DriverSalarySlip } from '@driver/components/DriverSalarySlip';
import { PlatformFooter } from '@repo/platform-shell/PlatformFooter';
import { PlatformHeader } from '@repo/platform-shell/PlatformHeader';
import styles from '@repo/platform-shell/landing.module.css';

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DriverSalarySlipPage() {
  return (
    <div className={styles.landing}>
      <PlatformHeader toolName="Driver Salary Slip" />
      <DriverSalarySlip initialDate={localDateKey(new Date())} />
      <PlatformFooter />
    </div>
  );
}

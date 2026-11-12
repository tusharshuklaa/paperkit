import { DriverSalarySlip } from '@/components/DriverSalarySlip';

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DriverSalarySlipPage() {
  return <DriverSalarySlip initialDate={localDateKey(new Date())} />;
}

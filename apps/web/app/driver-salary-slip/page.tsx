import '../../../driver-salary-slip/app/globals.css';
import { canonicalOrigin } from '../../lib/canonical-origin';

const origin = canonicalOrigin();

export const metadata = {
  title: 'Driver Salary Slip | PaperKit',
  description: 'Prepare and print a driver salary receipt with an optional payer declaration.',
  ...(origin
    ? {
        alternates: { canonical: '/driver-salary-slip' },
        openGraph: {
          title: 'Driver Salary Slip | PaperKit',
          url: new URL('/driver-salary-slip', origin).href,
          type: 'website' as const,
        },
      }
    : {}),
};

export { default } from '../../../driver-salary-slip/app/page';

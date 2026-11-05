import type { Metadata } from 'next';
import { JetBrains_Mono, Source_Sans_3 } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import { canonicalOrigin } from '../lib/canonical-origin';
import './globals.css';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const origin = canonicalOrigin();

export const metadata: Metadata = {
  title: 'PaperKit | Everyday paperwork, done in seconds.',
  description:
    'Free generators for salary slips, fuel bills and rent receipts. No signup, no watermark.',
  ...(origin
    ? {
        metadataBase: origin,
        alternates: { canonical: '/' },
        openGraph: { title: 'PaperKit', url: origin.href, type: 'website' },
      }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

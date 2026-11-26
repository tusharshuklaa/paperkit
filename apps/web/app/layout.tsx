import type { Metadata } from 'next';
import { Bricolage_Grotesque, Caveat, JetBrains_Mono, Manrope } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import { canonicalOrigin } from '../lib/canonical-origin';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const caveat = Caveat({ subsets: ['latin'], variable: '--font-signature', display: 'swap' });
const origin = canonicalOrigin();

export const metadata: Metadata = {
  title: 'PaperKit | Everyday document tools',
  description: 'Create a driver salary slip and explore upcoming fuel and rent receipt tools.',
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
      className={`${manrope.variable} ${bricolage.variable} ${jetbrains.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

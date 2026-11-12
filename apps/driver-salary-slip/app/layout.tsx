import { ThemeProvider } from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Caveat, JetBrains_Mono, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
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

export const metadata: Metadata = {
  title: 'Driver Salary Slip | PaperKit',
  description: 'Prepare and print a driver salary receipt with an optional payer declaration.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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

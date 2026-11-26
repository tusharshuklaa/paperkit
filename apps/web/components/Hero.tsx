import { ArrowRight } from 'lucide-react';
import { SampleDocument } from './SampleDocument';

export function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow with-dot">In-Browser Ledger Engine</p>
        <h1 id="hero-title">Everyday paperwork, done in seconds.</h1>
        <p className="hero-description">
          Free generators for salary slips, fuel bills and rent receipts. No signup, no watermark —
          and your documents never leave your browser.
        </p>
        <div className="hero-actions">
          <a className="pk-button pk-button--primary" href="#tool-catalog">
            Browse tools
          </a>
          <a className="text-action" href="#how-it-works">
            See how it works
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <dl className="trust-row">
          {['No signup', '100% free', 'No watermark', 'Private by design'].map((text, index) => (
            <div key={text}>
              <dt className="numeric">PARAM 0{index + 1}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
      <SampleDocument />
    </section>
  );
}

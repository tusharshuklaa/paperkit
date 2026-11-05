import { toolsInDisplayOrder } from '@repo/tool-registry';
import { ArrowDown, ArrowUpRight, ChevronDown, Layers } from 'lucide-react';
import type { DocumentSampleKind } from '../components/DocumentSample';
import { DocumentShowcase } from '../components/DocumentShowcase';
import { LandingCatalog } from '../components/LandingCatalog';
import { ThemeControl } from '../components/ThemeControl';
import styles from '../components/landing.module.css';
import { canonicalOrigin } from '../lib/canonical-origin';
import { toolListJsonLd } from '../lib/tool-list-json-ld';

const sampleKinds = { car: 'salary', fuel: 'fuel', home: 'rent' } as const;
const sampleLabels = { car: 'Salary', fuel: 'Fuel', home: 'Rent' };

export default function Page() {
  const structuredData = toolListJsonLd(canonicalOrigin());
  const tools = toolsInDisplayOrder();
  const samples: { kind: DocumentSampleKind; label: string; name: string }[] = tools
    .map((tool) => ({
      kind: sampleKinds[tool.icon],
      label: sampleLabels[tool.icon],
      name: tool.name,
    }))
    .filter((sample, index, all) => all.findIndex((entry) => entry.kind === sample.kind) === index);
  return (
    <div className={styles.landing}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="PaperKit home">
          <Layers aria-hidden="true" /> PaperKit
        </a>
        <nav aria-label="Main navigation">
          <a href="#tool-catalog">Tools</a>
          <a href="#about">About</a>
        </nav>
        <ThemeControl />
      </header>
      <main id="main">
        <section className={styles.hero} aria-labelledby="landing-title">
          <h1 id="landing-title">PaperKit.</h1>
          <div className={styles.introduction}>
            <p>
              Everyday document tools.
              <br />
              Salary, fuel, and rent. In the making.
            </p>
            <a className={styles.textLink} href="#tool-catalog">
              Browse tools <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <DocumentShowcase samples={samples} />
        </section>
        <LandingCatalog />
        <section className={styles.about} id="about" aria-labelledby="about-title">
          <h2 id="about-title">
            Less admin.
            <br />
            More everyday.
          </h2>
          <div>
            <p>
              Salary paid. Fuel filled. Rent settled. PaperKit is being built around the small
              records that matter in everyday life.
            </p>
            <p>
              Explore the catalog to see which tools are ready. Sample documents are illustrations,
              not proof of payment or official records.
            </p>
            <a className={styles.textLink} href="#tool-catalog">
              Meet the tools <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>
        <section className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">A few useful answers.</h2>
          <div>
            <details>
              <summary>
                Can I create a document today?
                <ChevronDown aria-hidden="true" />
              </summary>
              <p>
                {tools.some((tool) => tool.status === 'live')
                  ? 'Available tools are linked in the catalog. Tools marked Coming Soon are not available yet.'
                  : 'Not yet. All tools in the catalog are Coming Soon. Samples show illustrative layouts, not working generators.'}
              </p>
            </details>
            <details>
              <summary>
                Are the sample documents real?
                <ChevronDown aria-hidden="true" />
              </summary>
              <p>
                No. Names, periods, and amounts are illustrative. Samples are not proof of payment,
                official records, or legal advice.
              </p>
            </details>
            <details>
              <summary>
                What is PaperKit being built for?
                <ChevronDown aria-hidden="true" />
              </summary>
              <p>
                Everyday salary, fuel, and rent paperwork. The catalog shows when each document tool
                becomes available.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>PaperKit.</span>
        <nav aria-label="Footer navigation">
          <a href="#tool-catalog">
            Tool catalog <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="#about">About PaperKit</a>
        </nav>
        <span>Everyday documents. Thoughtfully made.</span>
      </footer>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      )}
    </div>
  );
}

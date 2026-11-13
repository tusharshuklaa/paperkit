import { PlatformFooter } from '@repo/platform-shell/PlatformFooter';
import { PlatformHeader } from '@repo/platform-shell/PlatformHeader';
import styles from '@repo/platform-shell/landing.module.css';
import { toolsInDisplayOrder } from '@repo/tool-registry';
import { ArrowDown } from 'lucide-react';
import type { DocumentSampleKind } from '../components/DocumentSample';
import { DocumentShowcase } from '../components/DocumentShowcase';
import { LandingCatalog } from '../components/LandingCatalog';
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
      <PlatformHeader />
      <main id="main">
        <section className={styles.hero} aria-labelledby="landing-title">
          <h1 id="landing-title">PaperKit.</h1>
          <div className={styles.introduction}>
            <p>
              Everyday document tools.
              <br />
              Salary, fuel, and rent. Made for everyday life.
            </p>
            <a className={styles.textLink} href="#tool-catalog">
              Browse tools <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <DocumentShowcase samples={samples} />
        </section>
        <LandingCatalog />
      </main>
      <PlatformFooter home />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      )}
    </div>
  );
}

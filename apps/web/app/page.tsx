import { About } from '../components/About';
import { Catalog } from '../components/Catalog';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { SiteFooter } from '../components/SiteFooter';
import { Workflow } from '../components/Workflow';
import { canonicalOrigin } from '../lib/canonical-origin';
import { toolListJsonLd } from '../lib/tool-list-json-ld';

export default function Page() {
  const structuredData = toolListJsonLd(canonicalOrigin());
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Catalog />
        <Workflow />
        <About />
      </main>
      <SiteFooter />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      )}
    </>
  );
}

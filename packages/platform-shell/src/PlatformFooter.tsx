import { toolsInDisplayOrder } from '@repo/tool-registry';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import styles from './landing.module.css';

type PlatformFooterProps = {
  home?: boolean;
};

export function PlatformFooter({ home = false }: PlatformFooterProps) {
  const homePrefix = home ? '' : '/';
  const hasLiveTools = toolsInDisplayOrder().some((tool) => tool.status === 'live');

  return (
    <div className={styles.siteChrome}>
      <section className={styles.about} id="about" aria-labelledby="about-title">
        <h2 id="about-title">
          Less admin.
          <br />
          More everyday.
        </h2>
        <div>
          <p>
            Salary paid. Fuel filled. Rent settled. PaperKit is being built around the small records
            that matter in everyday life.
          </p>
          <p>
            Explore the catalog to see which tools are ready. Sample documents are illustrations,
            not proof of payment or official records.
          </p>
          <a className={styles.textLink} href={`${homePrefix}#tool-catalog`}>
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
              {hasLiveTools
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
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>PaperKit.</span>
        <nav aria-label="Footer navigation">
          <a href={`${homePrefix}#tool-catalog`}>
            Tool catalog <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={`${homePrefix}#about`}>About PaperKit</a>
        </nav>
        <span>Everyday documents. Thoughtfully made.</span>
      </footer>
    </div>
  );
}

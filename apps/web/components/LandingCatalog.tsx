import { toolsInDisplayOrder } from '@repo/tool-registry';
import { ArrowUpRight, Car, Fuel, House } from 'lucide-react';
import { DocumentSample, type DocumentSampleKind } from './DocumentSample';
import styles from './landing.module.css';

const presentation = {
  car: {
    kind: 'salary',
    icon: Car,
    description: 'A clear record of wages, overtime, and reimbursements.',
  },
  fuel: {
    kind: 'fuel',
    icon: Fuel,
    description: 'Keep vehicle expenses and fuel purchases in order.',
  },
  home: { kind: 'rent', icon: House, description: 'A place for monthly rent and tenant details.' },
} satisfies Record<string, { kind: DocumentSampleKind; icon: typeof Car; description: string }>;

export function LandingCatalog() {
  return (
    <section className={styles.collection} id="tool-catalog" aria-labelledby="catalog-title">
      <div className={styles.sectionIntro}>
        <h2 id="catalog-title">For life's paperwork.</h2>
        <p>
          Everyday document tools.
          <br />
          Check availability below.
        </p>
      </div>
      <div className={styles.catalog}>
        {toolsInDisplayOrder().map((tool) => {
          const { kind, icon: Icon, description } = presentation[tool.icon];
          return (
            <article className={styles.tool} key={tool.id}>
              <div className={styles.toolArt} data-kind={kind} aria-hidden="true">
                <div className={styles.toolPaper}>
                  <DocumentSample kind={kind} compact />
                </div>
              </div>
              <div className={styles.toolHeading}>
                <h3>{tool.name}</h3>
                <Icon aria-hidden="true" />
              </div>
              <p>{description}</p>
              <div className={styles.toolMeta}>
                <span>{tool.format}</span>
                {tool.status === 'live' ? (
                  <a href={tool.href} aria-label={`Open ${tool.name}`}>
                    Open tool <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : (
                  <span>Coming Soon</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import { Check, FileText, Fuel, House } from 'lucide-react';
import { useState } from 'react';
import { DocumentSample, type DocumentSampleKind } from './DocumentSample';
import styles from './landing.module.css';

type DocumentShowcaseProps = {
  samples: { kind: DocumentSampleKind; label: string; name: string }[];
};

const icons = { salary: FileText, fuel: Fuel, rent: House };

export function DocumentShowcase({ samples }: DocumentShowcaseProps) {
  const [selected, setSelected] = useState<DocumentSampleKind>('salary');
  const active = samples.find((sample) => sample.kind === selected);
  return (
    <fieldset className={styles.stage} aria-label="Document samples">
      <div className={styles.statement}>
        <h2>
          Good
          <br />
          on paper.
        </h2>
        <fieldset className={styles.selector} aria-label="Document sample">
          {samples.map(({ kind, label }) => {
            const Icon = icons[kind];
            return (
              <button
                key={kind}
                type="button"
                aria-pressed={selected === kind}
                onClick={() => setSelected(kind)}
              >
                <Icon aria-hidden="true" />
                {label}
                <Check className={styles.check} aria-hidden="true" />
              </button>
            );
          })}
        </fieldset>
      </div>
      <div className={styles.stack} data-testid="document-stack">
        <div className={styles.rearPaper} data-testid="rear-paper" aria-hidden="true">
          <DocumentSample kind={selected === 'salary' ? 'rent' : 'salary'} compact />
        </div>
        <div className={styles.frontPaper} data-testid="front-paper">
          <DocumentSample kind={selected} />
        </div>
      </div>
      <p className={styles.caption} aria-live="polite" aria-atomic="true">
        <span>{active?.name}</span>
        <span>Illustrative sample / not a generated document</span>
      </p>
    </fieldset>
  );
}

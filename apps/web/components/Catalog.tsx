import { CATEGORY_LABELS, toolsInDisplayOrder } from '@repo/tool-registry';
import { ToolCard } from '@repo/ui/ToolCard';
import { Car, Fuel, House } from 'lucide-react';

const icons = { car: Car, fuel: Fuel, home: House };

export function Catalog() {
  return (
    <section className="catalog container" id="tool-catalog" aria-labelledby="catalog-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow numeric">Catalog · Phase 1</p>
          <h2 id="catalog-title">Available Instruments</h2>
        </div>
        <p>
          Institutional documentation formats calibrated for Indian tax exemptions, corporate audit
          clearance, and statutory compliance.
        </p>
      </div>
      <div className="tool-grid">
        {toolsInDisplayOrder().map((tool) => {
          const Icon = icons[tool.icon];
          return (
            <ToolCard
              key={tool.id}
              name={tool.name}
              description={tool.description}
              category={CATEGORY_LABELS[tool.category]}
              format={tool.format}
              icon={<Icon aria-hidden="true" />}
              {...(tool.status === 'live'
                ? { status: 'live', href: tool.href }
                : { status: 'coming-soon' })}
            />
          );
        })}
      </div>
    </section>
  );
}

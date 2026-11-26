const steps = [
  {
    title: 'Input Raw Metadata',
    description:
      'Type beneficiary information, allowances, deductions, and vehicle tags into high-density numeric form fields. Automatic inline sums compute as you stroke.',
    label: 'CLIENT-SIDE VALIDATION',
  },
  {
    title: 'Instant Print Inspection',
    description:
      'Inspect a 1:1 scale representation of the physical paper artifact. Verify tax IDs, layout boundaries, and official stamps without page reloading or server roundtrips.',
    label: 'ZERO SERVER RENDERING',
  },
  {
    title: 'Print or Export Vector PDF',
    description:
      'Direct browser-level print output with exact 300 DPI vector typography and hairlines. No server generation, zero watermarks, and no cloud-stored file traces.',
    label: 'DETERMINISTIC PDF/A',
  },
];

export function Workflow() {
  return (
    <section className="workflow container" id="how-it-works" aria-labelledby="workflow-title">
      <p className="eyebrow numeric">Zero Latency Workflow</p>
      <h2 id="workflow-title">Operational Protocol</h2>
      <ol className="workflow-grid">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="step-number numeric">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <span className="step-label numeric">{step.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

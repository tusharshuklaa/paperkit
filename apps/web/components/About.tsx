export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="container about-inner">
        <p className="eyebrow with-dot numeric">Architecture & Ethics</p>
        <h2 id="about-title">
          Why PaperKit is unconditionally <span>free</span>.
        </h2>
        <p>
          Standard documentation tools trap necessary paperwork behind aggressive subscriptions,
          paywalled watermarks, and data harvesting pipelines. PaperKit executes 100% inside your
          local web browser engine. Because compute and memory usage occur exclusively on your
          device, running this service incurs negligible server infrastructure overhead.
        </p>
        <dl className="about-stats">
          {[
            ['0 B', 'Data stored on servers'],
            ['0 ms', 'Network upload delay'],
            ['100%', 'Local browser compute'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="numeric">{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

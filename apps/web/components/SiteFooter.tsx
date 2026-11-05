const groups = [
  { title: 'Instruments', labels: ['Salary Slip', 'Driver Voucher', 'Rent Receipt', 'Fuel Bill'] },
  { title: 'Standards', labels: ['Compliance', 'TDS & HRA', 'Verification', 'Print Specs'] },
  { title: 'System', labels: ['Status Ledger', 'Changelog', 'Privacy Policy', 'Terms'] },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              {group.labels.map((label) => (
                <a href="#" key={label}>
                  {label}
                </a>
              ))}
            </nav>
          ))}
          <div>
            <h2>Organization</h2>
            <p>PaperKit Institutional</p>
            <p className="numeric">v2.4.0-IN-STABLE</p>
          </div>
        </div>
        <p className="footer-copyright">© 2025 PaperKit. Deterministic ledger instruments.</p>
      </div>
    </footer>
  );
}

import { ThemeControl } from '@repo/platform-shell/ThemeControl';
import { FileText } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href="#" aria-label="PaperKit home">
          <span className="brand-icon">
            <FileText aria-hidden="true" />
          </span>
          PaperKit
        </a>
        <nav aria-label="Main navigation">
          <a href="#tool-catalog">Tools</a>
          <a href="#about">About</a>
        </nav>
        <ThemeControl />
      </div>
    </header>
  );
}

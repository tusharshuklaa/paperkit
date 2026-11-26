import { Layers } from 'lucide-react';
import { ThemeControl } from './ThemeControl';
import styles from './landing.module.css';

type PlatformHeaderProps = {
  toolName?: string;
};

export function PlatformHeader({ toolName }: PlatformHeaderProps) {
  const homePrefix = toolName ? '/' : '';

  return (
    <header className={`${styles.header} ${styles.siteChrome}`}>
      <div className={styles.identity}>
        <a className={styles.wordmark} href="/" aria-label="PaperKit home">
          <Layers aria-hidden="true" /> PaperKit
        </a>
        {toolName && (
          <span className={styles.breadcrumb}>
            / <span>{toolName}</span>
          </span>
        )}
      </div>
      <nav aria-label="Main navigation">
        <a href={`${homePrefix}#tool-catalog`}>Tools</a>
        <a href={`${homePrefix}#about`}>About</a>
      </nav>
      <ThemeControl />
    </header>
  );
}

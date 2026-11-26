'use client';

import { Button } from '@repo/ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      className="theme-control"
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="theme-sun" aria-hidden="true" />
      <Moon className="theme-moon" aria-hidden="true" />
    </Button>
  );
}

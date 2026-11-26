import { Font } from '@react-pdf/renderer';

const fonts = [
  // Bundled asset, not public/: the web app embeds this package and has no copy of driver public files.
  { family: 'Receipt Sans', src: new URL('./fonts/DejaVuSans.ttf', import.meta.url).href },
  {
    family: 'Receipt Devanagari',
    src: new URL(
      '@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-400-normal.woff',
      import.meta.url,
    ).href,
  },
  {
    family: 'Receipt Arabic',
    src: new URL(
      '@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff',
      import.meta.url,
    ).href,
  },
  {
    family: 'Receipt Armenian',
    src: new URL(
      '@fontsource/noto-sans-armenian/files/noto-sans-armenian-armenian-400-normal.woff',
      import.meta.url,
    ).href,
  },
  {
    family: 'Receipt Bengali',
    src: new URL(
      '@fontsource/noto-sans-bengali/files/noto-sans-bengali-bengali-400-normal.woff',
      import.meta.url,
    ).href,
  },
];

for (const font of fonts) Font.register(font);

export async function prepareReceiptPdfFonts(text: string): Promise<string[] | null> {
  const missing = new Set(
    Array.from(text).filter((character) => !/[\s\u200c\u200d]/u.test(character)),
  );
  const families: string[] = [];

  for (const { family } of fonts) {
    const descriptor = { fontFamily: family, fontStyle: 'normal', fontWeight: 400 } as const;
    await Font.load(descriptor);
    const font = Font.getFont(descriptor).data;
    families.push(family);
    for (const character of missing) {
      const codePoint = character.codePointAt(0);
      if (codePoint !== undefined && font?.hasGlyphForCodePoint(codePoint))
        missing.delete(character);
    }
    if (missing.size === 0) return families;
  }

  return null;
}

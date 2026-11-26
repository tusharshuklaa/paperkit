type PdfDocument = NonNullable<Parameters<typeof import('@react-pdf/renderer').pdf>[0]>;

export async function downloadPdf(pdfDocument: PdfDocument, filename: string): Promise<void> {
  const { pdf } = await import('@react-pdf/renderer');
  const blob = await pdf(pdfDocument).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);

  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}

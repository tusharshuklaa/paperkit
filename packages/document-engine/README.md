# Document Engine

Browser output for PaperKit tools. Tools own validation, document content,
layout, and any draft retention.

- `printDocument()` waits for the page's fonts and images, then opens the native
	print dialog. It prints the current page; the caller owns its print CSS.
- `downloadPdf(document, filename)` renders a React PDF `Document` to a Blob
	in the browser and starts a download. It rejects if generation fails; the
	browser controls where and how the resulting file is saved.

```tsx
import { Document, Page, Text } from '@react-pdf/renderer';
import { downloadPdf } from '@repo/document-engine';

await downloadPdf(
	<Document>
		<Page size="A4">
			<Text>Payment receipt</Text>
		</Page>
	</Document>,
	'payment-receipt.pdf',
);
```

Call these operations from browser event handlers. For PDF export, lazy-load
the layout on demand, use bundled or same-origin fonts and images, and verify
supported scripts against the resulting PDF. Native print does not load the PDF
renderer. See [PDF library selection](../../docs/implementation/document-output.md).

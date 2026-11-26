# Browser Document Output

## Library Selection

| Option | Fit for PaperKit |
| --- | --- |
| [React PDF](https://react-pdf.org/docs/v4/advanced/on-the-fly-rendering) | Generates a Blob in the browser from React document primitives. Supports [A4 and wrapping](https://react-pdf.org/docs/v4/advanced/page-wrapping) and [embedded static fonts](https://react-pdf.org/docs/v4/fonts). Does not reuse the app's HTML or print CSS. |
| [pdfmake](https://pdfmake.github.io/docs/0.3/getting-started/client-side/methods/) | Also exports locally. Strong [table layout](https://pdfmake.github.io/docs/0.3/document-definition-object/tables/), but requires a separate document definition and [does not fully support RTL](https://github.com/bpampuch/pdfmake/issues/184). |
| [jsPDF](https://github.com/parallax/jsPDF) | Supports browser downloads, but direct drawing gives the app more responsibility for layout. Its HTML path depends on [html2canvas CSS support](https://html2canvas.hertzen.com/features), so it is not a reliable match for native print. |
| [Playwright Chromium](https://playwright.dev/docs/api/class-page#page-pdf) | Reuses the actual print CSS, but generating a downloadable PDF this way in production would require a renderer outside the user's browser and transfer receipt data to it. |

Use React PDF for the direct download and native browser print for printing.
The Salary Receipt's three layouts share the same validated data across both
outputs, but spacing and typography can differ. The app does not upload
receipt data or save a draft on download. The browser may save the PDF itself
to the user's downloads folder. Fonts and the stamp are app assets.

## Fonts and Copying Text

PDF export uses [DejaVu Sans 2.37](https://github.com/dejavu-fonts/dejavu-fonts/releases/tag/version_2_37)
and local [Noto subsets](https://fontsource.org/fonts) for Devanagari and the
currency glyphs missing from DejaVu Sans. Export reports characters outside
the embedded fonts' coverage and leaves Print available. Text is selectable;
some PDF readers may copy Devanagari glyphs in visual rather than logical
order. Extracted Latin text and the full set of current currency glyphs are
covered by browser tests.

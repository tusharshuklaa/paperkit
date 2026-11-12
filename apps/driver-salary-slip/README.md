# Driver Salary Slip

Independent PaperKit app for preparing a driver's salary receipt. Uses browser printing and the browser's Save as PDF destination; it does not calculate payroll or establish tax, legal, stamp, or signature validity.

## Run

From the monorepo root:

```sh
bun install
bun run --cwd apps/driver-salary-slip dev --port 3103
bunx turbo run build --filter=@repo/driver-salary-slip...
bun test apps/driver-salary-slip/__tests__/*.test.ts
bun run test:driver-salary-slip
```

The form and preview run locally at `http://localhost:3103`. The app has no API, telemetry, autosave, or form uploads. Save & Print explicitly stores an app-owned, versioned draft in browser local storage. Reset Form leaves that draft intact; Clear Saved Data removes only this app's record. Uploaded signature images above 204800 characters are omitted from saved data and reported.

## Signatures and assets

Name signatures use a local-build Caveat font, isolated from PaperKit's interface and receipt typography. It was selected for readable mixed-case strokes at receipt size; the browser smoke suite checks font readiness, generated output, and signature visibility. Uploaded PNG, JPEG, and WebP images replace the generated name signature. The functional source revenue-stamp image is app-owned at `public/revenue.jpg`.

## Print limits

Print output targets A4 and follows the browser print dialog. Save as PDF is provided by the browser. Long receipt text may flow onto additional pages. Chromium print checks do not certify physical-printer output or legal, tax, payroll, stamp, or signature status.

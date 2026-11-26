import { ReceiptPdfPage } from '@driver/components/ReceiptPdfPage';
import { Document } from '@react-pdf/renderer';
import { downloadPdf } from '@repo/document-engine';
import { createElement } from 'react';
import type { FormValues } from './form-schema';
import { generateNameSignature } from './generate-name-signature';
import { prepareReceiptPdfFonts } from './prepare-receipt-pdf-fonts';
import { receiptDataFromForm } from './receipt-data';

async function signatureForPdf(values: FormValues): Promise<string> {
  const { uploadedSignature } = values;
  if (!uploadedSignature) return generateNameSignature(values.driverName);
  if (!uploadedSignature.startsWith('data:image/webp;')) return uploadedSignature;

  const image = new Image();
  image.src = uploadedSignature;
  await image.decode();
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Signature image could not be prepared.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

export async function downloadSalaryReceipt(
  values: FormValues,
): Promise<'downloaded' | 'unsupported-text'> {
  const data = receiptDataFromForm(values, '');
  const fontFamilies = await prepareReceiptPdfFonts(
    `${data.driverName} ${data.payerName} ${data.vehicleNumber.toUpperCase()} ${data.declaration} ${data.currencySymbol}`,
  );
  if (!fontFamilies) return 'unsupported-text';

  const signatureImage = await signatureForPdf(values);
  const page = createElement(ReceiptPdfPage, {
    data: { ...data, signatureImage },
    fontFamilies,
  });
  await downloadPdf(
    createElement(Document, { title: 'Driver Salary Receipt' }, page),
    `driver-salary-receipt-${data.salaryMonth.toLowerCase()}.pdf`,
  );
  return 'downloaded';
}

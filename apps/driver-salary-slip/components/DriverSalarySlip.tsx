'use client';

import { PrintDialog } from '@driver/components/PrintDialog';
import { ReceiptPreview } from '@driver/components/ReceiptPreview';
import { SalarySlipForm } from '@driver/components/SalarySlipForm';
import { useSignatureImage } from '@driver/hooks/useSignatureImage';
import { createDefaultValues } from '@driver/lib/driver-salary-slip/create-default-values';
import { draftStorage } from '@driver/lib/driver-salary-slip/draft-storage';
import { type FormValues, formSchema } from '@driver/lib/driver-salary-slip/form-schema';
import { receiptDataFromForm } from '@driver/lib/driver-salary-slip/receipt-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { printDocument } from '@repo/document-engine';
import { useEffect, useRef, useState } from 'react';
import { type FieldErrors, type FieldPath, useForm, useWatch } from 'react-hook-form';

type DriverSalarySlipProps = {
  initialDate: string;
};

const templates = [
  {
    id: '1',
    name: 'Split receipt',
    detail: 'Declaration and acknowledgement',
    silhouette: 'M6 13h20M6 17h17M6 21h11M2 25h28M9 29h14M6 33h7m6 0h7M6 37h7m6 0h7M20 41h6',
  },
  {
    id: '2',
    name: 'Summary',
    detail: 'Payment summary and acknowledgement',
    silhouette: 'M6 13h7m6 0h7M6 17h7m6 0h7M6 22h20M6 26h11M9 31h14M6 35h7m6 0h7M6 39h13M20 42h6',
  },
  {
    id: '3',
    name: 'Certification',
    detail: 'Compact single statement',
    silhouette: 'M6 13h20M6 17h20M6 21h12M6 26h7m6 0h7M6 30h7m6 0h7M20 35h6',
  },
] as const;

export function DriverSalarySlip({ initialDate }: DriverSalarySlipProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(new Date(`${initialDate}T00:00:00`)),
    mode: 'onTouched',
  });
  const [outputMessage, setOutputMessage] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const outputInProgress = useRef(false);
  const values = useWatch({ control: form.control }) as FormValues;
  const signatureImage = useSignatureImage(values.driverName, values.uploadedSignature);
  const receiptData = receiptDataFromForm(values, signatureImage);

  useEffect(() => {
    const now = new Date();
    const saved = draftStorage.load(now);
    if (saved) {
      form.reset(saved);
      form.setValue('paymentDate', saved.paymentDate);
      return;
    }

    const defaults = createDefaultValues(now);
    form.setValue('paymentDate', defaults.paymentDate);
    form.setValue('salaryMonth', defaults.salaryMonth);
  }, [form]);

  const printReceipt = () => {
    if (outputInProgress.current) return;
    outputInProgress.current = true;
    setIsPrinting(true);
    setPrintDialogOpen(false);
    void printDocument()
      .catch(() => setOutputMessage('Could not open the print dialog. Try again.'))
      .finally(() => {
        outputInProgress.current = false;
        setIsPrinting(false);
      });
  };

  const showInvalidReceipt = (errors: FieldErrors<FormValues>) => {
    const firstInvalidField = Object.keys(errors)[0] as FieldPath<FormValues> | undefined;
    const firstError = firstInvalidField ? errors[firstInvalidField]?.message : undefined;
    const fieldLabel = firstInvalidField
      ? firstInvalidField.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
      : '';
    setOutputMessage(
      firstError && fieldLabel
        ? `${fieldLabel}: ${firstError}`
        : 'Complete the required receipt details first.',
    );
    if (firstInvalidField) form.setFocus(firstInvalidField);
  };

  const handlePrintRequest = form.handleSubmit(() => {
    if (outputInProgress.current) return;
    setOutputMessage('');
    setPrintDialogOpen(true);
  }, showInvalidReceipt);

  const handleDownloadRequest = form.handleSubmit(async (validated) => {
    if (outputInProgress.current) return;
    outputInProgress.current = true;
    setIsDownloading(true);
    setOutputMessage('Preparing PDF...');
    try {
      const { downloadSalaryReceipt } = await import(
        '@driver/lib/driver-salary-slip/download-salary-receipt'
      );
      const result = await downloadSalaryReceipt(validated);
      setOutputMessage(
        result === 'unsupported-text'
          ? 'The PDF cannot display some receipt characters. Use Print receipt instead.'
          : 'PDF download started.',
      );
    } catch {
      setOutputMessage('Could not download the PDF. Try again or use Print receipt.');
    } finally {
      outputInProgress.current = false;
      setIsDownloading(false);
    }
  }, showInvalidReceipt);

  const handleSaveAndPrint = () => {
    const result = draftStorage.save(form.getValues());
    if (result.saved && result.imageSkipped) {
      setOutputMessage(
        'Details saved. Uploaded signature exceeded the 204800-character limit and was not retained.',
      );
    } else if (result.saved) {
      setOutputMessage('Details saved in this browser.');
    } else {
      setOutputMessage('Details could not be saved in this browser. The receipt will still print.');
    }
    printReceipt();
  };

  const handleJustPrint = () => {
    setOutputMessage('Details were not saved.');
    printReceipt();
  };

  const handleClearSaved = () => {
    if (!window.confirm('Clear saved salary slip details from this browser?')) return;
    setOutputMessage(
      draftStorage.clear()
        ? 'Saved salary slip data cleared.'
        : 'Saved data could not be cleared in this browser.',
    );
  };

  const handleReset = () => {
    form.reset(createDefaultValues());
    setOutputMessage('');
  };

  return (
    <main className="tool-shell">
      <h1 className="tool-title">Driver Salary Slip</h1>
      <div className="workspace">
        <section aria-labelledby="form-title" className="form-panel">
          <SalarySlipForm
            form={form}
            isDownloading={isDownloading}
            outputPending={isPrinting || isDownloading}
            outputMessage={outputMessage}
            onRequestPrint={handlePrintRequest}
            onRequestDownload={handleDownloadRequest}
            onReset={handleReset}
            onClearSaved={handleClearSaved}
          />
        </section>
        <section aria-labelledby="preview-title" className="preview-panel">
          <div className="preview-heading">
            <h2 id="preview-title">Receipt preview</h2>
            <fieldset className="preview-template">
              <legend className="field-label hidden">Receipt template</legend>
              <div className="template-options">
                {templates.map((template) => (
                  <label className="template-option" key={template.id}>
                    <input
                      checked={values.template === template.id}
                      form="salary-slip-form"
                      type="radio"
                      value={template.id}
                      {...form.register('template')}
                    />
                    <span className="template-option__copy">
                      <strong>{template.name}</strong>
                      <small>{template.detail}</small>
                      <svg
                        aria-hidden="true"
                        className="template-option__sheet"
                        focusable="false"
                        viewBox="0 0 32 46"
                        preserveAspectRatio="xMaxYMid meet"
                      >
                        <rect
                          className="template-option__page"
                          x="1"
                          y="1"
                          width="30"
                          height="44"
                          rx="2"
                        />
                        <path d="M6 7h15" strokeWidth="2" />
                        <path d={template.silhouette} />
                      </svg>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <ReceiptPreview data={receiptData} />
        </section>
      </div>
      <PrintDialog
        open={printDialogOpen}
        pending={isPrinting}
        onCancel={() => setPrintDialogOpen(false)}
        onJustPrint={handleJustPrint}
        onSaveAndPrint={handleSaveAndPrint}
      />
    </main>
  );
}

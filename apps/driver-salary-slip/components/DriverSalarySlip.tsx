'use client';

import { PrintDialog } from '@/components/PrintDialog';
import { ReceiptPreview } from '@/components/ReceiptPreview';
import { SalarySlipForm } from '@/components/SalarySlipForm';
import { ThemeControl } from '@/components/ThemeControl';
import { useSignatureImage } from '@/hooks/useSignatureImage';
import { createDefaultValues } from '@/lib/driver-salary-slip/create-default-values';
import { draftStorage } from '@/lib/driver-salary-slip/draft-storage';
import { type FormValues, formSchema } from '@/lib/driver-salary-slip/form-schema';
import { receiptDataFromForm } from '@/lib/driver-salary-slip/receipt-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { type FieldPath, useForm, useWatch } from 'react-hook-form';

type DriverSalarySlipProps = {
  initialDate: string;
};

export function DriverSalarySlip({ initialDate }: DriverSalarySlipProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(new Date(`${initialDate}T00:00:00`)),
    mode: 'onTouched',
  });
  const [printMessage, setPrintMessage] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printingRef = useRef(false);
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

  useEffect(() => {
    const finishPrint = () => {
      printingRef.current = false;
      setIsPrinting(false);
    };
    window.addEventListener('afterprint', finishPrint);
    return () => window.removeEventListener('afterprint', finishPrint);
  }, []);

  const printReceipt = () => {
    if (printingRef.current) return;
    printingRef.current = true;
    setIsPrinting(true);
    setPrintDialogOpen(false);
    requestAnimationFrame(() => {
      void (async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images, (image) => image.decode().catch(() => undefined)),
        );
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        try {
          window.print();
        } finally {
          printingRef.current = false;
          setIsPrinting(false);
        }
      })();
    });
  };

  const handlePrintRequest = form.handleSubmit(
    () => {
      setPrintMessage('');
      setPrintDialogOpen(true);
    },
    (errors) => {
      const firstInvalidField = Object.keys(errors)[0] as FieldPath<FormValues> | undefined;
      const firstError = firstInvalidField ? errors[firstInvalidField]?.message : undefined;
      const fieldLabel = firstInvalidField
        ? firstInvalidField.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
        : '';
      setPrintMessage(
        firstError && fieldLabel
          ? `${fieldLabel}: ${firstError}`
          : 'Complete required receipt details before printing.',
      );
      if (firstInvalidField) form.setFocus(firstInvalidField);
    },
  );

  const handleSaveAndPrint = () => {
    const result = draftStorage.save(form.getValues());
    if (result.saved && result.imageSkipped) {
      setPrintMessage(
        'Details saved. Uploaded signature exceeded the 204800-character limit and was not retained.',
      );
    } else if (result.saved) {
      setPrintMessage('Details saved in this browser.');
    } else {
      setPrintMessage('Details could not be saved in this browser. The receipt will still print.');
    }
    printReceipt();
  };

  const handleJustPrint = () => {
    setPrintMessage('Details were not saved.');
    printReceipt();
  };

  const handleClearSaved = () => {
    if (!window.confirm('Clear saved salary slip details from this browser?')) return;
    setPrintMessage(
      draftStorage.clear()
        ? 'Saved salary slip data cleared.'
        : 'Saved data could not be cleared in this browser.',
    );
  };

  const handleReset = () => {
    form.reset(createDefaultValues());
    setPrintMessage('');
  };

  return (
    <main className="tool-shell">
      <header className="tool-header">
        <span aria-hidden="true" className="brand-mark">
          PK
        </span>
        <div className="tool-heading">
          <p className="eyebrow">PaperKit / Document tools</p>
          <h1>Driver Salary Slip</h1>
        </div>
        <ThemeControl />
      </header>
      <div className="workspace">
        <section aria-labelledby="form-title" className="form-panel">
          <div className="section-heading">
            <h2 id="form-title">Receipt details</h2>
            <p>Enter the driver, payer, vehicle and salary payment details.</p>
            <p className="section-heading__note">Declaration and signature image are optional.</p>
          </div>
          <SalarySlipForm
            form={form}
            onRequestPrint={handlePrintRequest}
            onReset={handleReset}
            onClearSaved={handleClearSaved}
          />
        </section>
        <section aria-labelledby="preview-title" className="preview-panel">
          <div className="preview-heading">
            <div>
              <p className="eyebrow">Live document</p>
              <h2 id="preview-title">Receipt preview</h2>
            </div>
            <span>Template {values.template} of 3</span>
          </div>
          <ReceiptPreview data={receiptData} />
          <p aria-live="polite" className="print-message">
            {printMessage}
          </p>
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

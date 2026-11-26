'use client';

import { currencyOptions } from '@driver/lib/driver-salary-slip/currency-options';
import { type FormValues, formSchema } from '@driver/lib/driver-salary-slip/form-schema';
import { readSignatureImage } from '@driver/lib/driver-salary-slip/read-signature-image';
import { Button } from '@repo/ui/Button';
import { FieldWrapper } from '@repo/ui/FieldWrapper';
import { Input } from '@repo/ui/Input';
import { Select } from '@repo/ui/Select';
import { CheckCircle2, ChevronDown, Download, Printer, RotateCcw, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useController, useWatch } from 'react-hook-form';

type SalarySlipFormProps = {
  form: UseFormReturn<FormValues>;
  isDownloading: boolean;
  outputPending: boolean;
  outputMessage: string;
  onRequestPrint: () => void;
  onRequestDownload: () => void;
  onReset: () => void;
  onClearSaved: () => void;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function dateInputValue(date: Date): string {
  if (!Number.isFinite(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function SalarySlipForm({
  form,
  isDownloading,
  outputPending,
  outputMessage,
  onRequestPrint,
  onRequestDownload,
  onReset,
  onClearSaved,
}: SalarySlipFormProps) {
  const [signatureError, setSignatureError] = useState('');
  const [currencySearch, setCurrencySearch] = useState(
    currencyOptions.find(({ id }) => id === form.getValues('currencyId'))?.label ?? '',
  );
  const values = useWatch({ control: form.control }) as FormValues;
  const signature = values.uploadedSignature;
  const hasSignature = Boolean(values.driverName.trim() || signature);
  const isReceiptReady = formSchema.safeParse(values).success;
  const { errors } = form.formState;
  const fieldError = (name: keyof FormValues) => errors[name]?.message?.toString();
  const { field: paymentDateField } = useController({
    control: form.control,
    name: 'paymentDate',
  });

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setSignatureError('');
    try {
      const image = await readSignatureImage(file);
      form.setValue('uploadedSignature', image, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      setSignatureError(
        error instanceof Error ? error.message : 'Signature image could not be opened.',
      );
    }
  };

  return (
    <form
      className="salary-form"
      id="salary-slip-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onRequestPrint();
      }}
    >
      <fieldset className="form-section">
        <legend>Driver and payer</legend>
        <div className="field-grid field-grid--people">
          <div className="field-stack">
            <label className="field-label" htmlFor="driver-salutation">
              Driver salutation
            </label>
            <Select
              id="driver-salutation"
              value={values.driverSalutation}
              {...form.register('driverSalutation')}
            >
              <option>Mr.</option>
              <option>Mrs.</option>
            </Select>
          </div>
          <FieldWrapper id="driver-name" label="Driver name" error={fieldError('driverName')}>
            <Input
              autoComplete="section-driver name"
              autoCapitalize="words"
              required
              value={values.driverName}
              {...form.register('driverName')}
            />
          </FieldWrapper>
          <div className="field-stack">
            <label className="field-label" htmlFor="payer-salutation">
              Payer salutation
            </label>
            <Select
              id="payer-salutation"
              value={values.payerSalutation}
              {...form.register('payerSalutation')}
            >
              <option>Mr.</option>
              <option>Mrs.</option>
            </Select>
          </div>
          <FieldWrapper id="payer-name" label="Payer name" error={fieldError('payerName')}>
            <Input
              autoComplete="section-payer name"
              autoCapitalize="words"
              required
              value={values.payerName}
              {...form.register('payerName')}
            />
          </FieldWrapper>
        </div>
        <FieldWrapper
          id="vehicle-number"
          label="Vehicle number"
          error={fieldError('vehicleNumber')}
        >
          <Input
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="e.g. KA03AB1234"
            required
            spellCheck={false}
            value={values.vehicleNumber}
            {...form.register('vehicleNumber')}
          />
        </FieldWrapper>
      </fieldset>

      <fieldset className="form-section">
        <legend>Payment</legend>
        <div className="field-grid">
          <div className="field-stack">
            <label className="field-label" htmlFor="payment-date">
              Payment date
            </label>
            <Input
              id="payment-date"
              max="9999-12-31"
              min="1900-01-01"
              name={paymentDateField.name}
              onBlur={paymentDateField.onBlur}
              ref={paymentDateField.ref}
              required
              type="date"
              value={dateInputValue(values.paymentDate)}
              aria-invalid={Boolean(fieldError('paymentDate'))}
              aria-describedby="payment-date-error"
              onChange={(event) =>
                paymentDateField.onChange(
                  new Date(event.target.value ? `${event.target.value}T00:00:00` : Number.NaN),
                )
              }
            />
            <div
              id="payment-date-error"
              aria-live="polite"
              aria-atomic="true"
              className="field-error"
            >
              {fieldError('paymentDate') ?? ''}
            </div>
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="salary-month">
              Salary month
            </label>
            <Select
              aria-invalid={Boolean(fieldError('salaryMonth'))}
              aria-describedby="salary-month-error"
              id="salary-month"
              required
              value={values.salaryMonth}
              {...form.register('salaryMonth')}
            >
              {months.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </Select>
            <div
              id="salary-month-error"
              aria-live="polite"
              aria-atomic="true"
              className="field-error"
            >
              {fieldError('salaryMonth') ?? ''}
            </div>
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="salary-amount">
              Salary amount
            </label>
            <Input
              id="salary-amount"
              inputMode="decimal"
              min="0"
              required
              step="any"
              type="number"
              value={Number.isFinite(values.salaryAmount) ? values.salaryAmount : ''}
              aria-invalid={Boolean(fieldError('salaryAmount'))}
              aria-describedby="salary-amount-error"
              {...form.register('salaryAmount', { valueAsNumber: true })}
            />
            <div
              id="salary-amount-error"
              aria-live="polite"
              aria-atomic="true"
              className="field-error"
            >
              {fieldError('salaryAmount') ?? ''}
            </div>
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="currency">
              Currency
            </label>
            <Input
              aria-invalid={Boolean(fieldError('currencyId'))}
              aria-describedby="currency-error"
              id="currency"
              list="currency-options"
              autoComplete="off"
              required
              value={currencySearch}
              onChange={(event) => {
                setCurrencySearch(event.target.value);
                const option = currencyOptions.find(({ label }) => label === event.target.value);
                if (option) form.setValue('currencyId', option.id, { shouldDirty: true });
              }}
            />
            <datalist id="currency-options">
              {currencyOptions.map(({ id, label }) => (
                <option key={id} value={label} />
              ))}
            </datalist>
            <div id="currency-error" aria-live="polite" aria-atomic="true" className="field-error">
              {fieldError('currencyId') ?? ''}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Declaration and images</legend>
        <label className="field-stack" htmlFor="declaration">
          <span className="field-label">
            Declaration <span className="field-optional">Optional</span>
          </span>
          <textarea
            className="pk-input declaration-input"
            id="declaration"
            rows={4}
            value={values.declaration}
            {...form.register('declaration')}
            onChange={(event) =>
              form.setValue('declaration', event.target.value, { shouldDirty: true })
            }
          />
        </label>
        <label className="toggle-row">
          <input
            checked={values.stampEnabled}
            type="checkbox"
            {...form.register('stampEnabled')}
            onChange={(event) =>
              form.setValue('stampEnabled', event.target.checked, { shouldDirty: true })
            }
          />
          <span>Include revenue stamp image</span>
        </label>
        <div className="signature-controls">
          <div className="signature-upload-row">
            <div>
              <p className="field-label">Driver signature</p>
              <p className="field-hint">A name signature appears when no image is uploaded.</p>
            </div>
            <label className="pk-button pk-button--outline upload-button">
              <Upload aria-hidden="true" />
              <span>Upload image</span>
              <input
                accept="image/png,image/jpeg,image/webp"
                aria-label="Upload signature image"
                className="visually-hidden"
                type="file"
                onChange={(event) => {
                  void handleUpload(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </label>
          </div>
          {signature ? (
            <div className="signature-preview-row">
              <img
                alt="Uploaded signature preview"
                className="signature-thumbnail"
                src={signature}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue('uploadedSignature', '', { shouldDirty: true })}
              >
                <X aria-hidden="true" /> Remove upload
              </Button>
            </div>
          ) : null}
          <p aria-live="polite" className="field-error signature-error">
            {signatureError}
          </p>
          <details className="signature-adjustments">
            <summary>
              Adjust signature position
              <ChevronDown aria-hidden="true" />
            </summary>
            <div hidden={!hasSignature}>
              <div className="adjustment-list">
                <label className="range-row" htmlFor="signature-x">
                  <span>Horizontal</span>
                  <input
                    id="signature-x"
                    max="100"
                    min="-100"
                    step="1"
                    type="range"
                    value={values.signatureOffsetX}
                    {...form.register('signatureOffsetX')}
                    onChange={(event) =>
                      form.setValue('signatureOffsetX', Number(event.target.value), {
                        shouldDirty: true,
                      })
                    }
                  />
                  <output>{values.signatureOffsetX}px</output>
                </label>
                <label className="range-row" htmlFor="signature-y">
                  <span>Vertical</span>
                  <input
                    id="signature-y"
                    max="100"
                    min="-100"
                    step="1"
                    type="range"
                    value={values.signatureOffsetY}
                    {...form.register('signatureOffsetY')}
                    onChange={(event) =>
                      form.setValue('signatureOffsetY', Number(event.target.value), {
                        shouldDirty: true,
                      })
                    }
                  />
                  <output>{values.signatureOffsetY}px</output>
                </label>
                <label className="range-row" htmlFor="signature-rotation">
                  <span>Rotation</span>
                  <input
                    id="signature-rotation"
                    max="45"
                    min="-45"
                    step="1"
                    type="range"
                    value={values.signatureRotation}
                    {...form.register('signatureRotation')}
                    onChange={(event) =>
                      form.setValue('signatureRotation', Number(event.target.value), {
                        shouldDirty: true,
                      })
                    }
                  />
                  <output>{values.signatureRotation}°</output>
                </label>
                <label className="range-row" htmlFor="signature-scale">
                  <span>Scale</span>
                  <input
                    id="signature-scale"
                    max="2"
                    min="0.5"
                    step="0.05"
                    type="range"
                    value={values.signatureScale}
                    {...form.register('signatureScale')}
                    onChange={(event) =>
                      form.setValue('signatureScale', Number(event.target.value), {
                        shouldDirty: true,
                      })
                    }
                  />
                  <output>{Math.round(values.signatureScale * 100)}%</output>
                </label>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.setValue('signatureOffsetX', 0);
                  form.setValue('signatureOffsetY', 0);
                  form.setValue('signatureRotation', 0);
                  form.setValue('signatureScale', 1);
                }}
              >
                <RotateCcw aria-hidden="true" /> Reset signature position
              </Button>
            </div>
            {!hasSignature && <p className="field-hint">No driver signature yet.</p>}
          </details>
        </div>
      </fieldset>

      <div className="form-actions">
        <Button type="submit" disabled={outputPending}>
          <Printer aria-hidden="true" /> Print receipt
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={outputPending}
          aria-busy={isDownloading}
          onClick={onRequestDownload}
        >
          <Download aria-hidden="true" /> Download PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          className="icon-button"
          aria-label="Reset form"
          title="Reset form"
          onClick={onReset}
        >
          <RotateCcw aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="icon-button"
          aria-label="Clear saved data"
          title="Clear saved data"
          onClick={onClearSaved}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <output
        aria-live="polite"
        className={`receipt-status${isReceiptReady ? ' receipt-status--ready' : ''}`}
      >
        {isReceiptReady ? (
          <>
            <CheckCircle2 aria-hidden="true" className="receipt-status__icon" />
            Receipt ready
          </>
        ) : (
          'Complete required fields to prepare receipt.'
        )}
      </output>
      <p aria-live="polite" aria-atomic="true" className="receipt-output-message">
        {outputMessage}
      </p>
      <p className="privacy-note">
        Nothing is saved automatically. Save &amp; Print can retain these details and an uploaded
        signature in this browser.
      </p>
    </form>
  );
}

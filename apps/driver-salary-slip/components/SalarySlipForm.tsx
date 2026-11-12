'use client';

import { currencyOptions } from '@/lib/driver-salary-slip/currency-options';
import type { FormValues } from '@/lib/driver-salary-slip/form-schema';
import { readSignatureImage } from '@/lib/driver-salary-slip/read-signature-image';
import { Button } from '@repo/ui/Button';
import { FieldWrapper } from '@repo/ui/FieldWrapper';
import { Input } from '@repo/ui/Input';
import { Printer, RotateCcw, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

type SalarySlipFormProps = {
  form: UseFormReturn<FormValues>;
  onRequestPrint: () => void;
  onReset: () => void;
  onClearSaved: () => void;
};

const templates = [
  { id: '1', name: 'Split receipt', detail: 'Declaration and acknowledgement' },
  { id: '2', name: 'Summary', detail: 'Payment summary and acknowledgement' },
  { id: '3', name: 'Certification', detail: 'Compact single statement' },
] as const;

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
  onRequestPrint,
  onReset,
  onClearSaved,
}: SalarySlipFormProps) {
  const [signatureError, setSignatureError] = useState('');
  const values = useWatch({ control: form.control }) as FormValues;
  const signature = values.uploadedSignature;
  const driverName = values.driverName;
  const { errors } = form.formState;
  const fieldError = (name: keyof FormValues) => errors[name]?.message?.toString();
  const paymentDateRegistration = form.register('paymentDate');

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
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onRequestPrint();
      }}
    >
      <fieldset className="form-section">
        <legend>People</legend>
        <div className="field-grid field-grid--people">
          <div className="field-stack">
            <label className="field-label" htmlFor="driver-salutation">
              Driver salutation
            </label>
            <select
              className="pk-input pk-select"
              id="driver-salutation"
              value={values.driverSalutation}
              {...form.register('driverSalutation')}
              onChange={(event) =>
                form.setValue(
                  'driverSalutation',
                  event.target.value as FormValues['driverSalutation'],
                  { shouldDirty: true, shouldValidate: form.formState.isSubmitted },
                )
              }
            >
              <option>Mr.</option>
              <option>Mrs.</option>
            </select>
          </div>
          <FieldWrapper id="driver-name" label="Driver name" error={fieldError('driverName')}>
            <Input
              autoComplete="name"
              value={values.driverName}
              {...form.register('driverName')}
              onChange={(event) =>
                form.setValue('driverName', event.target.value, {
                  shouldDirty: true,
                  shouldValidate: form.formState.isSubmitted,
                })
              }
            />
          </FieldWrapper>
          <div className="field-stack">
            <label className="field-label" htmlFor="payer-salutation">
              Payer salutation
            </label>
            <select
              className="pk-input pk-select"
              id="payer-salutation"
              value={values.payerSalutation}
              {...form.register('payerSalutation')}
              onChange={(event) =>
                form.setValue(
                  'payerSalutation',
                  event.target.value as FormValues['payerSalutation'],
                  { shouldDirty: true, shouldValidate: form.formState.isSubmitted },
                )
              }
            >
              <option>Mr.</option>
              <option>Mrs.</option>
            </select>
          </div>
          <FieldWrapper id="payer-name" label="Payer name" error={fieldError('payerName')}>
            <Input
              autoComplete="name"
              value={values.payerName}
              {...form.register('payerName')}
              onChange={(event) =>
                form.setValue('payerName', event.target.value, {
                  shouldDirty: true,
                  shouldValidate: form.formState.isSubmitted,
                })
              }
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
            maxLength={10}
            value={values.vehicleNumber}
            {...form.register('vehicleNumber')}
            onChange={(event) =>
              form.setValue('vehicleNumber', event.target.value, {
                shouldDirty: true,
                shouldValidate: form.formState.isSubmitted,
              })
            }
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
              name={paymentDateRegistration.name}
              onBlur={paymentDateRegistration.onBlur}
              ref={paymentDateRegistration.ref}
              type="date"
              value={dateInputValue(values.paymentDate)}
              aria-invalid={Boolean(fieldError('paymentDate'))}
              onChange={(event) => {
                const date = event.target.value
                  ? new Date(`${event.target.value}T00:00:00`)
                  : new Date(Number.NaN);
                form.setValue('paymentDate', date, {
                  shouldDirty: true,
                  shouldValidate: form.formState.isSubmitted,
                });
              }}
            />
            <output aria-live="polite" className="field-error">
              {fieldError('paymentDate') ?? ''}
            </output>
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="salary-month">
              Salary month
            </label>
            <select
              aria-invalid={Boolean(fieldError('salaryMonth'))}
              className="pk-input pk-select"
              id="salary-month"
              value={values.salaryMonth}
              {...form.register('salaryMonth')}
              onChange={(event) =>
                form.setValue('salaryMonth', event.target.value as FormValues['salaryMonth'], {
                  shouldDirty: true,
                  shouldValidate: form.formState.isSubmitted,
                })
              }
            >
              {months.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <output aria-live="polite" className="field-error">
              {fieldError('salaryMonth') ?? ''}
            </output>
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="salary-amount">
              Salary amount
            </label>
            <Input
              id="salary-amount"
              inputMode="decimal"
              min="0"
              step="any"
              type="number"
              value={Number.isFinite(values.salaryAmount) ? values.salaryAmount : ''}
              aria-invalid={Boolean(fieldError('salaryAmount'))}
              {...form.register('salaryAmount', { valueAsNumber: true })}
            />
            <output aria-live="polite" className="field-error">
              {fieldError('salaryAmount') ?? ''}
            </output>
          </div>
          <div className="field-stack">
            <label className="field-label" htmlFor="currency">
              Currency
            </label>
            <select
              aria-invalid={Boolean(fieldError('currencyId'))}
              className="pk-input pk-select"
              id="currency"
              value={values.currencyId}
              {...form.register('currencyId')}
              onChange={(event) =>
                form.setValue('currencyId', event.target.value, {
                  shouldDirty: true,
                  shouldValidate: form.formState.isSubmitted,
                })
              }
            >
              {currencyOptions.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <output aria-live="polite" className="field-error">
              {fieldError('currencyId') ?? ''}
            </output>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Receipt template</legend>
        <div className="template-options">
          {templates.map((template) => (
            <label className="template-option" key={template.id}>
              <input
                checked={values.template === template.id}
                type="radio"
                value={template.id}
                {...form.register('template')}
                onChange={() => form.setValue('template', template.id, { shouldDirty: true })}
              />
              <span className="template-option__number">0{template.id}</span>
              <span className="template-option__copy">
                <strong>{template.name}</strong>
                <small>{template.detail}</small>
              </span>
            </label>
          ))}
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
          {driverName.trim() || signature ? (
            <>
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
            </>
          ) : null}
        </div>
      </fieldset>

      <div className="form-actions">
        <Button type="submit">
          <Printer aria-hidden="true" /> Print receipt
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw aria-hidden="true" /> Reset form
        </Button>
        <Button type="button" variant="outline" onClick={onClearSaved}>
          <X aria-hidden="true" /> Clear saved data
        </Button>
      </div>
      <p className="privacy-note">
        Nothing is saved automatically. Save &amp; Print can retain these details and an uploaded
        signature in this browser.
      </p>
    </form>
  );
}

import { z } from 'zod';
import { createDefaultValues } from './create-default-values';
import { currencyOptions } from './currency-options';
import { DEFAULT_DECLARATION } from './default-declaration';
import { type FormValues, formSchema } from './form-schema';

const STORAGE_KEY = 'paperkit.driver-salary-slip.draft';
const IMAGE_SIZE_LIMIT = 204800;
const currencyIds = new Set(currencyOptions.map(({ id }) => id));

const storedDraftSchema = z.object({
  version: z.literal(1),
  template: z.enum(['1', '2', '3']),
  driverSalutation: z.enum(['Mr.', 'Mrs.']),
  driverName: z.string().max(50),
  payerSalutation: z.enum(['Mr.', 'Mrs.']),
  payerName: z.string().max(50),
  vehicleNumber: z.string().max(10),
  paymentDay: z.number().int().min(1).max(31),
  currencyId: z.string().refine((value) => currencyIds.has(value)),
  salaryAmount: z.number().finite().min(0),
  uploadedSignature: z
    .string()
    .max(IMAGE_SIZE_LIMIT)
    .refine(
      (value) => value === '' || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
    ),
  declaration: z.string().nullable(),
  stampEnabled: z.boolean(),
  signatureOffsetX: z.number().int().min(-100).max(100),
  signatureOffsetY: z.number().int().min(-100).max(100),
  signatureRotation: z.number().int().min(-45).max(45),
  signatureScale: z.number().min(0.5).max(2),
});

type SaveDraftResult = {
  saved: boolean;
  imageSkipped: boolean;
  reason: 'unavailable' | 'quota' | 'invalid' | null;
};

function recordFromValues(values: FormValues): {
  record: z.infer<typeof storedDraftSchema>;
  imageSkipped: boolean;
} {
  const imageSkipped = values.uploadedSignature.length > IMAGE_SIZE_LIMIT;
  return {
    imageSkipped,
    record: {
      version: 1,
      template: values.template,
      driverSalutation: values.driverSalutation,
      driverName: values.driverName,
      payerSalutation: values.payerSalutation,
      payerName: values.payerName,
      vehicleNumber: values.vehicleNumber,
      paymentDay: values.paymentDate.getDate(),
      currencyId: values.currencyId,
      salaryAmount: values.salaryAmount,
      uploadedSignature: imageSkipped ? '' : values.uploadedSignature,
      declaration: values.declaration === DEFAULT_DECLARATION ? null : values.declaration,
      stampEnabled: values.stampEnabled,
      signatureOffsetX: values.signatureOffsetX,
      signatureOffsetY: values.signatureOffsetY,
      signatureRotation: values.signatureRotation,
      signatureScale: values.signatureScale,
    },
  };
}

function valuesFromRecord(value: unknown, now: Date): FormValues | null {
  const parsed = storedDraftSchema.safeParse(value);
  if (!parsed.success) return null;

  const stored = parsed.data;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const paymentDate = new Date(now.getFullYear(), now.getMonth(), stored.paymentDay);
  const restoredDate = paymentDate.getMonth() === now.getMonth() ? paymentDate : today;
  const candidate = {
    ...createDefaultValues(now),
    template: stored.template,
    driverSalutation: stored.driverSalutation,
    driverName: stored.driverName,
    payerSalutation: stored.payerSalutation,
    payerName: stored.payerName,
    vehicleNumber: stored.vehicleNumber,
    paymentDate: restoredDate,
    currencyId: stored.currencyId,
    salaryAmount: stored.salaryAmount,
    uploadedSignature: stored.uploadedSignature,
    declaration: stored.declaration ?? DEFAULT_DECLARATION,
    stampEnabled: stored.stampEnabled,
    signatureOffsetX: stored.signatureOffsetX,
    signatureOffsetY: stored.signatureOffsetY,
    signatureRotation: stored.signatureRotation,
    signatureScale: stored.signatureScale,
  };

  const validated = formSchema.safeParse(candidate);
  return validated.success ? validated.data : null;
}

export const draftStorage = {
  save(values: FormValues): SaveDraftResult {
    const parsedValues = formSchema.safeParse(values);
    if (!parsedValues.success) {
      return { saved: false, imageSkipped: false, reason: 'invalid' };
    }

    try {
      const { record, imageSkipped } = recordFromValues(parsedValues.data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      return { saved: true, imageSkipped, reason: null };
    } catch (error) {
      const reason =
        error instanceof Error && error.name === 'QuotaExceededError' ? 'quota' : 'unavailable';
      return { saved: false, imageSkipped: false, reason };
    }
  },

  load(now: Date = new Date()): FormValues | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? valuesFromRecord(JSON.parse(raw) as unknown, now) : null;
    } catch {
      return null;
    }
  },

  clear(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  },
};

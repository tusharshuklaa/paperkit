import { z } from 'zod';
import { currencyOptions } from './currency-options';

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

const currencyIds = new Set(currencyOptions.map(({ id }) => id));
const salaryAmountSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    return value.trim() === '' ? undefined : Number(value);
  },
  z
    .number({
      required_error: 'Enter a salary amount.',
      invalid_type_error: 'Enter a salary amount.',
    })
    .finite('Enter a finite salary amount.')
    .min(0, 'Salary amount must be zero or more.'),
);
const numericTransform = <Schema extends z.ZodTypeAny>(schema: Schema) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') return value;
    return value.trim() === '' ? undefined : Number(value);
  }, schema);

export const formSchema = z.object({
  template: z.enum(['1', '2', '3']),
  driverSalutation: z.enum(['Mr.', 'Mrs.']),
  driverName: z
    .string()
    .max(50, 'Driver name must be 50 characters or fewer.')
    .refine((value) => value.trim().length >= 2, 'Enter a driver name.'),
  payerSalutation: z.enum(['Mr.', 'Mrs.']),
  payerName: z
    .string()
    .max(50, 'Payer name must be 50 characters or fewer.')
    .refine((value) => value.trim().length >= 2, 'Enter a payer name.'),
  vehicleNumber: z
    .string()
    .max(10, 'Vehicle number must be 10 characters or fewer.')
    .refine((value) => value.trim().length >= 2, 'Enter a vehicle number.'),
  paymentDate: z
    .date({
      errorMap: () => ({ message: 'Enter a valid payment date.' }),
    })
    .min(new Date(1900, 0, 1), 'Payment date must be 1 January 1900 or later.'),
  currencyId: z.string().refine((value) => currencyIds.has(value), 'Choose a listed currency.'),
  salaryAmount: salaryAmountSchema,
  salaryMonth: z.enum(months),
  declaration: z.string(),
  stampEnabled: z.boolean(),
  uploadedSignature: z.string(),
  signatureOffsetX: numericTransform(z.number().int().min(-100).max(100)),
  signatureOffsetY: numericTransform(z.number().int().min(-100).max(100)),
  signatureRotation: numericTransform(z.number().int().min(-45).max(45)),
  signatureScale: numericTransform(
    z
      .number()
      .min(0.5)
      .max(2)
      .refine((value) => Math.abs((value - 0.5) * 20 - Math.round((value - 0.5) * 20)) < 1e-8),
  ),
});

export type FormValues = z.infer<typeof formSchema>;

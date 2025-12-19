import { z } from 'zod';

export const dealSchema = z.object({
  name: z.string().min(1, 'Deal name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().optional(),
  clientId: z.string().optional(),
  propertyType: z.enum([
    'OFFICE',
    'RETAIL',
    'INDUSTRIAL',
    'MULTIFAMILY',
    'HOSPITALITY',
    'LAND',
    'MIXED_USE',
    'OTHER',
  ]),
  transactionType: z.enum(['ACQUISITION', 'DISPOSITION', 'REFINANCE', 'LEASE']),
  status: z
    .enum([
      'DRAFT',
      'ACTIVE',
      'UNDER_CONTRACT',
      'DUE_DILIGENCE',
      'CLOSING',
      'CLOSED',
      'TERMINATED',
      'ON_HOLD',
    ])
    .default('ACTIVE'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  propertyAddress: z.string().optional(),
  propertyCity: z.string().optional(),
  propertyState: z.string().max(2, 'Use 2-letter state code').optional(),
  propertyZip: z.string().max(10).optional(),
  purchasePrice: z.coerce.number().positive().optional(),
  earnestMoney: z.coerce.number().positive().optional(),
  contractDate: z.coerce.date().optional(),
  dueDiligenceEnd: z.coerce.date().optional(),
  closingDate: z.coerce.date().optional(),
});

export type DealFormValues = z.infer<typeof dealSchema>;

import { z } from 'zod'

export const createEmployeeBankSchema = z.object({
  employeerId: z.string().uuid(),
  bankName: z.string(),
  accountNumber: z.string(),
  accountType: z.string(),
  accountHolder: z.string(),
})

export const updateEmployeeBankSchema = createEmployeeBankSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })

export const EmployeeBankResponseSchema = z.object({
  sucess: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string().uuid(),
    employeerId: z.string().uuid(),
    bankName: z.string(),
    accountNumber: z.string(),
    accountType: z.string(),
    accountHolder: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})

export const EmployeeBankListResponseSchema = z.object({
  sucess: z.boolean(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      employeerId: z.string().uuid(),
      bankName: z.string(),
      accountNumber: z.string(),
      accountType: z.string(),
      accountHolder: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
})

export type CreateEmployeeBankType = z.infer<typeof createEmployeeBankSchema>
export type UpdateEmployeeBankType = z.infer<typeof updateEmployeeBankSchema>

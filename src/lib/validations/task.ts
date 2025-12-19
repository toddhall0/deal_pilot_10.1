import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'COMPLETED', 'CANCELLED'])
    .default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().optional(),
  milestoneId: z.string().optional(),
  parentId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const milestoneSchema = z.object({
  name: z.string().min(1, 'Milestone name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});

export type MilestoneFormValues = z.infer<typeof milestoneSchema>;
